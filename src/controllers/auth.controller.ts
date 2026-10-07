import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma'; // Correct custom path import
import { registerSchema } from '../schemas/auth.schema';
import { env } from '../config/env';

export const registerHandler = async (req: Request, res: Response) => {
    // 1. Validate request body
    const validatedData = registerSchema.parse(req.body);

    // 2. Destructure password & email safely
    const { password, email, ...rest } = validatedData;

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create Student & Preference atomically
    const student = await prisma.student.create({
        data: {
            ...rest,
            email, // Already lowerecased and trimmed by Zod schema
            password: hashedPassword,
            preferences: {
                create: {
                    preferredTime: 'ANY',
                },
            },
        },
        select: {
            id: true,
            studentId: true,
            name: true,
            email: true,
            gender: true,
            major: true,
            academicLevel: true,
            phone: true,
            dob: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    // 5. Generate JWT with user ID
    const token = jwt.sign({ id: student.id }, env.JWT_SECRET, {
        expiresIn: '7d',
    });

    return res.status(201).json({
        message: 'تم تسجيل الطالب بنجاح',
        token,
        student,
    });
};