import db from '../services/db.js';

// Controller to get all books
export const getAllBooks = (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM books ORDER BY title');
        const books = stmt.all();
        res.status(200).json(books);
    } catch (error) {
        console.error("Failed to fetch books:", error);
        res.status(500).json({ message: "Failed to fetch books", error: error.message });
    }
};

// Controller to get a single book by its ID
export const getBookById = (req, res) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare('SELECT * FROM books WHERE id = ?');
        const book = stmt.get(id);

        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: `Book with id ${id} not found.` });
        }
    } catch (error) {
        console.error(`Failed to fetch book with id ${req.params.id}:`, error);
        res.status(500).json({ message: "Failed to fetch book", error: error.message });
    }
};
// Controller to create a new book
export const createBook = (req, res) => {
    const { title, author, isbn, price, cost, stock, category, publisher, description, location, coverImage } = req.body;
    
    // Basic validation
    if (!title || !author || !isbn) {
        return res.status(400).json({ message: "Title, author, and ISBN are required." });
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO books (title, author, isbn, price, cost, stock, category, publisher, description, location, coverImage)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const info = stmt.run(title, author, isbn, price, cost, stock, category, publisher, description, location, coverImage);
        
        const newBookId = info.lastInsertRowid;
        const newBook = db.prepare('SELECT * FROM books WHERE id = ?').get(newBookId);

        res.status(201).json(newBook);
    } catch (error) {
        // Handle unique constraint violation for ISBN
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ message: `A book with ISBN ${isbn} already exists.` });
        }
        console.error("Failed to create book:", error);
        res.status(500).json({ message: "Failed to create book", error: error.message });
    }
};

// Controller to update a book
export const updateBook = (req, res) => {
    const { id } = req.params;
    const { title, author, isbn, price, cost, stock, category, publisher, description, location, coverImage } = req.body;

    try {
        const stmt = db.prepare(`
            UPDATE books 
            SET title = ?, author = ?, isbn = ?, price = ?, cost = ?, stock = ?, category = ?, publisher = ?, description = ?, location = ?, coverImage = ?
            WHERE id = ?
        `);
        const info = stmt.run(title, author, isbn, price, cost, stock, category, publisher, description, location, coverImage, id);

        if (info.changes === 0) {
            return res.status(404).json({ message: `Book with id ${id} not found.` });
        }

        const updatedBook = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
        res.status(200).json(updatedBook);
    } catch (error) {
        console.error("Failed to update book:", error);
        res.status(500).json({ message: "Failed to update book", error: error.message });
    }
};

// Controller to delete a book
export const deleteBook = (req, res) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('DELETE FROM books WHERE id = ?');
        const info = stmt.run(id);

        if (info.changes === 0) {
            return res.status(404).json({ message: `Book with id ${id} not found.` });
        }

        res.status(204).send(); // 204 No Content is standard for a successful deletion
    } catch (error) {
        console.error("Failed to delete book:", error);
        res.status(500).json({ message: "Failed to delete book", error: error.message });
    }
};