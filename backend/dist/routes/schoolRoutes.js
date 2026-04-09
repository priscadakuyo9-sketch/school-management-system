"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportCardController_1 = require("../controllers/reportCardController");
const paymentController_1 = require("../controllers/paymentController");
const notificationController_1 = require("../controllers/notificationController");
const studentController_1 = require("../controllers/studentController");
const teacherController_1 = require("../controllers/teacherController");
const academicController_1 = require("../controllers/academicController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// RAPPORT & NOTES
router.get('/report-card/:studentId/:term', authMiddleware_1.authenticateToken, reportCardController_1.generateStudentReportCard);
// FINANCES
router.post('/payments', authMiddleware_1.authenticateToken, paymentController_1.createPayment);
router.post('/payments/checkout', authMiddleware_1.authenticateToken, paymentController_1.createCheckoutSession);
router.get('/payments', authMiddleware_1.authenticateToken, paymentController_1.getPayments);
// /api/school/notify
router.post('/notify', authMiddleware_1.authenticateToken, notificationController_1.sendNotification);
// ÉLÈVES
// @ts-ignore
router.get('/students', authMiddleware_1.authenticateToken, studentController_1.getAllStudents);
// @ts-ignore
router.get('/students/stats', authMiddleware_1.authenticateToken, studentController_1.getStudentStats);
// @ts-ignore
router.post('/students', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['ADMIN', 'SUPERADMIN']), studentController_1.createStudent);
// @ts-ignore
router.put('/students/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['ADMIN', 'SUPERADMIN']), studentController_1.updateStudent);
// @ts-ignore
router.delete('/students/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['ADMIN', 'SUPERADMIN']), studentController_1.deleteStudent);
// STATS GLOBALES
// @ts-ignore
router.get('/stats', authMiddleware_1.authenticateToken, studentController_1.getGlobalStats);
// @ts-ignore
router.get('/stats/registrations', authMiddleware_1.authenticateToken, studentController_1.getRegistrationStats);
// @ts-ignore
router.get('/recent-activities', authMiddleware_1.authenticateToken, studentController_1.getRecentActivities);
// ENSEIGNANTS
// @ts-ignore
router.get('/teachers', authMiddleware_1.authenticateToken, teacherController_1.getAllTeachers);
// @ts-ignore
router.post('/teachers', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['ADMIN', 'SUPERADMIN']), teacherController_1.createTeacher);
// @ts-ignore
router.put('/teachers/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['ADMIN', 'SUPERADMIN']), teacherController_1.updateTeacher);
// @ts-ignore
router.delete('/teachers/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['ADMIN', 'SUPERADMIN']), teacherController_1.deleteTeacher);
// CLASSES & COURS
// @ts-ignore
router.get('/classes', authMiddleware_1.authenticateToken, academicController_1.getAllClasses);
// @ts-ignore
router.post('/classes', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['ADMIN', 'SUPERADMIN']), academicController_1.createClass);
// @ts-ignore
router.get('/courses', authMiddleware_1.authenticateToken, academicController_1.getAllCourses);
// @ts-ignore
router.post('/courses', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['ADMIN', 'SUPERADMIN']), academicController_1.createCourse);
// @ts-ignore
router.delete('/courses/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['ADMIN', 'SUPERADMIN']), academicController_1.deleteCourse);
exports.default = router;
