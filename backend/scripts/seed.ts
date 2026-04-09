import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Admin
  const email = 'admin@edumanage.com';
  const password = 'adminpassword123';
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

  // 2. Classes
  const classA = await prisma.class.upsert({
    where: { id: 'class-6eme-a' },
    update: {},
    create: {
      id: 'class-6eme-a',
      name: 'Classe de 6ème A',
      level: 'Collège',
      capacity: 30,
    }
  });

  const classB = await prisma.class.upsert({
    where: { id: 'class-3eme-b' },
    update: {},
    create: {
      id: 'class-3eme-b',
      name: 'Classe de 3ème B',
      level: 'Collège',
      capacity: 25,
    }
  });

  // 3. Teachers & Linking to Classes
  const teachersData = [
    { email: 'jean.dupont@edumanage.com', first: 'Jean', last: 'Dupont', specialty: 'Mathématiques' },
    { email: 'marie.curie@edumanage.com', first: 'Marie', last: 'Curie', specialty: 'Physique' },
    { email: 'victor.hugo@edumanage.com', first: 'Victor', last: 'Hugo', specialty: 'Français' },
  ];

  const createdTeachers = [];
  for (const t of teachersData) {
    const tUser = await prisma.user.upsert({
      where: { email: t.email },
      update: {},
      create: {
        email: t.email,
        password: await bcrypt.hash('teacher123', 12),
        firstName: t.first,
        lastName: t.last,
        role: 'TEACHER',
      }
    });

    const teacher = await prisma.teacher.upsert({
      where: { userId: tUser.id },
      update: {},
      create: {
        userId: tUser.id,
        specialty: t.specialty,
      }
    });
    createdTeachers.push(teacher);
  }

  // Assign teachers to classes
  await prisma.class.update({
    where: { id: classA.id },
    data: { teacherId: createdTeachers[0].id }
  });
  await prisma.class.update({
    where: { id: classB.id },
    data: { teacherId: createdTeachers[1].id }
  });

  // 4. Courses
  const coursesData = [
    { name: 'Algèbre Avancée', teacherId: createdTeachers[0].id, classId: classA.id },
    { name: 'Physique Quantique', teacherId: createdTeachers[1].id, classId: classA.id },
    { name: 'Grammaire & Style', teacherId: createdTeachers[2].id, classId: classB.id },
    { name: 'Histoire de l\'Art', teacherId: createdTeachers[2].id, classId: classB.id },
  ];

  for (const c of coursesData) {
    await prisma.course.create({
      data: {
        name: c.name,
        teacherId: c.teacherId,
        classId: c.classId
      }
    });
  }

  // 5. Students & Payments
  const studentsNames = [
    { first: 'Emma', last: 'Dubois', gender: 'Fille' },
    { first: 'Lucas', last: 'Martin', gender: 'Garçon' },
    { first: 'Chloé', last: 'Bernard', gender: 'Fille' },
    { first: 'Hugo', last: 'Petit', gender: 'Garçon' },
    { first: 'Léa', last: 'Robert', gender: 'Fille' },
  ];

  for (let i = 0; i < studentsNames.length; i++) {
    const s = studentsNames[i];
    const sEmail = `student${i+1}@edumanage.com`;
    const sUser = await prisma.user.upsert({
      where: { email: sEmail },
      update: {},
      create: {
        email: sEmail,
        password: hashedPassword,
        firstName: s.first,
        lastName: s.last,
        role: 'STUDENT',
      }
    });

    const student = await prisma.student.upsert({
      where: { enrollmentId: `ENR00${i+1}` },
      update: { userId: sUser.id },
      create: {
        enrollmentId: `ENR00${i+1}`,
        dateOfBirth: new Date('2010-01-01'),
        gender: s.gender,
        classId: (i % 2 === 0 ? classA.id : classB.id),
        userId: sUser.id,
      }
    });

    // Add some payments for each student
    await prisma.payment.upsert({
      where: { id: `pmnt-init-${i}` },
      update: {},
      create: {
        id: `pmnt-init-${i}`,
        amount: 450.0,
        description: 'Scolarité - Trimestre 1',
        dueDate: new Date(),
        paidDate: i % 2 === 0 ? new Date() : null,
        status: i % 2 === 0 ? 'COMPLETED' : 'PENDING',
        studentId: student.id
      }
    });
  }

  console.log('----------------------------------------------------');
  console.log('BASE DE DONNÉES POPULÉE AVEC TOUTES LES RELATIONS !');
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
