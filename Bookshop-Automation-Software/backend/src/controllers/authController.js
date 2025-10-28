import db from '../services/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // Find the user by email
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = stmt.get(email);

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." }); // Unauthorized
        }

        // Compare the provided password with the stored hash
        const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." }); // Unauthorized
        }

        // If credentials are valid, generate a JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' } // Token expires in 8 hours
        );

        // Send the token back to the client
        res.status(200).json({ 
            message: "Login successful!",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
};