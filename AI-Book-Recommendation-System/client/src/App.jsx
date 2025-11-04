// src/App.jsx
import React from 'react';
import BookCard from './components/BookCard';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Mock data to display our components statically
const mockBook = {
  title: 'Project Hail Mary',
  author: 'Andy Weir',
  reasoning: 'A lone astronaut must save the Earth from disaster in this gripping sci-fi adventure. It is filled with clever problem-solving, humor, and a heartwarming story of friendship.',
  foryoubecause: 'It perfectly matches your love for clever, science-based problem-solving.',
};

function App() {
  return (
    <div className="chat-container">
      <div className="chat-window">
        {/* Example User Message */}
        <div className="message user-message">
          I liked Project Hail Mary, what's next?
        </div>

        {/* Example AI Response */}
        <div className="message ai-message">
          <p>Of course! Based on that, you might enjoy these:</p>
          <BookCard book={mockBook} />
          <BookCard book={mockBook} />
        </div>
        
        {/* Example Loading State */}
        <div className="message ai-message">
          <LoadingSpinner />
        </div>
      </div>
      
      <form className="input-form">
        <input
          type="text"
          placeholder="Tell me a book you liked..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;