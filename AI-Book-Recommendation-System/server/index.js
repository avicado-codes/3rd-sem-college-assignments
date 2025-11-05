// server/index.js (Local Engine Version)
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

const booksDB = JSON.parse(fs.readFileSync(path.join(__dirname, 'books.json')));

app.use(cors());
app.use(express.json());

app.post('/api/recommendations', (req, res) => {
  const userPrompt = req.body.prompt.toLowerCase();
  if (!userPrompt) {
    return res.status(400).json({ status: 'error', message: 'Prompt is required.' });
  }

  const matchingBooks = booksDB.filter(book => 
    book.keywords.some(keyword => userPrompt.includes(keyword))
  );

  const shuffled = matchingBooks.sort(() => 0.5 - Math.random());
  let recommendations = shuffled.slice(0, 3);
  
  if (recommendations.length < 3) {
    const randomFiller = booksDB
        .filter(book => !recommendations.find(rec => rec.title === book.title)) // Don't add duplicates
        .sort(() => 0.5 - Math.random())
        .slice(0, 3 - recommendations.length);
    recommendations.push(...randomFiller);
  }

  res.json({ status: 'success', recommendations });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});