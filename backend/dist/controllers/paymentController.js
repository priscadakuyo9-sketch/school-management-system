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
exports.createCheckoutSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2025-01-27',
});
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { studentId, amount, description } = req.body;
        const student = yield prisma.student.findUnique({
            where: { id: studentId },
            include: { user: true }
        });
        if (!student) {
            return res.status(404).json({ error: "Élève non trouvé." });
        }
        // Créer une session Stripe Checkout
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Frais Scolaires: ${description}`,
                            description: `Élève: ${(_a = student.user) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = student.user) === null || _b === void 0 ? void 0 : _b.lastName}`,
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Échec de la création de la session de paiement." });
    }
});
exports.createCheckoutSession = createCheckoutSession;
