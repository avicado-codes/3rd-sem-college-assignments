// server/index.js
const express = require('express');
const app = express();
const port = 3001; // Using a port other than 3000 to avoid conflict with React dev server

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});