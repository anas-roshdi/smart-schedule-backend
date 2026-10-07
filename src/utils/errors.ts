export const ErrorCodes = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_JSON: 'INVALID_JSON',
    DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
    NOT_FOUND: 'NOT_FOUND',
    INVALID_TOKEN: 'INVALID_TOKEN',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    UNAUTHORIZED: 'UNAUTHORIZED',
    RATE_LIMITED: 'RATE_LIMITED',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export const ErrorMessages = {
    [ErrorCodes.VALIDATION_ERROR]: 'فشل التحقق من صحة المدخلات',
    [ErrorCodes.INVALID_JSON]: 'صيغة البيانات المرسلة غير صحيحة',
    [ErrorCodes.DUPLICATE_ENTRY]: 'بيانات التسجيل (البريد الإلكتروني أو الرقم الجامعي) مستخدمة مسبقاً',
    [ErrorCodes.NOT_FOUND]: 'السجل المطلوب غير موجود',
    [ErrorCodes.INVALID_TOKEN]: 'رمز المصادقة غير صالح أو منتهي',
    [ErrorCodes.INVALID_CREDENTIALS]: 'بيانات الدخول غير صحيحة',
    [ErrorCodes.UNAUTHORIZED]: 'غير مصرح لك بالوصول',
    [ErrorCodes.RATE_LIMITED]: 'تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً',
    [ErrorCodes.INTERNAL_ERROR]: 'حدث خطأ داخلي في الخادم',
    ROUTE_NOT_FOUND: 'المسار المطلوب غير موجود',
    AUTH_RATE_LIMITED: 'محاولات كثيرة جداً، يرجى المحاولة بعد 15 دقيقة',
} as const;

export interface ValidationErrorItem {
    field: string;
    message: string;
}

export interface ApiErrorResponse {
    message: string;
    code: string;
    errors?: ValidationErrorItem[];
}
