import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import trainRoutes from './routes/trains';
import bookingRoutes from './routes/bookings';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/trains', trainRoutes);
app.use('/bookings', bookingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});