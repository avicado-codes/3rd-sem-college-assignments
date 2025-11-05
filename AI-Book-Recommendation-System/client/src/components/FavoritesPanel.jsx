// client/src/components/FavoritesPanel.jsx
import React from 'react';
import './FavoritesPanel.css';

const FavoritesPanel = ({ favorites, onClose, onRemoveFavorite }) => {
  return (
    <div className="favorites-panel-overlay" onClick={onClose}>
      <div className="favorites-panel" onClick={(e) => e.stopPropagation()}>
        <div className="favorites-panel-header">
          <h2>Your Favorite Books</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="favorites-list">
          {favorites.length > 0 ? (
            favorites.map((book, index) => (
              <div key={index} className="favorite-item">
                <div className="favorite-item-info">
                  <h3 className="favorite-title">{book.title}</h3>
                  <p className="favorite-author">by {book.author}</p>
                </div>
                <button 
                  className="remove-favorite-button"
                  onClick={() => onRemoveFavorite(book)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="empty-favorites-message">
              You haven't added any books to your favorites yet. Click the heart icon on a recommendation to save it here!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPanel;