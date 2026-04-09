import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const users = await p.user.findMany({
  where: { role: { in: ['ADMIN', 'SUPERADMIN'] } },
  select: { email: true, role: true, firstName: true, isActive: true }
});
console.log(JSON.stringify(users, null, 2));

// Also count courses
const courses = await p.course.findMany({ select: { id: true, name: true, day: true, slot: true } });
console.log('\nCOURSES IN DB:', JSON.stringify(courses, null, 2));

await p.$disconnect();
