import { Router } from 'express';
import { generateStudentReportCard } from '../controllers/reportCardController';
import { createCheckoutSession, getPayments, createPayment } from '../controllers/paymentController';
import { sendNotification } from '../controllers/notificationController';
import { 
  getAllStudents, createStudent, updateStudent, deleteStudent, 
  getStudentStats, getGlobalStats, getRecentActivities, getRegistrationStats 
} from '../controllers/studentController';
import { 
  getAllTeachers, createTeacher, updateTeacher, deleteTeacher 
} from '../controllers/teacherController';
import { getAllClasses, createClass, getAllCourses, createCourse, deleteCourse } from '../controllers/academicController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware';

const router = Router();

// RAPPORT & NOTES
router.get('/report-card/:studentId/:term', authenticateToken, generateStudentReportCard);

// FINANCES
router.post('/payments', authenticateToken, createPayment);
router.post('/payments/checkout', authenticateToken, createCheckoutSession);
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
// @ts-ignore
router.put('/students/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPERADMIN']), updateStudent);
// @ts-ignore
router.delete('/students/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPERADMIN']), deleteStudent);

// STATS GLOBALES
// @ts-ignore
router.get('/stats', authenticateToken, getGlobalStats);
// @ts-ignore
router.get('/stats/registrations', authenticateToken, getRegistrationStats);
// @ts-ignore
router.get('/recent-activities', authenticateToken, getRecentActivities);

// ENSEIGNANTS
// @ts-ignore
router.get('/teachers', authenticateToken, getAllTeachers);
// @ts-ignore
router.post('/teachers', authenticateToken, authorizeRole(['ADMIN', 'SUPERADMIN']), createTeacher);
// @ts-ignore
router.put('/teachers/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPERADMIN']), updateTeacher);
// @ts-ignore
router.delete('/teachers/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPERADMIN']), deleteTeacher);

// CLASSES & COURS
// @ts-ignore
router.get('/classes', authenticateToken, getAllClasses);
// @ts-ignore
router.post('/classes', authenticateToken, authorizeRole(['ADMIN', 'SUPERADMIN']), createClass);
// @ts-ignore
router.get('/courses', authenticateToken, getAllCourses);
// @ts-ignore
router.post('/courses', authenticateToken, authorizeRole(['ADMIN', 'SUPERADMIN']), createCourse);
// @ts-ignore
router.delete('/courses/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPERADMIN']), deleteCourse);

export default router;
