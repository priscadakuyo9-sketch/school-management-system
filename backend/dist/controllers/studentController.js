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
exports.getRegistrationStats = exports.getRecentActivities = exports.getGlobalStats = exports.getStudentStats = exports.createStudent = exports.deleteStudent = exports.updateStudent = exports.getAllStudents = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        const students = yield prisma.student.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des élèves.' });
    }
});
exports.getAllStudents = getAllStudents;
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, dateOfBirth, gender, classId } = req.body;
        const student = yield prisma.student.update({
            where: { id },
            data: {
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                gender,
                class: classId ? { connect: { id: classId } } : undefined,
                user: {
                    update: Object.assign({ firstName,
                        lastName,
                        email }, (phone ? { phone } : {}))
                }
            }
        });
        res.json(student);
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'élève." });
    }
});
exports.updateStudent = updateStudent;
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Supprimer aussi l'utilisateur lié ? En cascade normalement oui via Prisma
        yield prisma.student.delete({ where: { id } });
        res.json({ message: 'Élève supprimé avec succès.' });
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression de l'élève." });
    }
});
exports.deleteStudent = deleteStudent;
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phone, dateOfBirth, gender, classId, enrollmentId } = req.body;
        const student = yield prisma.student.create({
            data: {
                enrollmentId,
                dateOfBirth: new Date(dateOfBirth),
                gender,
                class: classId ? { connect: { id: classId } } : undefined,
                user: {
                    create: Object.assign(Object.assign({ firstName,
                        lastName,
                        email }, (phone ? { phone } : {})), { password: 'student_password_default', role: 'STUDENT' })
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
const getGlobalStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield prisma.student.count();
        const teachers = yield prisma.teacher.count();
        const classes = yield prisma.class.count();
        const payments = yield prisma.payment.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Impossible de récupérer les statistiques globales.' });
    }
});
exports.getGlobalStats = getGlobalStats;
const getRecentActivities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recentStudents = yield prisma.student.findMany({
            include: { user: true },
            take: 2,
            orderBy: { createdAt: 'desc' }
        });
        const recentPayments = yield prisma.payment.findMany({
            include: { student: { include: { user: true } } },
            take: 2,
            orderBy: { dueDate: 'desc' }
        });
        const activities = [
            ...recentStudents.map(s => {
                var _a, _b;
                return ({
                    time: 'Récemment',
                    title: 'Nouvele inscription',
                    desc: `${(_a = s.user) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = s.user) === null || _b === void 0 ? void 0 : _b.lastName}`,
                    type: 'success'
                });
            }),
            ...recentPayments.map(p => {
                var _a, _b, _c, _d;
                return ({
                    time: 'Récemment',
                    title: 'Paiement enregistré',
                    desc: `${(_b = (_a = p.student) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.firstName} ${(_d = (_c = p.student) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.lastName} - ${p.amount}€`,
                    type: p.status === 'COMPLETED' ? 'finance' : 'warning'
                });
            })
        ];
        res.json(activities);
    }
    catch (error) {
        res.status(500).json({ error: 'Impossible de récupérer les activités récentes.' });
    }
});
exports.getRecentActivities = getRecentActivities;
const getRegistrationStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawData = yield prisma.student.findMany({ select: { createdAt: true } });
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const counts = new Array(12).fill(0);
        rawData.forEach(s => {
            counts[s.createdAt.getMonth()]++;
        });
        const stats = months.map((month, i) => ({ month, count: counts[i] }));
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des stats.' });
    }
});
exports.getRegistrationStats = getRegistrationStats;
