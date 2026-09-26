import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { products } from './catalog';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { provisionDeliveryForOrder } from './deliveryService';
import cookieParser from 'cookie-parser';
import authRouter, { authenticateUser } from './auth';
import { storageService } from './storage/storageService';

const app = express();
const prisma = new PrismaClient();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
import adminRouter from './admin';

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder',
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customer, billing, paymentMethod, items } = req.body;

    if (!customer || !billing || !paymentMethod || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid request payload', code: 'INVALID_PAYLOAD' });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.availability !== 'in_stock') {
        return res.status(400).json({ success: false, message: `Product ${item.productId} is not available`, code: 'PRODUCT_UNAVAILABLE' });
      }

      let unitPrice = product.price;
      let variantName = null;

      if (item.variantId) {
        const variant = product.variants?.find(v => v.id === item.variantId);
        if (!variant) {
          return res.status(400).json({ success: false, message: `Variant ${item.variantId} not found`, code: 'INVALID_VARIANT' });
        }
        unitPrice = variant.price !== undefined ? variant.price : product.price;
        variantName = variant.name;
      }

      const quantity = parseInt(item.quantity, 10);
      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid quantity', code: 'INVALID_QUANTITY' });
      }

      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;

      validatedItems.push({
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        variantId: item.variantId || null,
        variantName,
        quantity,
        unitPrice,
        lineTotal
      });
    }

    const discount = 0;
    const total = subtotal - discount;

    const orderNumber = `TFS-${new Date().toISOString().replace(/\D/g, '').slice(0, 8)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Optional authenticated user
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'supersecretaccess') as any;
        if (payload.type === 'access') {
          userId = payload.sub;
        }
      } catch (e) {
        // ignore invalid token for checkout
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          customerFirstName: customer.firstName,
          customerLastName: customer.lastName,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          billingAddress1: billing.addressLine1,
          billingAddress2: billing.addressLine2 || null,
          billingCity: billing.city,
          billingState: billing.state,
          billingPostalCode: billing.postalCode,
          billingCountry: billing.country,
          paymentMethod,
          subtotal,
          discount,
          total,
          items: {
            create: validatedItems
          }
        },
        include: { items: true }
      });
      return newOrder;
    });

    res.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        subtotal: order.subtotal,
        discount: order.discount,
        total: order.total,
        currency: order.currency
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: 'Unable to create order', code: 'INTERNAL_ERROR' });
  }
});

app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { orderNumber } = req.body;
    if (!orderNumber) {
      return res.status(400).json({ success: false, message: 'Order number is required' });
    }

    const order = await prisma.order.findUnique({ where: { orderNumber } });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.paymentStatus === 'PAID') {
      return res.status(400).json({ success: false, message: 'This order has already been paid.' });
    }

    // Create Razorpay order
    const options = {
      amount: order.total * 100, // paise
      currency: order.currency,
      receipt: order.orderNumber,
    };

    const rzpOrder = await razorpay.orders.create(options);

    // Create local payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        providerOrderId: rzpOrder.id,
        amount: order.total,
        currency: order.currency,
        status: 'CREATED'
      }
    });

    res.json({
      success: true,
      data: {
        gatewayOrderId: rzpOrder.id,
        amount: order.total,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        customer: {
          name: `${order.customerFirstName} ${order.customerLastName}`,
          email: order.customerEmail,
          contact: order.customerPhone
        }
      }
    });

  } catch (error: any) {
    console.error('Create payment order error:', error);
    res.status(500).json({ success: false, message: 'Unable to start payment. Please try again.', code: 'PAYMENT_ERROR' });
  }
});

app.post('/api/payments/verify', async (req, res) => {
  try {
    const { orderNumber, gatewayOrderId, gatewayPaymentId, gatewaySignature } = req.body;

    if (!orderNumber || !gatewayOrderId || !gatewayPaymentId || !gatewaySignature) {
      return res.status(400).json({ success: false, message: 'Missing verification parameters' });
    }

    // Find local order and payment
    const order = await prisma.order.findUnique({ where: { orderNumber }, include: { payments: true } });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const payment = order.payments.find(p => p.providerOrderId === gatewayOrderId);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    if (payment.status === 'CAPTURED' || order.paymentStatus === 'PAID') {
      return res.json({ success: true, message: 'Already verified' });
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder');
    hmac.update(`${gatewayOrderId}|${gatewayPaymentId}`);
    const expectedSignature = hmac.digest('hex');

    if (expectedSignature !== gatewaySignature) {
      // Signature mismatch
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' }
      });
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Optionally verify with razorpay API directly (Razorpay SDK fetch payment)
    const rzpPayment = await razorpay.payments.fetch(gatewayPaymentId);
    if (rzpPayment.status !== 'captured' || rzpPayment.amount !== payment.amount * 100) {
       return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Atomic update
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          providerPaymentId: gatewayPaymentId,
          status: 'CAPTURED',
          method: rzpPayment.method,
          signatureVerified: true,
          paidAt: new Date()
        }
      });
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'PAID'
        }
      });
    });

    // Provision digital goods asynchronously or synchronously
    try {
      await provisionDeliveryForOrder(order.id);
    } catch (e) {
      console.error('Delivery provisioning failed:', e);
      // We still return success for payment, delivery can be retried/recovered
    }

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Payment verify error:', error);
    res.status(500).json({ success: false, message: 'Verification error' });
  }
});

app.post('/api/payments/webhook', async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_placeholder';
    const signature = req.headers['x-razorpay-signature'] as string;

    const body = JSON.stringify(req.body);
    const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;
    if (event === 'payment.captured') {
      const paymentEntity = req.body.payload.payment.entity;
      const orderId = paymentEntity.order_id; // providerOrderId
      
      const payment = await prisma.payment.findFirst({ where: { providerOrderId: orderId } });
      if (payment && payment.status !== 'CAPTURED') {
        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { id: payment.id },
            data: {
              providerPaymentId: paymentEntity.id,
              status: 'CAPTURED',
              method: paymentEntity.method,
              paidAt: new Date(),
              signatureVerified: true
            }
          });
          await tx.order.update({
            where: { id: payment.orderId },
            data: {
              status: 'CONFIRMED',
              paymentStatus: 'PAID'
            }
          });
        });

        try {
          await provisionDeliveryForOrder(payment.orderId);
        } catch (e) {
          console.error('Webhook delivery provisioning failed:', e);
        }
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook error');
  }
});

app.get('/api/orders/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { 
        items: true,
        licenses: true,
        deliveries: true
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found', code: 'NOT_FOUND' });
    }

    res.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        discount: order.discount,
        total: order.total,
        currency: order.currency,
        createdAt: order.createdAt,
        items: order.items.map(i => ({
          productId: i.productId,
          productName: i.productName,
          variantName: i.variantName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          lineTotal: i.lineTotal
        })),
        deliveries: order.deliveries.map(d => {
          const license = order.licenses.find(l => l.id === d.licenseId);
          return {
            id: d.id,
            productId: d.productId,
            status: d.status,
            deliveryToken: d.deliveryToken,
            licenseKeyMasked: license ? `••••••••${license.licenseKey.slice(-4)}` : null,
            licenseKey: license ? license.licenseKey : null // Only for guest checkout immediate display
          };
        })
      }
    });
  } catch (error) {
    console.error('Fetch order error:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch order', code: 'INTERNAL_ERROR' });
  }
});

app.post('/api/licenses/validate', async (req, res) => {
  try {
    const { licenseKey } = req.body;
    if (!licenseKey) return res.status(400).json({ success: false, message: 'Missing license key' });

    const license = await prisma.license.findUnique({ where: { licenseKey } });
    if (!license) return res.status(404).json({ success: false, message: 'Invalid license' });

    res.json({
      success: true,
      data: {
        status: license.status,
        productId: license.productId,
        issuedAt: license.issuedAt,
        expiresAt: license.expiresAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
});

app.get('/api/deliveries/:deliveryToken/download', async (req, res) => {
  try {
    const { deliveryToken } = req.params;
    const delivery = await prisma.digitalDelivery.findUnique({
      where: { deliveryToken },
      include: { order: true, license: true, digitalAsset: true }
    });

    if (!delivery || delivery.status !== 'AVAILABLE') {
      return res.status(404).send('Delivery not available');
    }

    if (delivery.order.paymentStatus !== 'PAID' || delivery.order.status !== 'CONFIRMED') {
      return res.status(403).send('Order is not paid');
    }

    if (delivery.license && delivery.license.status !== 'ACTIVE') {
      return res.status(403).send('License is not active');
    }

    // Resolve DigitalAsset
    let asset = delivery.digitalAsset;
    if (!asset) {
      asset = await prisma.digitalAsset.findUnique({ where: { productId: delivery.productId } });
    }
    
    if (!asset || asset.status !== 'ACTIVE') {
      return res.status(404).send('Digital product is temporarily unavailable.');
    }

    const fileExists = await storageService.exists(asset.storageKey);
    if (!fileExists) {
      return res.status(404).send('Digital product is temporarily unavailable.');
    }

    // Increment download count
    await prisma.digitalDelivery.update({
      where: { id: delivery.id },
      data: {
        downloadCount: { increment: 1 },
        lastDownloadedAt: new Date()
      }
    });

    const safeFileName = asset.fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    res.setHeader('Content-disposition', `attachment; filename="${safeFileName}"`);
    res.setHeader('Content-type', asset.mimeType || 'application/octet-stream');
    if (asset.fileSize) {
      res.setHeader('Content-length', asset.fileSize.toString());
    }

    const stream = await storageService.download(asset.storageKey);
    stream.pipe(res);
  } catch (error) {
    res.status(500).send('Internal error');
  }
});

app.get('/api/users/me/orders', authenticateUser, async (req, res) => {
  try {
    const user = (req as any).user;
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
});

app.get('/api/users/me/orders/:orderNumber', authenticateUser, async (req, res) => {
  try {
    const user = (req as any).user;
    const { orderNumber } = req.params;
    const order = await prisma.order.findUnique({
      where: { orderNumber, userId: user.id },
      include: { items: true, licenses: true, deliveries: true }
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
});

app.get('/api/users/me/licenses', authenticateUser, async (req, res) => {
  try {
    const user = (req as any).user;
    const licenses = await prisma.license.findMany({
      where: { order: { userId: user.id } },
      include: { order: true }
    });
    res.json({ success: true, data: licenses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
});

app.get('/api/users/me/deliveries', authenticateUser, async (req, res) => {
  try {
    const user = (req as any).user;
    const deliveries = await prisma.digitalDelivery.findMany({
      where: { order: { userId: user.id } },
      include: { order: true, license: true }
    });
    res.json({ success: true, data: deliveries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
