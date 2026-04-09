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
exports.deleteCourse = exports.createCourse = exports.getAllCourses = exports.createClass = exports.getAllClasses = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllClasses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classes = yield prisma.class.findMany({
            include: {
                teacher: { include: { user: true } },
                students: true,
                courses: true
            }
        });
        res.json(classes);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des classes.' });
    }
});
exports.getAllClasses = getAllClasses;
const createClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, level, capacity, teacherId } = req.body;
        const newClass = yield prisma.class.create({
            data: {
                name,
                level,
                capacity: Number(capacity),
                teacherId
            }
        });
        res.status(201).json(newClass);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la classe.' });
    }
});
exports.createClass = createClass;
const getAllCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield prisma.course.findMany({
            include: {
                teacher: { include: { user: true } },
                class: true,
                schedule: true
            }
        });
        res.json(courses);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des cours.' });
    }
});
exports.getAllCourses = getAllCourses;
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, teacherId, classId, day, slot, room } = req.body;
        const course = yield prisma.course.create({
            data: {
                name,
                description,
                teacherId,
                classId,
                day: day !== null && day !== void 0 ? day : 'Lundi',
                slot: slot !== null && slot !== void 0 ? slot : '07:00-09:00',
                room: room !== null && room !== void 0 ? room : null,
            },
            include: {
                teacher: { include: { user: true } },
                class: true,
            }
        });
        res.status(201).json(course);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création du cours.' });
    }
});
exports.createCourse = createCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.course.delete({ where: { id } });
        res.json({ message: 'Cours supprimé.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la suppression du cours.' });
    }
});
exports.deleteCourse = deleteCourse;
