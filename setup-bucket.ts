import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function setupBucket() {
  try {
    console.log('Creating uploads bucket if it does not exist...');
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('uploads', 'uploads', true) 
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('Bucket created or already exists.');

    console.log('Setting up public RLS policies for uploads bucket...');
    // Drop policies if they exist to recreate them
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Public Access" ON storage.objects;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Public Upload" ON storage.objects;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Public Update" ON storage.objects;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Public Delete" ON storage.objects;`);

    // Create policies
    await prisma.$executeRawUnsafe(`CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'uploads' );`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'uploads' );`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'uploads' );`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'uploads' );`);
    
    console.log('Bucket and policies successfully configured!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

setupBucket();
