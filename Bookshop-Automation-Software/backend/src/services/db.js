import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

const dbPath = process.env.DATABASE_PATH || '../data/dev.db';
const db = new Database(dbPath, { verbose: console.log });
db.pragma('journal_mode = WAL'); // For better concurrency

export default db;