import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import schoolRoutes from './routes/schoolRoutes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Intégration des Routes
app.use('/api/auth', authRoutes);
app.use('/api/school', schoolRoutes);

// Route de Santé du Système (Health Check)
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'OK', 
      database: 'Connected', 
      timestamp: new Date().toISOString(),
      services: ['Auth', 'School', 'Payment', 'PDF']
    });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: 'Disconnected' });
  }
});

// Récupérer les informations de l'établissement
app.get('/api/stats', async (req, res) => {
  try {
    const totalStudents = await prisma.student.count();
    const totalTeachers = await prisma.teacher.count();
    const totalClasses = await prisma.class.count();

    res.json({
      students: totalStudents,
      teachers: totalTeachers,
      classes: totalClasses
    });
  } catch (error) {
    console.error(error);
    // En cas d'erreur de connexion DB au départ
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Démarrer le serveur
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log('Base de données connectée avec succès!');
  } catch (err) {
    console.warn('Attention: Impossible de se connecter à la DB. Vérifiez votre DATABASE_URL dans .env.');
  }
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
