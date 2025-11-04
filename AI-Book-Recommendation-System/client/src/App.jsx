// client/src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import BookCard from './components/BookCard';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  // State for theme management
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      type: 'text',
      content: 'Hello! Tell me about a book you enjoyed, and I can suggest what to read next.'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);

  // Effect to save theme to localStorage and apply class to body
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = `${theme}-theme`;
  }, [theme]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newUserMessage = {
      sender: 'user',
      type: 'text',
      content: userInput,
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const newAiMessage = {
        sender: 'ai',
        type: 'books',
        content: data.recommendations,
      };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);
    } catch (error) {
      console.error('Fetch error:', error);
      const errorMessage = {
        sender: 'ai',
        type: 'text',
        content: 'Sorry, I had trouble getting recommendations. Please try again later.',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chat-container ${theme}-theme`}>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}-message`}>
            {msg.type === 'text' && <p>{msg.content}</p>}
            {msg.type === 'books' && (
              <div>
                <p>Of course! Based on that, you might enjoy these:</p>
                {msg.content.map((book, bookIndex) => (
                  <BookCard key={bookIndex} book={book} />
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="message ai-message">
            <LoadingSpinner />
          </div>
        )}
      </div>

      <form className="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Tell me a book you liked..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}

export default App;