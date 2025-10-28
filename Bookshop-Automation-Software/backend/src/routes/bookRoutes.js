import { Router } from 'express';
import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from '../controllers/bookController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// PUBLIC routes (anyone can access these)
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// PROTECTED routes (only logged-in users can access)
// The middleware will run before the controller function
router.post('/', authenticateToken, createBook);
router.put('/:id', authenticateToken, updateBook);

// ADMIN ONLY route (only users with 'admin' role can access)
router.delete('/:id', authenticateToken, isAdmin, deleteBook);


export default router;