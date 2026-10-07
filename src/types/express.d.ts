// Extend Express Request interface globally
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                studentId: string;
            };
        }
    }
}

export { };