import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-edumanage';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || (req.query.token as string);

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé. Token manquant.' });
  }
  try {
    const verified = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    (req as any).user = verified;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token invalide ou expiré.' });
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: "Vous n'avez pas les permissions nécessaires." });
    }
    next();
  };
};
