import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat";
import newsRoutes from "./routes/news";
import { logger } from "./lib/logger";

import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3000;

// Security: Use Helmet for secure headers
app.use(helmet());

// Security: Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "http://localhost:5173",
}));

// Use morgan for console logging, but we also have our winston logger
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/news", newsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global Error Handler (MUST BE LAST)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error("Unhandled Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: statusCode === 500 ? "Internal Server Error" : err.message,
      code: err.code || "INTERNAL_ERROR",
    },
  });
});

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
