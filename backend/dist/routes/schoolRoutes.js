"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportCardController_1 = require("../controllers/reportCardController");
const paymentController_1 = require("../controllers/paymentController");
const notificationController_1 = require("../controllers/notificationController");
const studentController_1 = require("../controllers/studentController");
const teacherController_1 = require("../controllers/teacherController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// /api/school/report-card/:studentId/:term
// @ts-ignore
router.get('/report-card/:studentId/:term', authMiddleware_1.authenticateToken, reportCardController_1.generateStudentReportCard);
// /api/school/payments/checkout
// @ts-ignore
router.post('/payments/checkout', authMiddleware_1.authenticateToken, paymentController_1.createCheckoutSession);
// /api/school/notify
router.post('/notify', authMiddleware_1.authenticateToken, notificationController_1.sendNotification);
// ÉLÈVES
// @ts-ignore
router.get('/students', authMiddleware_1.authenticateToken, studentController_1.getAllStudents);
// @ts-ignore
router.get('/students/stats', authMiddleware_1.authenticateToken, studentController_1.getStudentStats);
// @ts-ignore
router.post('/students', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['ADMIN', 'SUPERADMIN']), studentController_1.createStudent);
// ENSEIGNANTS
// @ts-ignore
router.get('/teachers', authMiddleware_1.authenticateToken, teacherController_1.getAllTeachers);
// @ts-ignore
router.post('/teachers', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['ADMIN', 'SUPERADMIN']), teacherController_1.createTeacher);
exports.default = router;
