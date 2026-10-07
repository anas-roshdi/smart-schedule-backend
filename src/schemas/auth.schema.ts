import { z } from 'zod';

export const registerSchema = z.object({
    studentId: z
        .string({ message: 'الرقم الجامعي مطلوب' })
        .min(5, 'الرقم الجامعي يجب ألا يقل عن 5 خانات'),
    name: z
        .string({ message: 'الاسم مطلوب' })
        .min(2, 'الاسم يجب ألا يقل عن حرفين'),
    email: z
        .string({ message: 'البريد الإلكتروني مطلوب' })
        .trim()
        .toLowerCase()
        .email('صيغة البريد الإلكتروني غير صحيحة'),
    password: z
        .string({ message: 'كلمة المرور مطلوبة' })
        .min(8, 'كلمة المرور يجب ألا تقل عن 8 أحرف'),
    gender: z.enum(['ذكر', 'أنثى'], {
        message: "الجنس يجب أن يكون 'ذكر' أو 'أنثى'",
    }),
    major: z.string().optional(),
    academicLevel: z.coerce
        .number()
        .int('المستوى الأكاديمي يجب أن يكون رقماً صحيحاً')
        .min(1, 'المستوى الأكاديمي يجب أن يكون بين 1 و 12')
        .max(12, 'المستوى الأكاديمي يجب أن يكون بين 1 و 12')
        .optional(),
    phone: z.string().optional(),
    dob: z
        .string()
        .optional()
        .transform((v) => (v ? new Date(v) : undefined))
        .refine((d) => !d || !isNaN(d.getTime()), 'صيغة التاريخ غير صحيحة'),
});