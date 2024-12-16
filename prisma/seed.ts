import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const seedDataPath = path.join(__dirname, 'seedData', 'customers.json');
const customersData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));

async function main() {
  await prisma.board.deleteMany();
  await prisma.dashboard.deleteMany();

  const dashboard = await prisma.dashboard.create({
    data: {
      name: 'New Dashboard', 
    },
  });

  await prisma.board.create({
    data: {
      name: 'Customers',
      data: customersData,
      dashboardId: dashboard.id,
    },
  });

  console.log('Database has been seeded successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
