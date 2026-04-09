import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        teacher: { include: { user: true } },
        students: true,
        courses: true
      }
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des classes.' });
  }
};

export const createClass = async (req: Request, res: Response) => {
  try {
    const { name, level, capacity, teacherId } = req.body;
    const newClass = await prisma.class.create({
      data: {
        name,
        level,
        capacity: Number(capacity),
        teacherId
      }
    });
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la classe.' });
  }
};

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        teacher: { include: { user: true } },
        class: true,
        schedule: true
      }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des cours.' });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { name, description, teacherId, classId, day, slot, room } = req.body;
    const course = await prisma.course.create({
      data: {
        name,
        description,
        teacherId,
        classId,
        day: day ?? 'Lundi',
        slot: slot ?? '07:00-09:00',
        room: room ?? null,
      },
      include: {
        teacher: { include: { user: true } },
        class: true,
      }
    });
    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du cours.' });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.course.delete({ where: { id } });
    res.json({ message: 'Cours supprimé.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du cours.' });
  }
};
