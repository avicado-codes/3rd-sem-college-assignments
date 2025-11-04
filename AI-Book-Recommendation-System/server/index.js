// server/index.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3001;

// Initialize the Google Gemini AI Client
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in the .env file.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Middleware
app.use(cors());
app.use(express.json());

// Function to parse the raw text response from Gemini into structured JSON
const parseGeminiResponse = (text) => {
  const recommendations = [];
  const books = text.split('**Title:**').slice(1); // Split response into individual book sections

  books.forEach(bookStr => {
    const titleMatch = bookStr.match(/(.*?)\n/);
    const authorMatch = bookStr.match(/Author:\s*(.*?)\n/);
    const reasoningMatch = bookStr.match(/Reasoning:\s*([\s\S]*?)\nFor you because:/);
    const foryoubecauseMatch = bookStr.match(/For you because:\s*(.*)/);

    if (titleMatch && authorMatch && reasoningMatch && foryoubecauseMatch) {
      recommendations.push({
        title: titleMatch[1].trim(),
        author: authorMatch[1].trim(),
        reasoning: reasoningMatch[1].trim(),
        foryoubecause: foryoubecauseMatch[1].trim(),
      });
    }
  });
  return recommendations;
};

// The API endpoint for book recommendations
app.post('/api/recommendations', async (req, res) => {
  const userPrompt = req.body.prompt;
  if (!userPrompt) {
    return res.status(400).json({ status: 'error', message: 'Prompt is required.' });
  }

  const fullPrompt = `
    You are 'Bookwise', an AI literary companion with the warm and insightful persona of a favorite local bookstore owner. Your goal is to provide exactly 3 thoughtful, personalized book recommendations.

    **Your Response Rules:**
    1.  **Format:** For each book, you must provide strictly in this order:
        - \`**Title:**\` The full book title.
        - \`Author:\` The author's full name.
        - \`Reasoning:\` A descriptive paragraph (of at least 100 words). Do not include spoilers.
        - \`For you because:\` A descriptive, creative and appropriate sentence summarizing the connection.
    2.  **Persona & Tone:** Maintain a friendly, encouraging, and knowledgeable tone.
    3.  **Constraints:** Always return exactly three books. Keep the total response under 400 words. Do not add any introductory or concluding text outside of the book list.

    **User's Request:**
    "${userPrompt}"
  `;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    const recommendations = parseGeminiResponse(text);

    if (recommendations.length === 0) {
      throw new Error("Failed to parse the AI response.");
    }

    res.json({ status: 'success', recommendations });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get recommendations from the AI.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});