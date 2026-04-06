import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@edumanage.com';
  const password = 'adminpassword123';
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log('Admin user already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName: 'Directeur',
      lastName: 'Général',
      role: 'SUPERADMIN',
    },
  });

  console.log('----------------------------------------------------');
  console.log('COMPTE ADMINISTRATEUR CRÉÉ AVEC SUCCÈS !');
  console.log(`Email: ${email}`);
  console.log(`Mot de passe: ${password}`);
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
