// client/src/App.jsx (Definitive Corrected Version)
import React, { useState, useEffect, useRef } from 'react';
import BookCard from './components/BookCard';
import LoadingSpinner from './components/LoadingSpinner';
import TypingIndicator from './components/TypingIndicator';
import ExamplePrompts from './components/ExamplePrompts';
import ClipboardIcon from './components/ClipboardIcon';
import StarIcon from './components/StarIcon';
import FavoritesPanel from './components/FavoritesPanel';
import BookIcon from './components/BookIcon';
import './App.css';

const FAVORITES_STORAGE_KEY = 'bookwise_favorites';

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
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isFavoritesPanelOpen, setIsFavoritesPanelOpen] = useState(false);
  const chatWindowRef = useRef(null);

  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error(error);
    }
  }, [favorites]);

  const toggleFavorite = (bookToToggle) => {
    setFavorites((prev) => {
      const isFav = prev.some((fav) => fav.title === bookToToggle.title);
      if (isFav) {
        return prev.filter((fav) => fav.title !== bookToToggle.title);
      } else {
        return [...prev, bookToToggle];
      }
    });
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({ top: chatWindowRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading, isAiTyping]);

  const submitPrompt = async (promptText) => {
    if (!promptText.trim() || isLoading || isAiTyping) return;
    const newUserMessage = { sender: 'user', type: 'text', content: promptText };
    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });
      if (!response.ok) throw new Error('Network response not ok');
      const data = await response.json();
      const newAiMessage = { sender: 'ai', type: 'books', content: data.recommendations };
      setIsLoading(false);
      setIsAiTyping(true);
      setTimeout(() => {
        setIsAiTyping(false);
        setMessages((prev) => [...prev, newAiMessage]);
      }, 1500);
    } catch (error) {
      console.error('Fetch error:', error);
      const errorMessage = { sender: 'ai', type: 'text', content: 'I seem to be having trouble... Please try again.' };
      setIsLoading(false);
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleFormSubmit = (e) => { e.preventDefault(); submitPrompt(userInput); };
  const handlePromptClick = (promptText) => { submitPrompt(promptText); };
  const handleCopy = async (books, index) => {
    const text = books.map(b => `Title: ${b.title}\nAuthor: ${b.author}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="chat-container">
        <div className="app-header">
          <div className="header-content">
            <BookIcon />
            <h1>Bookwise</h1>
          </div>
          <button className="view-favorites-button" onClick={() => setIsFavoritesPanelOpen(true)} aria-label="View favorite books">
            <StarIcon />
            {favorites.length > 0 && <span className="favorites-count">{favorites.length}</span>}
          </button>
        </div>
        <div className="chat-window" ref={chatWindowRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}-message`}>
              {msg.type === 'text' && <p>{msg.content}</p>}
              {msg.type === 'books' && (
                <div>
                  <p>Of course! Based on your interest, you might enjoy these:</p>
                  {msg.content.map((book, bookIndex) => {
                    const isFavorited = favorites.some(fav => fav.title === book.title);
                    return <BookCard key={bookIndex} book={book} isFavorited={isFavorited} onToggleFavorite={toggleFavorite} />;
                  })}
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
          <form className="input-form" onSubmit={handleFormSubmit}>
            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="e.g., 'I loved Dune and want another sci-fi epic...'" disabled={isLoading || isAiTyping} />
            <button type="submit" disabled={isLoading || isAiTyping}>Send</button>
          </form>
        </div>
      </div>
      {isFavoritesPanelOpen && <FavoritesPanel favorites={favorites} onClose={() => setIsFavoritesPanelOpen(false)} onRemoveFavorite={toggleFavorite} />}
    </>
  );
}

export default App;