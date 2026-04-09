"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeacher = exports.deleteTeacher = exports.updateTeacher = exports.getAllTeachers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllTeachers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        const teachers = yield prisma.teacher.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des enseignants.' });
    }
});
exports.getAllTeachers = getAllTeachers;
const updateTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, specialty, phone, hourlyRate, subjectType } = req.body;
        const teacher = yield prisma.teacher.update({
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
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'enseignant." });
    }
});
exports.updateTeacher = updateTeacher;
const deleteTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.teacher.delete({ where: { id } });
        res.json({ message: 'Enseignant supprimé avec succès.' });
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression de l'enseignant." });
    }
});
exports.deleteTeacher = deleteTeacher;
const createTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, specialty, phone, hourlyRate, subjectType } = req.body;
        const teacher = yield prisma.teacher.create({
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
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de l'enregistrement de l'enseignant." });
    }
});
exports.createTeacher = createTeacher;
