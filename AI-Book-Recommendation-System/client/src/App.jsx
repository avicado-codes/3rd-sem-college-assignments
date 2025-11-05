// client/src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import BookCard from './components/BookCard';
import LoadingSpinner from './components/LoadingSpinner';
import TypingIndicator from './components/TypingIndicator';
import ExamplePrompts from './components/ExamplePrompts';
import ClipboardIcon from './components/ClipboardIcon'; // Import the new icon
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
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null); // New state for copy confirmation
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({
        top: chatWindowRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading, isAiTyping]);

  const submitPrompt = async (promptText) => {
    // ... (This function remains unchanged from the previous step)
    if (!promptText.trim() || isLoading || isAiTyping) return;

    const newUserMessage = {
      sender: 'user',
      type: 'text',
      content: promptText,
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      const newAiMessage = {
        sender: 'ai',
        type: 'books',
        content: data.recommendations,
      };

      setIsLoading(false);
      setIsAiTyping(true);

      setTimeout(() => {
        setIsAiTyping(false);
        setMessages((prevMessages) => [...prevMessages, newAiMessage]);
      }, 1500);

    } catch (error) {
      console.error('Fetch error:', error);
      const errorMessage = {
        sender: 'ai',
        type: 'text',
        content: 'I seem to be having trouble accessing my library at the moment. Please try again in a little while.',
      };
      setIsLoading(false);
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    submitPrompt(userInput);
  };

  const handlePromptClick = (promptText) => {
    submitPrompt(promptText);
  };

  // *** NEW FUNCTIONALITY STARTS HERE ***
  const handleCopy = async (books, index) => {
    const textToCopy = books.map(book => 
      `Title: ${book.title}\nAuthor: ${book.author}\nReasoning: ${book.reasoning}`
    ).join('\n\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Hide confirmation after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  // *** NEW FUNCTIONALITY ENDS HERE ***

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
                
                {/* NEW: Render the copy button or confirmation message */}
                {copiedIndex === index ? (
                  <div className="copy-confirmation">Copied!</div>
                ) : (
                  <button className="copy-button" onClick={() => handleCopy(msg.content, index)}>
                    <ClipboardIcon />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {messages.length === 1 && <ExamplePrompts onPromptClick={handlePromptClick} />}
        {isLoading && <div className="message ai-message"><LoadingSpinner /></div>}
        {isAiTyping && <div className="message ai-message"><TypingIndicator /></div>}
      </div>

      <div className="input-area">
        {/* ... (The input form remains unchanged) */}
        <form className="input-form" onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="e.g., 'I loved Dune and want another sci-fi epic...'"
            disabled={isLoading || isAiTyping}
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