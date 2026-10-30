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

    console.log('Setting up RLS policies for uploads bucket...');
    // Drop policies if they exist to recreate them
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Public Access" ON storage.objects;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Public Upload" ON storage.objects;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Public Update" ON storage.objects;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Public Delete" ON storage.objects;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Auth Update" ON storage.objects;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;`);

    // Create secure policies: Public can only view, Authenticated/ServiceRole can manage
    await prisma.$executeRawUnsafe(`CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'uploads' );`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'uploads' );`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'uploads' );`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'uploads' );`);
    
    console.log('Bucket and policies successfully configured!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

setupBucket();
