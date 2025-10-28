document.addEventListener('DOMContentLoaded', () => {
    
    // --- Global Variables and Constants ---
    const API_URL = 'http://localhost:3000/api/books';
    let allBooks = []; // This will store the master list of books

    // --- DOM Element References ---
    const bookList = document.getElementById('book-list');
    const addBookBtn = document.getElementById('add-book-btn');
    const bookModalEl = document.getElementById('book-modal');
    const bookModal = new bootstrap.Modal(bookModalEl);
    const bookForm = document.getElementById('book-form');
    const bookModalLabel = document.getElementById('bookModalLabel');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const stockFilter = document.getElementById('stock-filter');

    // --- Core Functions ---

    /**
     * Fetches all books from the API, stores them, and displays them.
     */
    const fetchAndDisplayBooks = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allBooks = await response.json();
            populateCategoryFilter();
            applyFiltersAndRender();
        } catch (error) {
            console.error('Error fetching books:', error);
            bookList.innerHTML = `<div class="alert alert-danger">Failed to load books. Please ensure the server is running.</div>`;
        }
    };

    /**
     * Renders an array of book objects to the DOM.
     * @param {Array<Object>} books - The array of books to display.
     */
    const renderBooks = (books) => {
        bookList.innerHTML = '';
        if (books.length === 0) {
            bookList.innerHTML = '<div class="col"><div class="alert alert-info">No books match the current criteria.</div></div>';
            return;
        }
        books.forEach(book => {
            const stockBadgeColor = book.stock > 10 ? 'bg-success' : (book.stock > 0 ? 'bg-warning' : 'bg-danger');
            const stockStatus = book.stock > 0 ? `In Stock: ${book.stock}` : 'Out of Stock';

            const bookCard = document.createElement('div');
            bookCard.className = 'col-md-6 col-lg-4 col-xl-3';
            bookCard.innerHTML = `
                <div class="card h-100 book-card" data-id="${book.id}">
                    <img src="${book.coverImage || 'https://via.placeholder.com/150x220.png?text=No+Cover'}" class="card-img-top book-cover" alt="Cover of ${book.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title" title="${book.title}">${book.title}</h5>
                        <p class="card-text text-muted mb-2">${book.author}</p>
                        <div class="mt-auto">
                            <p class="card-text fw-bold fs-5 mb-1">$${parseFloat(book.price).toFixed(2)}</p>
                            <p class="card-text"><span class="badge ${stockBadgeColor}">${stockStatus}</span></p>
                        </div>
                    </div>
                    <div class="card-footer d-flex justify-content-end">
                        <button class="btn btn-sm btn-outline-secondary me-2 edit-btn" data-id="${book.id}"><i class="bi bi-pencil-square"></i> Edit</button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${book.id}"><i class="bi bi-trash"></i> Delete</button>
                    </div>
                </div>
            `;
            bookList.appendChild(bookCard);
        });
    };

    /**
     * Applies current search and filter values to the master book list and re-renders the UI.
     */
    const applyFiltersAndRender = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;
        const selectedStock = stockFilter.value;

        let filteredBooks = allBooks;

        // Apply search term filter
        if (searchTerm) {
            filteredBooks = filteredBooks.filter(book => 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.isbn.includes(searchTerm)
            );
        }

        // Apply category filter
        if (selectedCategory) {
            filteredBooks = filteredBooks.filter(book => book.category === selectedCategory);
        }

        // Apply stock filter
        if (selectedStock) {
            filteredBooks = filteredBooks.filter(book => {
                if (selectedStock === 'in-stock') return book.stock > 10;
                if (selectedStock === 'low-stock') return book.stock > 0 && book.stock <= 10;
                if (selectedStock === 'out-of-stock') return book.stock === 0;
                return true;
            });
        }
        
        renderBooks(filteredBooks);
    };

    /**
     * Populates the category filter dropdown with unique categories from the book list.
     */
    const populateCategoryFilter = () => {
        const categories = [...new Set(allBooks.map(book => book.category).filter(Boolean))];
        categoryFilter.innerHTML = '<option value="">All Categories</option>'; // Reset
        categories.sort().forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    };

    /**
     * Handles the submission of the book form for both creating and updating.
     */
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const bookId = document.getElementById('book-id').value;
        const bookData = {
            title: document.getElementById('title').value, author: document.getElementById('author').value,
            isbn: document.getElementById('isbn').value, price: parseFloat(document.getElementById('price').value),
            stock: parseInt(document.getElementById('stock').value, 10), category: document.getElementById('category').value,
            coverImage: document.getElementById('coverImage').value, description: document.getElementById('description').value,
        };
        if (!bookId) bookData.id = bookData.isbn;

        const method = bookId ? 'PUT' : 'POST';
        const url = bookId ? `${API_URL}/${bookId}` : API_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            bookModal.hide();
            await fetchAndDisplayBooks(); // Full refetch to get updated data and categories
        } catch (error) {
            console.error('Error saving book:', error);
            alert('Failed to save book. Check console for details.');
        }
    };
    
    /**
     * Opens the modal to edit a book, populating it with existing data.
     */
    const openEditModal = async (id) => {
        try {
            // Find book from local array first for speed, fallback to API
            let book = allBooks.find(b => b.id === id);
            if (!book) {
                 const response = await fetch(`${API_URL}/${id}`);
                 if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                 book = await response.json();
            }
            
            bookModalLabel.textContent = 'Edit Book';
            document.getElementById('book-id').value = book.id;
            document.getElementById('title').value = book.title; document.getElementById('author').value = book.author;
            document.getElementById('isbn').value = book.isbn; document.getElementById('price').value = book.price;
            document.getElementById('stock').value = book.stock; document.getElementById('category').value = book.category || '';
            document.getElementById('coverImage').value = book.coverImage || ''; document.getElementById('description').value = book.description || '';
            
            bookModal.show();
        } catch (error) {
            console.error('Error fetching book details:', error);
            alert('Failed to fetch book details.');
        }
    };

    /**
     * Deletes a book after user confirmation.
     */
    const deleteBook = async (id) => {
        if (!confirm('Are you sure you want to delete this book?')) return;
        
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            await fetchAndDisplayBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Failed to delete book.');
        }
    };

    // --- Event Listeners ---

    addBookBtn.addEventListener('click', () => {
        bookModalLabel.textContent = 'Add New Book';
        bookForm.reset();
        document.getElementById('book-id').value = '';
        bookModal.show();
    });

    bookList.addEventListener('click', (event) => {
        const editBtn = event.target.closest('.edit-btn');
        const deleteBtn = event.target.closest('.delete-btn');
        if (editBtn) openEditModal(editBtn.dataset.id);
        else if (deleteBtn) deleteBook(deleteBtn.dataset.id);
    });

    bookForm.addEventListener('submit', handleFormSubmit);

    // Listen for input on search and filter elements
    searchInput.addEventListener('input', applyFiltersAndRender);
    categoryFilter.addEventListener('change', applyFiltersAndRender);
    stockFilter.addEventListener('change', applyFiltersAndRender);

    // --- Initial Load ---
    fetchAndDisplayBooks();
});