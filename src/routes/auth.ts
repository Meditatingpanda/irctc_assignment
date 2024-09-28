import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRole from "../enums/Role";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/register", async (req: any, res: any) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (role === UserRole.ADMIN) {
    const apiKey = req.headers["x-api-key"];
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ error: "Invalid API key" });
    }
  }

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });
    res.json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    res.status(400).json({ error: "Username already exists" });
  }
});

router.post("/login", async (req: any, res: any) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
  res.json({ token });
});

export default router;
