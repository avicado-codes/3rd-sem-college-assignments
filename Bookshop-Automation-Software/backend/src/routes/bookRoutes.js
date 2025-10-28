import { Router } from 'express';
import { getAllBooks, getBookById } from '../controllers/bookController.js';

const router = Router();

// Defines the endpoint: GET /api/books
router.get('/', getAllBooks);

// Defines the endpoint: GET /api/books/1 (or any id)
router.get('/:id', getBookById);

export default router;