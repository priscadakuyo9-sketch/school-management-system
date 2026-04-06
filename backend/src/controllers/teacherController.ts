import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, phone: true }
        },
        classes: true
      }
    });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des enseignants.' });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, specialty, phone } = req.body;

    const teacher = await prisma.teacher.create({
      data: {
        specialty,
        user: {
          create: {
            firstName,
            lastName,
            email,
            phone,
            password: 'teacher_password_default',
            role: 'TEACHER'
          }
        }
      }
    });

    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'enregistrement de l'enseignant." });
  }
};
