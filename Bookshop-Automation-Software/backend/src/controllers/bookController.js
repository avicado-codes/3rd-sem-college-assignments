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

// We will add create, update, and delete functions later.