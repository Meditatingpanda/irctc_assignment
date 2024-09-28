import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function bookSeat(userId: number, trainId: number) {
  return await prisma.$transaction(
    async (prisma) => {
      const train = await prisma.train.findUnique({
        where: { id: trainId },
        include: { bookings: true },
      });

      if (!train) {
        throw new Error("Train not found");
      }

      if (train.bookings.length >= train.totalSeats) {
        throw new Error("No seats available");
      }

      const seatNumber = train.bookings.length + 1;

      const booking = await prisma.booking.create({
        data: {
          userId,
          trainId,
          seatNumber,
        },
      });

      return booking;
    },
    {
      isolationLevel: "Serializable",
    }
  );
}
