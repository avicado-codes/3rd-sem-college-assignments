// client/src/components/BookCard.jsx
import React from 'react';
import HeartIcon from './HeartIcon';

// The component now accepts props to handle favorite state and actions
const BookCard = ({ book, onToggleFavorite, isFavorited }) => {
  return (
    <div className="book-card">
      <div className="book-card-header">
        <h3><strong>Title:</strong> {book.title}</h3>
        <button 
          className="favorite-button"
          onClick={() => onToggleFavorite(book)}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon isFavorited={isFavorited} />
        </button>
      </div>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Reasoning:</strong> {book.reasoning}</p>
      <p className="for-you"><strong>For you because:</strong> {book.foryoubecause}</p>
    </div>
  );
};

export default BookCard;