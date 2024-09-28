import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth";
import { bookSeat } from "../services/bookingService";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", authenticateToken as any, async (req: any, res: any) => {
  const { trainId } = req.body;
  const userId = req.user!.userId;

  if (!trainId) {
    return res.status(400).json({ error: "Train ID is required" });
  }

  try {
    const booking = await bookSeat(userId, parseInt(trainId));
    res.json(booking);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", authenticateToken as any, async (req: any, res: any) => {
  const bookingId = parseInt(req.params.id);
  const userId = req.user!.userId;

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
    include: { train: true },
  });

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  res.json(booking);
});

export default router;
