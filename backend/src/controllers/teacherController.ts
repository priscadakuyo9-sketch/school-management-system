import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const teachers = await prisma.teacher.findMany({
      where: search ? {
        OR: [
          { user: { firstName: { contains: String(search) } } },
          { user: { lastName: { contains: String(search) } } },
          { specialty: { contains: String(search) } }
        ]
      } : {},
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, phone: true, avatarUrl: true }
        },
        classes: true
      },
      orderBy: { user: { lastName: 'asc' } }
    });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des enseignants.' });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, specialty, phone, hourlyRate, subjectType } = req.body;

    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        specialty,
        hourlyRate,
        subjectType,
        user: {
          update: {
            firstName,
            lastName,
            email,
            phone
          }
        }
      }
    });

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'enseignant." });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.teacher.delete({ where: { id } });
    res.json({ message: 'Enseignant supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'enseignant." });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, specialty, phone, hourlyRate, subjectType } = req.body;

    const teacher = await prisma.teacher.create({
      data: {
        specialty,
        hourlyRate: hourlyRate || (subjectType === 'SCIENTIFIC' ? 2500 : 2000),
        subjectType: subjectType || 'LITERARY',
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

