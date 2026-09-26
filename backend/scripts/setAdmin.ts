import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setAdmin() {
  const users = await prisma.user.findMany({ take: 1 });
  if (users.length === 0) {
    console.log('No users found. Register a user first in the UI.');
    return;
  }

  const user = users[0];
  await prisma.user.update({
    where: { id: user.id },
    data: { role: 'ADMIN' }
  });

  console.log(`User ${user.email} is now an ADMIN.`);
}

setAdmin()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
