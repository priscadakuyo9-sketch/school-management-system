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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const schoolRoutes_1 = __importDefault(require("./routes/schoolRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Intégration des Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/school', schoolRoutes_1.default);
// Route de Santé du Système (Health Check)
app.get('/api/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$queryRaw `SELECT 1`;
        res.json({
            status: 'OK',
            database: 'Connected',
            timestamp: new Date().toISOString(),
            services: ['Auth', 'School', 'Payment', 'PDF']
        });
    }
    catch (error) {
        res.status(500).json({ status: 'ERROR', database: 'Disconnected' });
    }
}));
// Récupérer les informations de l'établissement
app.get('/api/stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalStudents = yield prisma.student.count();
        const totalTeachers = yield prisma.teacher.count();
        const totalClasses = yield prisma.class.count();
        res.json({
            students: totalStudents,
            teachers: totalTeachers,
            classes: totalClasses
        });
    }
    catch (error) {
        console.error(error);
        // En cas d'erreur de connexion DB au départ
        res.status(500).json({ error: 'Database connection failed' });
    }
}));
// Démarrer le serveur
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
});
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$connect();
        console.log('Base de données connectée avec succès!');
    }
    catch (err) {
        console.warn('Attention: Impossible de se connecter à la DB. Vérifiez votre DATABASE_URL dans .env.');
    }
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
}));
