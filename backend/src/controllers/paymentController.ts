import { Request, Response } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-01-27' as any,
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { studentId, amount, description } = req.body;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true }
    });

    if (!student) {
      return res.status(404).json({ error: "Élève non trouvé." });
    }

    // Créer une session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Frais Scolaires: ${description}`,
            description: `Élève: ${student.user?.firstName} ${student.user?.lastName}`,
          },
          unit_amount: Math.round(amount * 100), // En centimes
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/finances?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/finances?canceled=true`,
      metadata: { studentId },
    });

    res.json({ id: session.id, url: session.url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de la création de la session de paiement." });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        student: {
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      },
      orderBy: { dueDate: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des paiements.' });
  }
};
