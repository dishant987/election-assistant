import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat";
import newsRoutes from "./routes/news";
import { logger } from "./lib/logger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "http://localhost:5173",
}));

// Use morgan for console logging, but we also have our winston logger
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/news", newsRoutes);


app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
