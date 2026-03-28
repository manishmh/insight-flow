import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

// Try to load .env file manually if DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf-8');
      envFile.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
      });
    }
  } catch (error) {
    console.warn('Could not load .env file:', error);
  }
}

const prisma = new PrismaClient();

async function main() {
  const directoryPath = path.join(__dirname, 'seedData'); 

  // Check if directory exists
  if (!fs.existsSync(directoryPath)) {
    console.error('Seed data directory does not exist:', directoryPath);
    return;
  }

  const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.json'));

  if (files.length === 0) {
    console.warn('No JSON files found in seedData directory');
    return;
  }

  console.log(`Found ${files.length} seed files:`, files);

  const dataToInsert = files.map((file) => {
    const filePath = path.join(directoryPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const name = path.basename(file, path.extname(file));
    return {
      id: randomUUID(),
      name: name, 
      data: JSON.parse(fileContent),
    };
  });

  for (const item of dataToInsert) {
    try {
      // Check if data with this name already exists
      const existing = await prisma.sampleData.findFirst({
        where: { name: item.name },
      });

      if (existing) {
        // Update existing record
        await prisma.sampleData.update({
          where: { id: existing.id },
          data: { data: item.data },
        });
        console.log(`✓ Updated: ${item.name}`);
      } else {
        // Create new record
        await prisma.sampleData.create({
          data: item,
        });
        console.log(`✓ Created: ${item.name}`);
      }
    } catch (error: any) {
      console.error(`✗ Failed to seed ${item.name}:`, error.message);
    }
  }

  console.log('Seed data insertion completed.');
  
  // Verify what was inserted
  const count = await prisma.sampleData.count();
  console.log(`Total sampleData records in database: ${count}`);
  
  const names = await prisma.sampleData.findMany({
    select: { name: true },
  });
  console.log('Available queries:', names.map(n => n.name).join(', '));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
