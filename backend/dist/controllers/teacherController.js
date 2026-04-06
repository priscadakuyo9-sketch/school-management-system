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
exports.createTeacher = exports.getAllTeachers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllTeachers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teachers = yield prisma.teacher.findMany({
            include: {
                user: {
                    select: { firstName: true, lastName: true, email: true, phone: true }
                },
                classes: true
            }
        });
        res.json(teachers);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des enseignants.' });
    }
});
exports.getAllTeachers = getAllTeachers;
const createTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, specialty, phone } = req.body;
        const teacher = yield prisma.teacher.create({
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
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de l'enregistrement de l'enseignant." });
    }
});
exports.createTeacher = createTeacher;
