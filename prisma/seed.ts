import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import path from 'path';
import { auth } from '@/server/auth';
import { GetDefaultDashboardId } from '@/server/components/dashboard-commands';

const prisma = new PrismaClient();

const seedDataPath = path.join(__dirname, 'seedData', 'customers.json');
const customersData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));

async function main() {
  const session =  await auth();
  await prisma.board.deleteMany();
  await prisma.dashboard.deleteMany();

  const dashboardId = await GetDefaultDashboardId()

  if (!dashboardId) return;

  await prisma.board.create({
    data: {
      name: 'Customers',
      data: customersData,
      dashboardId: dashboardId,
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
