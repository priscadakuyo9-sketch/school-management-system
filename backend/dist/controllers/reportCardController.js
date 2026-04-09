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
    var _a, _b, _c, _d;
    try {
        const { studentId, term } = req.params;
        const student = yield prisma.student.findUnique({
            where: { id: studentId },
            include: {
                user: true,
                class: true,
                grades: {
                    include: { course: true }
                }
            }
        });
        if (!student)
            return res.status(404).json({ error: "Élève non trouvé" });
        const doc = new pdfkit_1.default({ margin: 40, size: 'A4' });
        // HEADER OFFICIEL BURKINA FASO
        doc.fontSize(10).font('Helvetica-Bold').text('BURKINA FASO', { align: 'right' });
        doc.fontSize(8).font('Helvetica').text('Unité - Progrès - Justice', { align: 'right' });
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica-Bold').text('MINISTERE DE L\'EDUCATION NATIONALE', { align: 'left' });
        doc.text('DE L\'ALPHABETISATION ET DE LA PROMOTION', { align: 'left' });
        doc.text('DES LANGUES NATIONALES', { align: 'left' });
        doc.moveDown(2);
        // ECOLE INFO
        doc.fontSize(16).text('EDUMANAGE EXCELLENCE SCHOOL', { align: 'center', characterSpacing: 2 });
        doc.fontSize(10).text('Ouagadougou, Secteur 15 - Tel: +226 25 30 00 00', { align: 'center' });
        doc.moveDown();
        doc.rect(40, doc.y, 515, 2).fill('#14b8a6');
        doc.moveDown(2);
        // BULLETIN TITLE
        doc.fontSize(18).fillColor('#000').font('Helvetica-Bold').text('BULLETIN DE NOTES DU ' + term.toUpperCase(), { align: 'center' });
        doc.moveDown(2);
        // STUDENT INFO BOX
        const startY = doc.y;
        doc.fontSize(10).font('Helvetica-Bold').text(`NOM & PRÉNOM: ${(_a = student.user) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = student.user) === null || _b === void 0 ? void 0 : _b.lastName}`, 50, startY);
        doc.text(`CLASSE: ${((_c = student.class) === null || _c === void 0 ? void 0 : _c.name) || 'N/A'}`, 50, startY + 15);
        doc.text(`MATRICULE: ${student.enrollmentId}`, 50, startY + 30);
        doc.text(`ANNÉE SCOLAIRE: 2025-2026`, 380, startY);
        doc.text(`EFFECTIF: 35`, 380, startY + 15);
        doc.moveDown(4);
        // TABLE HEADER
        const tableTop = doc.y;
        doc.rect(40, tableTop, 515, 20).fill('#f8fafc');
        doc.fillColor('#475569').fontSize(9).font('Helvetica-Bold');
        doc.text('MATIÈRES', 50, tableTop + 7);
        doc.text('NOTES', 200, tableTop + 7);
        doc.text('COEFF', 280, tableTop + 7);
        doc.text('TOTAL', 350, tableTop + 7);
        doc.text('APPRÉCIATIONS', 430, tableTop + 7);
        // TABLE ROWS
        let currentY = tableTop + 20;
        let totalPoints = 0;
        let totalCoeff = 0;
        student.grades.forEach((grade) => {
            var _a, _b;
            const coeff = ((_a = grade.course) === null || _a === void 0 ? void 0 : _a.coefficient) || 2;
            const points = grade.score * coeff;
            totalPoints += points;
            totalCoeff += coeff;
            doc.fillColor('#000').font('Helvetica').fontSize(9);
            doc.text(((_b = grade.course) === null || _b === void 0 ? void 0 : _b.name) || 'Matière', 50, currentY + 7);
            doc.text(`${grade.score}/20`, 200, currentY + 7);
            doc.text(`${coeff}`, 280, currentY + 7);
            doc.text(`${points}`, 350, currentY + 7);
            doc.text(grade.score >= 10 ? 'Satisfaisant' : 'A redoubler d\'efforts', 430, currentY + 7);
            doc.moveTo(40, currentY + 20).lineTo(555, currentY + 20).stroke('#e2e8f0');
            currentY += 20;
        });
        // SUMMARY
        doc.moveDown(2);
        const avg = totalPoints / (totalCoeff || 1);
        doc.rect(350, currentY + 20, 205, 60).stroke('#14b8a6');
        doc.fontSize(12).font('Helvetica-Bold').text(`MOYENNE: ${avg.toFixed(2)} / 20`, 365, currentY + 35);
        doc.fontSize(10).text(`RANG: 1er / 35`, 365, currentY + 55);
        // FOOTER SIGNATURES
        doc.moveDown(5);
        const footerY = doc.y;
        doc.fontSize(10).font('Helvetica-Bold').text('Le Professeur Principal', 60, footerY);
        doc.text('Le Directeur des Études', 400, footerY);
        doc.fontSize(8).font('Helvetica-Oblique').text('(Cachet et Signature)', 60, footerY + 15);
        doc.text('(Cachet et Signature)', 400, footerY + 15);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=bulletin_${(_d = student.user) === null || _d === void 0 ? void 0 : _d.lastName}.pdf`);
        doc.pipe(res);
        doc.end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur PDF" });
    }
});
exports.generateStudentReportCard = generateStudentReportCard;
