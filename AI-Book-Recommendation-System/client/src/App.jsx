// client/src/App.jsx (Corrected Version)
import React, { useState, useEffect, useRef } from 'react';
import BookCard from './components/BookCard';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      type: 'text',
      content: 'Hello! I am Bookwise, your personal AI librarian. Tell me about a book or genre you love, and I will find your next great read.'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);

  // Effect to automatically scroll to the newest message
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({
        top: chatWindowRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

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
      // The fetch logic remains the same, connecting to our local server
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
    } catch (error) { // THIS LINE IS NOW FIXED
      console.error('Fetch error:', error);
      const errorMessage = {
        sender: 'ai',
        type: 'text',
        content: 'I seem to be having trouble accessing my library at the moment. Please try again in a little while.',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}-message`}>
            {msg.type === 'text' && <p>{msg.content}</p>}
            {msg.type === 'books' && (
              <div>
                <p>Of course! Based on your interest, you might enjoy these:</p>
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

      <div className="input-area">
        <form className="input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="e.g., 'I loved Dune and want another sci-fi epic...'"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;