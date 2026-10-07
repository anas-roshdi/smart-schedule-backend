import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma'; // Correct custom path import
import { registerSchema, loginSchema } from '../schemas/auth.schema';
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

export const loginHandler = async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);

    const student = await prisma.student.findUnique({ where: { email } });


    // رسالة موحدة سواء كان الحساب غير موجود أو كلمة المرور خاطئة
    const INVALID = { message: 'بيانات الدخول غير صحيحة', code: 'INVALID_CREDENTIALS' };

    // مقارنة وهمية عند عدم وجود الحساب لتقليل فرق الزمن بين الحالتين
    const DUMMY_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8.pZ9wQ0Zc5y3p6k5vS8o8Z1Z1Z1Z1';
    const isValid = await bcrypt.compare(password, student?.password ?? DUMMY_HASH);

    if (!student || !isValid) {
        return res.status(401).json(INVALID);
    }

    const token = jwt.sign({ id: student.id }, env.JWT_SECRET, { expiresIn: '7d' });

    const { password: _pw, ...safeStudent } = student;

    return res.status(200).json({
        message: 'تم تسجيل الدخول بنجاح',
        token,
        student: safeStudent,
    });
};

export const meHandler = async (req: Request, res: Response) => {
    const student = await prisma.student.findUnique({
        where: { id: req.user!.id },
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
            preferences: true,
        },
    });

    if (!student) {
        return res.status(404).json({ message: 'الطالب غير موجود', code: 'NOT_FOUND' });
    }

    return res.json({ student });
};