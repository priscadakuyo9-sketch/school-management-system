import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Début du peuplement de la base de données (Burkina Faso Edition)...');

  // Nettoyage
  await prisma.salary.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.class.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.user.deleteMany({ where: { role: { not: 'SUPERADMIN' } } });

  const hashedPassword = await bcrypt.hash('password123', 12);

  // 1. CRÉATION DES CLASSES (BURKINA MODEL)
  const classesData = [
    // Primaire
    { name: 'CP1', level: 'PRIMAIRE', cycle: 'PRIMAIRE', capacity: 40 },
    { name: 'CP2', level: 'PRIMAIRE', cycle: 'PRIMAIRE', capacity: 40 },
    { name: 'CE1', level: 'PRIMAIRE', cycle: 'PRIMAIRE', capacity: 40 },
    { name: 'CE2', level: 'PRIMAIRE', cycle: 'PRIMAIRE', capacity: 40 },
    { name: 'CM1', level: 'PRIMAIRE', cycle: 'PRIMAIRE', capacity: 40 },
    { name: 'CM2', level: 'PRIMAIRE', cycle: 'PRIMAIRE', capacity: 40 },
    // Secondaire (Collège)
    { name: '6ème A', level: '6e', cycle: 'SECONDAIRE', capacity: 50 },
    { name: '5ème A', level: '5e', cycle: 'SECONDAIRE', capacity: 50 },
    { name: '4ème A', level: '4e', cycle: 'SECONDAIRE', capacity: 50 },
    { name: '3ème A', level: '3e', cycle: 'SECONDAIRE', capacity: 50 },
    // Secondaire (Lycée)
    { name: '2nde C', level: '2nde', cycle: 'SECONDAIRE', capacity: 45 },
    { name: '2nde A', level: '2nde', cycle: 'SECONDAIRE', capacity: 45 },
    { name: '1ère D', level: '1ere', cycle: 'SECONDAIRE', capacity: 45 },
    { name: '1ère A', level: '1ere', cycle: 'SECONDAIRE', capacity: 45 },
    { name: 'Terminale D', level: 'Terminale', cycle: 'SECONDAIRE', capacity: 40 },
    { name: 'Terminale A', level: 'Terminale', cycle: 'SECONDAIRE', capacity: 40 },
    // Université
    { name: 'Licence 1 Eco', level: 'UNIVERSITE', cycle: 'UNIVERSITE', capacity: 100 },
    { name: 'Licence 2 Droit', level: 'UNIVERSITE', cycle: 'UNIVERSITE', capacity: 100 },
  ];

  const createdClasses = [];
  for (const c of classesData) {
    const cls = await prisma.class.create({ data: c });
    createdClasses.push(cls);
  }

  // 2. CRÉATION DES ENSEIGNANTS
  const teachersInfo = [
    { firstName: 'Issaka', lastName: 'TRAORE', specialty: 'Mathématiques', type: 'SCIENTIFIC', rate: 2500 },
    { firstName: 'Alassane', lastName: 'OUEDRAOGO', specialty: 'Physique-Chimie', type: 'SCIENTIFIC', rate: 2500 },
    { firstName: 'Mariam', lastName: 'SAWADOGO', specialty: 'Français', type: 'LITERARY', rate: 2000 },
    { firstName: 'Boubacar', lastName: 'SANKARA', specialty: 'Histoire-Géo', type: 'LITERARY', rate: 2000 },
    { firstName: 'Fatoumata', lastName: 'DIALLO', specialty: 'Anglais', type: 'LITERARY', rate: 2000 },
    { firstName: 'Moussa', lastName: 'BARRY', specialty: 'SVT', type: 'SCIENTIFIC', rate: 2500 },
  ];

  const createdTeachers = [];
  for (const t of teachersInfo) {
    const teacher = await prisma.teacher.create({
      data: {
        specialty: t.specialty,
        subjectType: t.type,
        hourlyRate: t.rate,
        user: {
          create: {
            email: `${t.firstName.toLowerCase()}.${t.lastName.toLowerCase()}@edumanage.bf`,
            password: hashedPassword,
            firstName: t.firstName,
            lastName: t.lastName,
            role: 'TEACHER',
            phone: '+226 70 00 00 00'
          }
        }
      }
    });
    createdTeachers.push(teacher);
  }

  // 3. CRÉATION DES ÉLÈVES ET PAIEMENTS
  const studentsInfo = [
    { firstName: 'Amadou', lastName: 'ZONGO', class: 'Terminale D', gender: 'Garçon' },
    { firstName: 'Aminata', lastName: 'COMPAORE', class: 'Terminale D', gender: 'Fille' },
    { firstName: 'Kadidia', lastName: 'KABRE', class: '3ème A', gender: 'Fille' },
    { firstName: 'Karim', lastName: 'SANOGO', class: '3ème A', gender: 'Garçon' },
    { firstName: 'Ousmane', lastName: 'KONÉ', class: '6ème A', gender: 'Garçon' },
    { firstName: 'Safiatou', lastName: 'NIKIÉMA', class: '6ème A', gender: 'Fille' },
    { firstName: 'Idrissa', lastName: 'ILBOUDO', class: 'Licence 1 Eco', gender: 'Garçon' },
  ];

  for (const s of studentsInfo) {
    const cls = createdClasses.find(c => c.name === s.class);
    // @ts-ignore
    const student = await prisma.student.create({
      data: {
        enrollmentId: `BF-${Math.floor(100000 + Math.random() * 900000)}`,
        dateOfBirth: new Date('2008-05-15'),
        gender: s.gender,
        classId: cls?.id,
        user: {
          create: {
            email: `${s.firstName.toLowerCase()}.${s.lastName.toLowerCase()}@student.bf`,
            password: hashedPassword,
            firstName: s.firstName,
            lastName: s.lastName,
            role: 'STUDENT'
          }
        }
      }
    });

    // Paiements auto basés sur le niveau du Burkina
    let tuitionTotal = 100000;
    if (cls?.level === '2nde' || cls?.level === '1ere') tuitionTotal = 150000;
    if (cls?.level === 'Terminale') tuitionTotal = 200000;
    if (cls?.level === 'UNIVERSITE') tuitionTotal = 300000; // Exemple

    // Tranche 1 (50% - Fin Octobre)
    // @ts-ignore
    await prisma.payment.create({
      data: {
        amount: tuitionTotal * 0.5,
        currency: 'XOF',
        status: 'PAID',
        description: 'Scolarité - Tranche 1 (50%)',
        installment: 1,
        method: 'BANK',
        dueDate: new Date('2025-10-31'),
        paidDate: new Date('2025-10-25'),
        studentId: student.id
      }
    });

    // Tranche 2 (25% - Fin Novembre)
    // @ts-ignore
    await prisma.payment.create({
      data: {
        amount: tuitionTotal * 0.25,
        currency: 'XOF',
        status: 'PENDING',
        description: 'Scolarité - Tranche 2 (25%)',
        installment: 2,
        dueDate: new Date('2025-11-30'),
        studentId: student.id
      }
    });
  }

  // 4. COMPLAINTS (PLAINTES)
  // @ts-ignore
  await prisma.complaint.create({
    data: {
      title: 'Cantine scolaire',
      description: 'Le riz de mardi était un peu trop salé.',
      solution: 'Signalé au chef cuisinier, le dosage sera réduit.',
      status: 'RESOLVED'
    }
  });

  console.log('Peuplement terminé avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
