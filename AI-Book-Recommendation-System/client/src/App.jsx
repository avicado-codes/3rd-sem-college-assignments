// client/src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import BookCard from './components/BookCard';
import LoadingSpinner from './components/LoadingSpinner';
import TypingIndicator from './components/TypingIndicator'; // Import the new component
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
  const [isAiTyping, setIsAiTyping] = useState(false); // New state for typing indicator
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({
        top: chatWindowRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading, isAiTyping]); // Add isAiTyping to dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || isAiTyping) return;

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      const newAiMessage = {
        sender: 'ai',
        type: 'books',
        content: data.recommendations,
      };

      // *** NEW LOGIC STARTS HERE ***
      setIsLoading(false); // Stop the main loading spinner
      setIsAiTyping(true); // Start the typing indicator

      // Simulate a "typing" delay for a more natural feel
      setTimeout(() => {
        setIsAiTyping(false); // Stop typing
        setMessages((prevMessages) => [...prevMessages, newAiMessage]); // Show the message
      }, 1500); // 1.5 second delay

    } catch (error) {
      console.error('Fetch error:', error);
      const errorMessage = {
        sender: 'ai',
        type: 'text',
        content: 'I seem to be having trouble accessing my library at the moment. Please try again in a little while.',
      };
      setIsLoading(false); // Ensure loading stops on error
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
    // Note: We remove the finally block as we handle setIsLoading inside try/catch now
  };

  return (
    <div className="chat-container">
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          // ... (The message mapping logic remains exactly the same)
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
        {/* NEW: Render the typing indicator when the AI is "typing" */}
        {isAiTyping && (
          <div className="message ai-message">
            <TypingIndicator />
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
            disabled={isLoading || isAiTyping} // Also disable input while AI is typing
          />
          <button type="submit" disabled={isLoading || isAiTyping}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;