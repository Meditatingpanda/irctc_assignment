import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, isAdmin } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", authenticateToken as any, isAdmin as any, async (req, res) => {
  const { name, source, destination, totalSeats } = req.body;
  const train = await prisma.train.create({
    data: { name, source, destination, totalSeats },
  });
  res.json(train);
});

router.get("/availability", async (req, res) => {
  const { source, destination } = req.query;
  const trains = await prisma.train.findMany({
    where: { source: source as string, destination: destination as string },
    include: {
      bookings: true,
    },
  });

  const availabilities = trains.map((train: any) => ({
    ...train,
    availableSeats: train.totalSeats - train.bookings.length,
  }));

  res.json(availabilities);
});

export default router;
