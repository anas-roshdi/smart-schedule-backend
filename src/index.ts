import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import authRoutes from "./routes/auth";
import { errorHandler } from "./middlewares/errorHandler";
import { ErrorCodes, ErrorMessages } from "./utils/errors";

const app = express();

// 1) الأمان
app.use(helmet());
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:3001"], // عدّلها حسب منفذ الواجهة
        credentials: true,
    })
);

// 2) قراءة JSON (مع حد للحجم)
app.use(express.json({ limit: "10kb" }));

// 3) حد عام للطلبات
app.use(
    "/api",
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            message: ErrorMessages[ErrorCodes.RATE_LIMITED],
            code: ErrorCodes.RATE_LIMITED,
        },
    })
);

// 4) حد أشد على التسجيل والدخول
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: ErrorMessages.AUTH_RATE_LIMITED,
        code: ErrorCodes.RATE_LIMITED,
    },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// 5) المسارات
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({ message: "خادم Smart Schedule يعمل بنجاح" });
});

app.use((req, res) => {
    res.status(404).json({
        message: ErrorMessages.ROUTE_NOT_FOUND,
        code: ErrorCodes.NOT_FOUND,
    });
});

// 6) معالج الأخطاء (أخيراً دائماً)
app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(`Server running at http://localhost:${env.PORT} (${env.NODE_ENV})`);
});