import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@edumanage.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      password: hashedPassword,
      firstName: 'Prisc',
      lastName: 'Directeur',
      role: 'SUPERADMIN',
    },
  });

  console.log('Mot de passe admin réinitialisé à: admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
