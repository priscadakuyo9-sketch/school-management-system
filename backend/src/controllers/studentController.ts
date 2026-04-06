import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, phone: true }
        },
        class: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des élèves.' });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, dateOfBirth, gender, classId, enrollmentId } = req.body;

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
            password: 'student_password_default', // À changer lors de la première connexion
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
