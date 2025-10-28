import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 
dotenv.config({ path: path.join(__dirname, '../../.env') });

import db from './services/db.js';
import bookRoutes from './routes/bookRoutes.js';
import authRoutes from './routes/authRoutes.js';


const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple health check route to test if the server is up
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// PLUG IN THE AUTH ROUTES
app.use('/api/auth', authRoutes);

// PLUG IN THE BOOK ROUTES
app.use('/api/books', bookRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  // Check DB connection on startup
  try {
    const row = db.prepare('SELECT sqlite_version()').get();
    console.log(`✅ SQLite connected, version: ${row['sqlite_version()']}`);
  } catch (error) {
    console.error('❌ SQLite connection failed:', error.message);
  }
});

export default app; // Export for testing purposes