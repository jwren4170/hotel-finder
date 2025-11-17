import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bookingRoutes from '@/server/routes/bookings';
import { authHandler } from '@/server/routes/auth';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authHandler);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Hotel Finder API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API endpoints:`);
  console.log(`   - GET  http://localhost:${PORT}/api/health`);
  console.log(`   - POST http://localhost:${PORT}/api/bookings`);
  console.log(`   - GET  http://localhost:${PORT}/api/bookings`);
  console.log(`   - GET  http://localhost:${PORT}/api/bookings/:id`);
});
