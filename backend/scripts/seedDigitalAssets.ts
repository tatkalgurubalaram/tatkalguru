import { PrismaClient } from '@prisma/client';
import { storageService } from '../src/storage/storageService';
import crypto from 'crypto';

const prisma = new PrismaClient();

const productsToSeed = [
  'software',
  'vps',
  'proxy',
  'combo'
];

async function seed() {
  console.log('Seeding digital assets...');

  for (const productId of productsToSeed) {
    const storageKey = `assets/${crypto.randomBytes(16).toString('hex')}/${productId}-demo.txt`;
    const content = Buffer.from(`This is a demo digital product asset for development testing.\nProduct ID: ${productId}`);
    
    // Upload to our local private storage abstraction
    await storageService.upload(storageKey, content, 'text/plain');
    const size = await storageService.getSize(storageKey);

    // Upsert into DB
    await prisma.digitalAsset.upsert({
      where: { productId },
      update: {
        fileName: `${productId}-demo.txt`,
        storageKey,
        mimeType: 'text/plain',
        fileSize: size,
        version: '1.0.0',
        status: 'ACTIVE'
      },
      create: {
        productId,
        fileName: `${productId}-demo.txt`,
        storageKey,
        mimeType: 'text/plain',
        fileSize: size,
        version: '1.0.0',
        status: 'ACTIVE'
      }
    });

    console.log(`Seeded asset for product: ${productId}`);
  }

  console.log('Digital assets seeded successfully.');
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
