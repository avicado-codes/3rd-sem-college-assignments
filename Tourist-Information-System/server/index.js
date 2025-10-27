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

// POST /api/places - Create a new place
app.post('/api/places', async (req, res) => {
    try {
        // The frontend will send the new place's data in the request body
        const newPlace = req.body;
        // The 'tags' property will be a JSON string, which is exactly what our DB needs.
        const [insertedId] = await db('places').insert(newPlace).returning('id');
        const createdPlace = await db('places').where({ id: insertedId }).first();
        // Respond with a 201 "Created" status and the new place object
        res.status(201).json(createdPlace);
    } catch (error) {
        console.error('Error creating place:', error);
        res.status(500).json({ error: 'Failed to create place.' });
    }
});

// PUT /api/places/:id - Update an existing place
app.put('/api/places/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const placeDataToUpdate = req.body;
        const count = await db('places').where({ id }).update(placeDataToUpdate);

        if (count === 0) {
            // If no rows were updated, the place was not found
            return res.status(404).json({ error: 'Place not found.' });
        }
        // Fetch and return the fully updated place object
        const updatedPlace = await db('places').where({ id }).first();
        res.status(200).json(updatedPlace);
    } catch (error) {
        console.error('Error updating place:', error);
        res.status(500).json({ error: 'Failed to update place.' });
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});