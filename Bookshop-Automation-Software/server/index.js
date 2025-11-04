const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// --- Middleware ---

// CORRECTED CORS Configuration: Allow all methods from any origin
app.use(cors()); 

// Body parser for JSON requests
app.use(express.json());

// --- Database Paths ---
const BOOKS_DB_PATH = path.join(__dirname, 'db', 'books.json');
const SALES_DB_PATH = path.join(__dirname, 'db', 'sales.json');

// --- Helper Functions ---
const readDB = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        console.error(`Error reading database file at ${filePath}:`, error);
        throw error;
    }
};

const writeDB = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error writing to database file at ${filePath}:`, error);
        throw error;
    }
};

// --- API Endpoints for Books ---
app.get('/api/books', async (req, res) => {
    try {
        res.json(await readDB(BOOKS_DB_PATH));
    } catch (e) { res.status(500).json({ message: 'Error reading books database.' }); }
});

app.get('/api/books/:id', async (req, res) => {
    try {
        const books = await readDB(BOOKS_DB_PATH);
        const book = books.find(b => b.id === req.params.id);
        if (book) res.json(book);
        else res.status(404).json({ message: 'Book not found' });
    } catch (e) { res.status(500).json({ message: 'Error reading books database.' }); }
});

app.post('/api/books', async (req, res) => {
    try {
        const books = await readDB(BOOKS_DB_PATH);
        const newBook = req.body;
        newBook.id = newBook.isbn || `id_${Date.now()}`;
        books.push(newBook);
        await writeDB(BOOKS_DB_PATH, books);
        res.status(201).json(newBook);
    } catch (e) { res.status(500).json({ message: 'Error writing to books database.' }); }
});

app.put('/api/books/:id', async (req, res) => {
    try {
        let books = await readDB(BOOKS_DB_PATH);
        const bookIndex = books.findIndex(b => b.id === req.params.id);
        if (bookIndex !== -1) {
            books[bookIndex] = { ...books[bookIndex], ...req.body };
            await writeDB(BOOKS_DB_PATH, books);
            res.json(books[bookIndex]);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (e) { res.status(500).json({ message: 'Error writing to books database.' }); }
});

app.delete('/api/books/:id', async (req, res) => {
    try {
        let books = await readDB(BOOKS_DB_PATH);
        const updatedBooks = books.filter(b => b.id !== req.params.id);
        if (books.length !== updatedBooks.length) {
            await writeDB(BOOKS_DB_PATH, updatedBooks);
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (e) { res.status(500).json({ message: 'Error writing to books database.' }); }
});

// --- API Endpoints for Sales ---
app.get('/api/sales', async (req, res) => {
    try {
        res.json(await readDB(SALES_DB_PATH));
    } catch (e) { res.status(500).json({ message: 'Error reading sales database.' }); }
});

app.post('/api/sales', async (req, res) => {
    try {
        const sales = await readDB(SALES_DB_PATH);
        const newSale = {
            saleId: `sale_${Date.now()}`,
            date: new Date().toISOString(),
            items: req.body.items,
            totalAmount: req.body.totalAmount
        };
        sales.push(newSale);
        await writeDB(SALES_DB_PATH, sales);
        res.status(201).json(newSale);
    } catch (e) { res.status(500).json({ message: 'Error writing to sales database.' }); }
});

// --- Start Server ---
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));