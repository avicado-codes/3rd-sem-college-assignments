// Import necessary packages
const express = require('express');
const cors = require('cors');

// Import the database connection
const db = require('./db/connection');

// --- Server Configuration ---
const app = express();
const PORT = process.env.PORT || 3001; // Use port 3001 for the API

// --- Middleware ---
// Enable CORS for all routes, allowing our frontend to make requests
app.use(cors());
// Enable Express to parse JSON in the request body
app.use(express.json());

// --- API Routes ---

// A simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the TIS API!' });
});

// GET /api/places - Fetches all places from the database
app.get('/api/places', async (req, res) => {
  try {
    const places = await db('places').select('*'); // SELECT * FROM places
    res.status(200).json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ error: 'Failed to retrieve places from the database.' });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});