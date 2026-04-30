import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
