import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// /api/auth/register (Utilisé typiquement pour créer le premier admin ou par un admin déjà connecté)
// @ts-ignore
router.post('/register', register);

// /api/auth/login
// @ts-ignore
router.post('/login', login);

export default router;
