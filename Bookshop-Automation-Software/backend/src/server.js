import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import db from './services/db.js';

dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple health check route to test if the server is up
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

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