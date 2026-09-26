import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function generateLicenseKey(): string {
  // Example format: TFS-XXXX-XXXX-XXXX
  const part = () => crypto.randomBytes(2).toString('hex').toUpperCase();
  return `TFS-${part()}-${part()}-${part()}`;
}

export async function provisionDeliveryForOrder(orderId: string) {
  // Retrieve order with items
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (!order) throw new Error('Order not found');
  if (order.status !== 'CONFIRMED' || order.paymentStatus !== 'PAID') {
    throw new Error('Order not eligible for delivery');
  }

  // Idempotent provisioning: Check if deliveries already exist
  const existingDeliveries = await prisma.digitalDelivery.findMany({
    where: { orderId: order.id }
  });

  if (existingDeliveries.length > 0) {
    return; // Already provisioned
  }

  // Generate licenses and deliveries
  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      // Assuming all products are digital and require a license in this storefront
      for (let i = 0; i < item.quantity; i++) {
        let licenseKey = generateLicenseKey();
        
        // Handle extreme collision safely
        let exists = await tx.license.findUnique({ where: { licenseKey } });
        while (exists) {
          licenseKey = generateLicenseKey();
          exists = await tx.license.findUnique({ where: { licenseKey } });
        }

        const license = await tx.license.create({
          data: {
            licenseKey,
            orderId: order.id,
            orderItemId: item.id,
            productId: item.productId,
            variantId: item.variantId
          }
        });

        const deliveryToken = crypto.randomBytes(16).toString('hex');
        await tx.digitalDelivery.create({
          data: {
            deliveryToken,
            orderId: order.id,
            orderItemId: item.id,
            licenseId: license.id,
            productId: item.productId,
            status: 'AVAILABLE'
          }
        });
      }
    }
  });
}
