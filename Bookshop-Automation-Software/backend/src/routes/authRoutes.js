import { Router } from 'express';
import { login } from '../controllers/authController.js';

const router = Router();

// Defines the endpoint: POST /api/auth/login
router.post('/login', login);

// We can add /signup and /logout routes here later

export default router;