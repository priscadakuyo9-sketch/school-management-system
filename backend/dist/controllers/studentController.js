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
exports.getStudentStats = exports.createStudent = exports.getAllStudents = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield prisma.student.findMany({
            include: {
                user: {
                    select: { firstName: true, lastName: true, email: true, phone: true }
                },
                class: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(students);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des élèves.' });
    }
});
exports.getAllStudents = getAllStudents;
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, dateOfBirth, gender, classId, enrollmentId } = req.body;
        const student = yield prisma.student.create({
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
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de l'enregistrement de l'élève." });
    }
});
exports.createStudent = createStudent;
const getStudentStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const total = yield prisma.student.count();
        const boys = yield prisma.student.count({ where: { gender: 'Garçon' } });
        const girls = yield prisma.student.count({ where: { gender: 'Fille' } });
        res.json({ total, boys, girls });
    }
    catch (error) {
        res.status(500).json({ error: 'Impossible de calculer les statistiques.' });
    }
});
exports.getStudentStats = getStudentStats;
