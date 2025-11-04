// src/components/BookCard.jsx
import React from 'react';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <h3><strong>Title:</strong> {book.title}</h3>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Reasoning:</strong> {book.reasoning}</p>
      <p className="for-you"><strong>For you because:</strong> {book.foryoubecause}</p>
    </div>
  );
};

export default BookCard;