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
exports.generateStudentReportCard = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const generateStudentReportCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { studentId, term } = req.params;
        // Récupérer l'élève et ses notes
        const student = yield prisma.student.findUnique({
            where: { id: studentId },
            include: {
                user: true,
                class: true,
                grades: {
                    where: { term: term },
                    include: { course: true }
                }
            }
        });
        if (!student) {
            return res.status(404).json({ error: "Élève non trouvé" });
        }
        // Créer le document PDF
        const doc = new pdfkit_1.default({ margin: 50 });
        // Header du PDF
        doc.fontSize(25).text('BULLETIN DE NOTES', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Élève: ${(_a = student.user) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = student.user) === null || _b === void 0 ? void 0 : _b.lastName}`, { bold: true });
        doc.text(`Classe: ${((_c = student.class) === null || _c === void 0 ? void 0 : _c.name) || 'N/A'}`);
        doc.text(`Période: ${term}`);
        doc.text(`Matricule: ${student.enrollmentId}`);
        doc.moveDown(2);
        // Dessiner un tableau (simple)
        doc.fontSize(14).text('Résultats Académiques:', { underline: true });
        doc.moveDown();
        let totalScore = 0;
        let totalMax = 0;
        student.grades.forEach((grade) => {
            doc.fontSize(12).text(`${grade.course.name}: ${grade.score}/${grade.maxScore}`);
            totalScore += grade.score;
            totalMax += grade.maxScore;
        });
        doc.moveDown();
        const average = (totalScore / (totalMax || 1)) * 20;
        doc.fontSize(14).text(`MOYENNE GÉNÉRALE: ${average.toFixed(2)}/20`, { bold: true });
        // Finaliser le PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=bulletin_${studentId}.pdf`);
        doc.pipe(res);
        doc.end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la génération du bulletin PDF." });
    }
});
exports.generateStudentReportCard = generateStudentReportCard;
