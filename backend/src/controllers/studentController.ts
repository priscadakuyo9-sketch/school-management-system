import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    
    const students = await prisma.student.findMany({
      where: search ? {
        OR: [
          { user: { firstName: { contains: String(search) } } },
          { user: { lastName: { contains: String(search) } } },
          { enrollmentId: { contains: String(search) } }
        ]
      } : {},
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, phone: true, avatarUrl: true }
        },
        class: true
      },
      orderBy: { user: { lastName: 'asc' } } // Tri alphabétique demandé
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des élèves.' });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, dateOfBirth, gender, classId } = req.body;

    const student = await prisma.student.update({
      where: { id },
      data: {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        class: classId ? { connect: { id: classId } } : undefined,
        user: {
          update: {
            firstName,
            lastName,
            email,
            ...(phone ? { phone } : {})
          }
        }
      }
    });

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'élève." });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Supprimer aussi l'utilisateur lié ? En cascade normalement oui via Prisma
    await prisma.student.delete({ where: { id } });
    res.json({ message: 'Élève supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'élève." });
  }
};


export const createStudent = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, gender, classId, enrollmentId } = req.body;

    const student = await prisma.student.create({
      data: {
        enrollmentId,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        class: classId ? { connect: { id: classId } } : undefined,
        user: {
          create: {
            firstName,
            lastName,
            email,
            ...(phone ? { phone } : {}),
            password: 'student_password_default',
            role: 'STUDENT'
          }
        }
      }
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'enregistrement de l'élève." });
  }
};

export const getStudentStats = async (req: Request, res: Response) => {
    try {
      const total = await prisma.student.count();
      const boys = await prisma.student.count({ where: { gender: 'Garçon' } });
      const girls = await prisma.student.count({ where: { gender: 'Fille' } });
  
      res.json({ total, boys, girls });
    } catch (error) {
      res.status(500).json({ error: 'Impossible de calculer les statistiques.' });
    }
};
export const getGlobalStats = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.count();
    const teachers = await prisma.teacher.count();
    const classes = await prisma.class.count();
    const payments = await prisma.payment.findMany({
      select: { amount: true, status: true }
    });

    const totalRevenue = payments
      .filter(p => p.status === 'COMPLETED' || p.status === 'Payé')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingRevenue = payments
      .filter(p => p.status === 'PENDING' || p.status === 'En attente')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      students,
      teachers,
      classes,
      totalRevenue,
      pendingRevenue,
      attendanceRate: 98.2 // Simulé pour l'instant
    });
  } catch (error) {
    res.status(500).json({ error: 'Impossible de récupérer les statistiques globales.' });
  }
};
export const getRecentActivities = async (req: Request, res: Response) => {
  try {
    const recentStudents = await prisma.student.findMany({
      include: { user: true },
      take: 2,
      orderBy: { createdAt: 'desc' }
    });

    const recentPayments = await prisma.payment.findMany({
      include: { student: { include: { user: true } } },
      take: 2,
      orderBy: { dueDate: 'desc' }
    });

    const activities = [
      ...recentStudents.map(s => ({
        time: 'Récemment',
        title: 'Nouvele inscription',
        desc: `${s.user?.firstName} ${s.user?.lastName}`,
        type: 'success'
      })),
      ...recentPayments.map(p => ({
        time: 'Récemment',
        title: 'Paiement enregistré',
        desc: `${p.student?.user?.firstName} ${p.student?.user?.lastName} - ${p.amount}€`,
        type: p.status === 'COMPLETED' ? 'finance' : 'warning'
      }))
    ];

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Impossible de récupérer les activités récentes.' });
  }
};

export const getRegistrationStats = async (req: Request, res: Response) => {
  try {
    const rawData = await prisma.student.findMany({ select: { createdAt: true } });

    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const counts = new Array(12).fill(0);
    
    rawData.forEach(s => {
      counts[s.createdAt.getMonth()]++;
    });

    const stats = months.map((month, i) => ({ month, count: counts[i] }));
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des stats.' });
  }
};

