import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import emailRoutes from "./routes/emailroutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  return res.status(201).json({
    success: true,
    message: "Server health okay ✅",
  });
});

app.use("/", emailRoutes);

app.listen(PORT, () => {
  console.log(`Server started at localhost:${PORT}`);
});