import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '../generated/prisma/client';
import jwt from 'jsonwebtoken';
import { ErrorCodes, ErrorMessages, ApiErrorResponse } from '../utils/errors';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response<ApiErrorResponse>,
    next: NextFunction
) => {
    // 1. Zod Validation Error
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: ErrorMessages[ErrorCodes.VALIDATION_ERROR],
            code: ErrorCodes.VALIDATION_ERROR,
            errors: err.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        });
    }

    // 2. Prisma Database Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return res.status(409).json({
                message: ErrorMessages[ErrorCodes.DUPLICATE_ENTRY],
                code: ErrorCodes.DUPLICATE_ENTRY,
            });
        }
        if (err.code === 'P2025') {
            return res.status(404).json({
                message: ErrorMessages[ErrorCodes.NOT_FOUND],
                code: ErrorCodes.NOT_FOUND,
            });
        }
    }

    // 3. JWT Authentication Errors
    if (
        err instanceof jwt.JsonWebTokenError ||
        err instanceof jwt.TokenExpiredError
    ) {
        return res.status(401).json({
            message: ErrorMessages[ErrorCodes.INVALID_TOKEN],
            code: ErrorCodes.INVALID_TOKEN,
        });
    }

    // 4. Invalid JSON body
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
            message: ErrorMessages[ErrorCodes.INVALID_JSON],
            code: ErrorCodes.INVALID_JSON,
        });
    }

    // 5. Fallback
    console.error('🔥 Unexpected Internal Error:', err);
    return res.status(500).json({
        message: ErrorMessages[ErrorCodes.INTERNAL_ERROR],
        code: ErrorCodes.INTERNAL_ERROR,
    });
};