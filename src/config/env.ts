import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long for security'),
});

const parseEnv = () => {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error('❌ Invalid Environment Variables:', result.error.format());
        process.exit(1);
    }

    return result.data;
};

export const env = parseEnv();