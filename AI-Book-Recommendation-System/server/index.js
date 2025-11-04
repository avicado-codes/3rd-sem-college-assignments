// server/index.js
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors()); // Allows requests from our React client
app.use(express.json()); // Allows server to parse JSON in request bodies

// The mock endpoint for book recommendations
app.post('/api/recommendations', (req, res) => {
  console.log('Received prompt:', req.body.prompt);

  // Simulate network delay
  setTimeout(() => {
    // This is a hard-coded, mock response.
    // In a future step, this will be replaced by a real call to the Gemini API.
    const mockResponse = {
      status: 'success',
      recommendations: [
        {
          title: 'The Three-Body Problem',
          author: 'Cixin Liu',
          reasoning: 'This is a fantastic hard science fiction novel that explores grand, mind-bending concepts about civilization and contact. The scale is immense and the scientific ideas are rigorously explored.',
          foryoubecause: 'It features the kind of large-scale, intelligent problem-solving you enjoyed.',
        },
        {
          title: 'Recursion',
          author: 'Blake Crouch',
          reasoning: 'A high-concept thriller that plays with the nature of memory and time. The pacing is relentless, and the plot is an intricate puzzle that comes together beautifully.',
          foryoubecause: 'It delivers a smart, fast-paced sci-fi mystery.',
        },
        {
          title: 'Exhalation: Stories',
          author: 'Ted Chiang',
          reasoning: 'A collection of profound and deeply human short stories that use sci-fi premises to explore philosophical questions. Each story is a perfectly crafted thought experiment.',
          foryoubecause: 'Offers intelligent, thought-provoking sci-fi with a strong emotional core.',
        },
      ],
    };
    res.json(mockResponse);
  }, 1500); // 1.5 second delay
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});