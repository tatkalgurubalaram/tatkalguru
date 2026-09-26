import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from './auth';
import { products } from './catalog'; // We'll serve products from memory since they are static
import { storageService } from './storage/storageService';
import multer from 'multer';
import crypto from 'crypto';

const prisma = new PrismaClient();
const adminRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit
});

// Middleware to ensure user is admin
export const requireAdmin = async (req: any, res: any, next: any) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
  }
  next();
};

adminRouter.use(authenticateUser);
adminRouter.use(requireAdmin);

// Dashboard
adminRouter.get('/dashboard', async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const paidOrders = await prisma.order.count({ where: { paymentStatus: 'PAID' } });
    const customers = await prisma.user.count({ where: { role: 'USER' } });
    const activeLicenses = await prisma.license.count({ where: { status: 'ACTIVE' } });
    const deliveries = await prisma.digitalDelivery.count();

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: {
        metrics: {
          totalProducts: products.length,
          totalOrders,
          paidOrders,
          customers,
          activeLicenses,
          deliveries
        },
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Admin error' });
  }
});

// Products (Read-Only since they are static in catalog)
adminRouter.get('/products', (req, res) => {
  res.json({ success: true, data: products });
});

// Assets
adminRouter.get('/assets', async (req, res) => {
  const assets = await prisma.digitalAsset.findMany();
  res.json({ success: true, data: assets });
});

adminRouter.post('/assets/upload', upload.single('file'), async (req, res) => {
  try {
    const { productId, version } = req.body;
    const file = req.file;
    if (!file || !productId) {
      return res.status(400).json({ success: false, message: 'File and Product ID required' });
    }

    const storageKey = `assets/${crypto.randomBytes(16).toString('hex')}/${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    await storageService.upload(storageKey, file.buffer, file.mimetype);

    const asset = await prisma.digitalAsset.upsert({
      where: { productId },
      update: {
        fileName: file.originalname,
        storageKey,
        mimeType: file.mimetype,
        fileSize: file.size,
        version: version || '1.0.0',
        status: 'ACTIVE'
      },
      create: {
        productId,
        fileName: file.originalname,
        storageKey,
        mimeType: file.mimetype,
        fileSize: file.size,
        version: version || '1.0.0',
        status: 'ACTIVE'
      }
    });

    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// Orders
adminRouter.get('/orders', async (req, res) => {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: orders });
});

adminRouter.get('/orders/:orderNumber', async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { orderNumber: req.params.orderNumber },
    include: { items: true, licenses: true, deliveries: true }
  });
  if (!order) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: order });
});

// Customers
adminRouter.get('/customers', async (req, res) => {
  const customers = await prisma.user.findMany({
    where: { role: 'USER' },
    select: { id: true, email: true, firstName: true, lastName: true, phone: true, status: true, createdAt: true }
  });
  res.json({ success: true, data: customers });
});

// Licenses
adminRouter.get('/licenses', async (req, res) => {
  const licenses = await prisma.license.findMany({ orderBy: { createdAt: 'desc' } });
  // Map out the full license key to protect it by default, only returning a masked version unless specifically asked
  const maskedLicenses = licenses.map(l => ({
    ...l,
    licenseKey: `••••-••••-••••-${l.licenseKey.slice(-4)}`
  }));
  res.json({ success: true, data: maskedLicenses });
});

// Deliveries
adminRouter.get('/deliveries', async (req, res) => {
  const deliveries = await prisma.digitalDelivery.findMany({ orderBy: { createdAt: 'desc' } });
  const safeDeliveries = deliveries.map(d => {
    const { deliveryToken, ...rest } = d;
    return rest;
  });
  res.json({ success: true, data: safeDeliveries });
});

export default adminRouter;
