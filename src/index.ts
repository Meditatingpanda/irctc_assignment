import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import trainRoutes from './routes/trains';
import bookingRoutes from './routes/bookings';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/trains', trainRoutes);
app.use('/bookings', bookingRoutes);

// error handling middleware
app.use(errorHandler);
app.use(notFoundHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});