import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(path.resolve(), "build"))); // Раздаёт React

// API маршрут для проверки работы сервера
app.get("/api/status", (req, res) => {
  res.json({ message: "Сервер работает!" });
});

// Раздача фронтенда (React)
app.get("*", (req, res) => {
  res.sendFile(path.join(path.resolve(), "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
