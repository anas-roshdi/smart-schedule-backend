import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'يجب تسجيل الدخول أولاً', code: 'UNAUTHORIZED' });
    }

    const token = header.slice(7);
    const payload = jwt.verify(token, env.JWT_SECRET) as { id: string };

    req.user = { id: payload.id };
    next();
};