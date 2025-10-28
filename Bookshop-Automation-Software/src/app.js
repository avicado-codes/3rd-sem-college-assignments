// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    const API_URL = 'http://localhost:3000/api/books';
    const bookList = document.getElementById('book-list');

    /**
     * Fetches all books from the API and displays them on the page.
     */
    const fetchAndDisplayBooks = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const books = await response.json();
            renderBooks(books);
        } catch (error) {
            console.error('Error fetching books:', error);
            bookList.innerHTML = `<p class="text-danger">Failed to load books. Is the server running?</p>`;
        }
    };

    /**
     * Renders an array of book objects to the DOM.
     * @param {Array<Object>} books - The array of books to display.
     */
    const renderBooks = (books) => {
        // Clear the current list
        bookList.innerHTML = '';

        if (books.length === 0) {
            bookList.innerHTML = '<p>No books found in the inventory.</p>';
            return;
        }

        // Create and append a card for each book
        books.forEach(book => {
            const stockBadgeColor = book.stock > 10 ? 'bg-success' : (book.stock > 0 ? 'bg-warning' : 'bg-danger');
            const stockStatus = book.stock > 0 ? `In Stock: ${book.stock}` : 'Out of Stock';

            const bookCard = document.createElement('div');
            bookCard.className = 'col-md-6 col-lg-4 col-xl-3';
            bookCard.innerHTML = `
                <div class="card h-100 book-card" data-id="${book.id}">
                    <img src="${book.coverImage}" class="card-img-top book-cover" alt="Cover of ${book.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title" title="${book.title}">${book.title}</h5>
                        <p class="card-text text-muted mb-2">${book.author}</p>
                        <div class="mt-auto">
                            <p class="card-text fw-bold fs-5 mb-1">$${parseFloat(book.price).toFixed(2)}</p>
                            <p class="card-text"><span class="badge ${stockBadgeColor}">${stockStatus}</span></p>
                        </div>
                    </div>
                    <div class="card-footer d-flex justify-content-end">
                        <button class="btn btn-sm btn-outline-secondary me-2 edit-btn">
                            <i class="bi bi-pencil-square"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
            bookList.appendChild(bookCard);
        });
    };

    // Initial load of books when the page is ready
    fetchAndDisplayBooks();
});