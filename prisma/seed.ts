import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const directoryPath = path.join(__dirname, 'seedData'); 

  const files = fs.readdirSync(directoryPath);

  const dataToInsert = files.map((file) => {
    const filePath = path.join(directoryPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return {
      name: path.basename(file, path.extname(file)), 
      data: JSON.parse(fileContent),
    };
  });

  for (const item of dataToInsert) {
    await prisma.sampleData.create({
      data: item,
    });
  }

  console.log('Seed data inserted successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
