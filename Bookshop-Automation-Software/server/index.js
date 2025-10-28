// Import necessary modules
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises; // Use the promise-based version of fs
const path = require('path');

// Initialize the Express application
const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable the Express app to parse JSON formatted request bodies

// Define the path to the JSON database file
const DB_PATH = path.join(__dirname, 'db', 'books.json');

// --- Helper Functions for File I/O ---

// Function to read the database file
const readDB = async () => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist or other error, return an empty array
        console.error("Error reading database file:", error);
        return [];
    }
};

// Function to write to the database file
const writeDB = async (data) => {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error writing to database file:", error);
    }
};


// --- API Endpoints for Books ---

// GET /api/books - Retrieve all books
app.get('/api/books', async (req, res) => {
    const books = await readDB();
    res.json(books);
});

// GET /api/books/:id - Retrieve a single book by ID (ISBN)
app.get('/api/books/:id', async (req, res) => {
    const books = await readDB();
    const book = books.find(b => b.id === req.params.id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// POST /api/books - Add a new book
app.post('/api/books', async (req, res) => {
    const books = await readDB();
    const newBook = req.body;
    // Use ISBN as a unique ID, or generate one if not present
    newBook.id = newBook.isbn || `id_${Date.now()}`; 
    
    books.push(newBook);
    await writeDB(books);
    res.status(201).json(newBook);
});

// PUT /api/books/:id - Update an existing book
app.put('/api/books/:id', async (req, res) => {
    let books = await readDB();
    const bookIndex = books.findIndex(b => b.id === req.params.id);

    if (bookIndex !== -1) {
        // Update the book record
        books[bookIndex] = { ...books[bookIndex], ...req.body };
        await writeDB(books);
        res.json(books[bookIndex]);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// DELETE /api/books/:id - Delete a book
app.delete('/api/books/:id', async (req, res) => {
    let books = await readDB();
    const updatedBooks = books.filter(b => b.id !== req.params.id);

    if (books.length !== updatedBooks.length) {
        await writeDB(updatedBooks);
        res.status(204).send(); // No content to send back
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});