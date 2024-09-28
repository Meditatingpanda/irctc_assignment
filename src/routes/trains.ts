import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, isAdmin } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  "/add-trains",
  authenticateToken as any,
  isAdmin as any,
  async (req, res) => {
    const { name, source, destination, totalSeats } = req.body;
    const train = await prisma.train.create({
      data: { name, source, destination, totalSeats: parseInt(totalSeats) },
    });
    res.json(train);
  }
);

router.post(
  "/update-train/:id",
  authenticateToken as any,
  isAdmin as any,
  async (req, res) => {
    const { id } = req.params;
    const { name, source, destination, totalSeats } = req.body;
    const train = await prisma.train.update({
      where: { id: parseInt(id) },
      data: { name, source, destination, totalSeats: parseInt(totalSeats) },
    });
    res.json(train);
  }
);

router.get(
  "/availability",
  authenticateToken as any,
  async (req: any, res: any) => {
    const { source, destination } = req.query;
    if (!source || !destination) {
      return res
        .status(400)
        .json({ error: "Source and destination are required" });
    }
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
  }
);

export default router;
