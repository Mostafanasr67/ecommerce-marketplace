import express from "express";
import "dotenv/config";
import prisma from "./prisma.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", async (_req, res) => {
  const users = await prisma.user.findMany();
  console.log("users", users);
  res.json({
    status: "ok",
    message: "E-commerce API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});