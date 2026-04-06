import { Router } from 'express';
import { generateStudentReportCard } from '../controllers/reportCardController';
import { createCheckoutSession, getPayments } from '../controllers/paymentController';
import { sendNotification } from '../controllers/notificationController';
import { getAllStudents, createStudent, getStudentStats } from '../controllers/studentController';
import { getAllTeachers, createTeacher } from '../controllers/teacherController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware';

const router = Router();

// /api/school/report-card/:studentId/:term
// @ts-ignore
router.get('/report-card/:studentId/:term', authenticateToken, generateStudentReportCard);

// /api/school/payments/checkout
// @ts-ignore
router.post('/payments/checkout', authenticateToken, createCheckoutSession);
// @ts-ignore
router.get('/payments', authenticateToken, getPayments);

// /api/school/notify
router.post('/notify', authenticateToken, sendNotification);

// ÉLÈVES
// @ts-ignore
router.get('/students', authenticateToken, getAllStudents);
// @ts-ignore
router.get('/students/stats', authenticateToken, getStudentStats);
// @ts-ignore
router.post('/students', authenticateToken, authorizeRole(['ADMIN', 'SUPERADMIN']), createStudent);

// ENSEIGNANTS
// @ts-ignore
router.get('/teachers', authenticateToken, getAllTeachers);
// @ts-ignore
router.post('/teachers', authenticateToken, authorizeRole(['ADMIN', 'SUPERADMIN']), createTeacher);

export default router;
