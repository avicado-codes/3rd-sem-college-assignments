const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// --- DATABASE SETUP ---
const dbPathDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbPathDir)) {
    fs.mkdirSync(dbPathDir, { recursive: true });
    console.log(`Created directory: ${dbPathDir}`);
}
const dbFile = path.join(dbPathDir, 'dev.db');
const db = new Database(dbFile);

console.log('Running seed script...');

// --- DROP EXISTING TABLES ---
db.exec(`
    DROP TABLE IF EXISTS stock_movements;
    DROP TABLE IF EXISTS sale_items;
    DROP TABLE IF EXISTS sales;
    DROP TABLE IF EXISTS purchase_order_items;
    DROP TABLE IF EXISTS purchase_orders;
    DROP TABLE IF EXISTS suppliers;
    DROP TABLE IF EXISTS books;
    DROP TABLE IF EXISTS users;
`);
console.log('✅ Dropped existing tables.');

// --- CREATE NEW TABLES ---
db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        passwordHash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'staff' CHECK(role IN ('admin', 'staff'))
    );

    CREATE TABLE books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT UNIQUE,
        price REAL NOT NULL,
        cost REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        category TEXT,
        publisher TEXT,
        description TEXT,
        location TEXT,
        coverImage TEXT
    );
    
    CREATE TABLE suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        email TEXT,
        phone TEXT
    );
`);
console.log('✅ Created new tables with updated schema.');

// --- SEED USERS ---
const password = 'password123';
const salt = bcrypt.genSaltSync(10);
const adminPasswordHash = bcrypt.hashSync(password, salt);

const insertUser = db.prepare('INSERT INTO users (name, email, passwordHash, role) VALUES (?, ?, ?, ?)');
insertUser.run('Admin User', 'admin@bookshop.local', adminPasswordHash, 'admin');
console.log('✅ Seeded admin user (email: admin@bookshop.local, pass: password123)');

// --- SEED BOOKS FROM JSON FILE ---
console.log('Reading books.json file...');
const booksJSONPath = path.join(process.cwd(), 'scripts', 'books.json');
let books = [];
try {
    const booksFileContent = fs.readFileSync(booksJSONPath, 'utf8');
    books = JSON.parse(booksFileContent);
    console.log(`Found ${books.length} books in books.json.`);
} catch (error) {
    console.error('❌ Error reading or parsing books.json:', error.message);
    console.log('Please ensure books.json exists in the scripts/ directory and is valid JSON.');
    db.close();
    process.exit(1);
}

const insertBook = db.prepare(`
    INSERT INTO books (title, author, isbn, price, cost, stock, category, publisher, description, location, coverImage) 
    VALUES (@title, @author, @isbn, @price, @cost, @stock, @category, @publisher, @description, @location, @coverImage)
`);

const insertManyBooks = db.transaction((bookList) => {
    for (const book of bookList) {
        insertBook.run({
            title: book.title || 'No Title',
            author: book.author || 'No Author',
            isbn: book.isbn || null,
            price: book.price || 0.0,
            cost: book.cost || 0.0,
            stock: book.stock || 0,
            category: book.category || 'Uncategorized',
            publisher: book.publisher || 'Unknown Publisher',
            description: book.description || '',
            location: book.location || null,
            coverImage: book.coverImage || null
        });
    }
});

if (books.length > 0) {
    insertManyBooks(books);
    console.log(`✅ Seeded ${books.length} books from books.json.`);
}

db.close();
console.log('\nSeed script finished successfully. The database is ready!');