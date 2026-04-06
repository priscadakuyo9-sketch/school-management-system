import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateStudentReportCard = async (req: Request, res: Response) => {
  try {
    const { studentId, term } = req.params;

    // Récupérer l'élève et ses notes
    const student = await prisma.student.findUnique({
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
    const doc = new PDFDocument({ margin: 50 });

    // Header du PDF
    doc.fontSize(25).text('BULLETIN DE NOTES', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Élève: ${student.user?.firstName} ${student.user?.lastName}`, { bold: true });
    doc.text(`Classe: ${student.class?.name || 'N/A'}`);
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

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la génération du bulletin PDF." });
  }
};
