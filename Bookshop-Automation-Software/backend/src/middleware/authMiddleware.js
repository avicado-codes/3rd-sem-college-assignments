import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format is "Bearer TOKEN"

    if (token == null) {
        return res.sendStatus(401); // Unauthorized if no token is present
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // This could be due to an expired token or an invalid signature
            return res.sendStatus(403); // Forbidden
        }

        // If the token is valid, attach the user payload to the request object
        req.user = user;
        next(); // Proceed to the next middleware or the route handler
    });
};

// Optional: Middleware to restrict access to admins only
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admins only." });
    }
};