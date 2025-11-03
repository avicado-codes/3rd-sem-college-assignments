document.addEventListener('DOMContentLoaded', () => {
    // --- Global State ---
    const API_URL = 'http://localhost:3000/api/books';
    let allBooks = [];
    let cart = [];
    let lastSuccessfulSale = null;
    let currentlyDisplayedBooks = 0;
    const BOOKS_PER_PAGE = 12;

    // --- DOM Element References ---
    const brandLogoEl = document.getElementById('brand-logo');
    const loadMoreBtnEl = document.getElementById('load-more-btn');
    const views = { inventory: document.getElementById('inventory-view'), billing: document.getElementById('billing-view') };
    const navLinks = document.querySelectorAll('.nav-link[data-view]');
    const bookListEl = document.getElementById('book-list');
    const searchInputEl = document.getElementById('search-input');
    const categoryFilterEl = document.getElementById('category-filter');
    const stockFilterEl = document.getElementById('stock-filter');
    const addBookBtnEl = document.getElementById('add-book-btn');
    const bookModalEl = document.getElementById('book-modal');
    const bookModal = new bootstrap.Modal(bookModalEl);
    const bookFormEl = document.getElementById('book-form');
    const bookModalLabelEl = document.getElementById('bookModalLabel');
    const billingSearchEl = document.getElementById('billing-search');
    const billingSearchResultsEl = document.getElementById('billing-search-results');
    const cartItemsContainerEl = document.getElementById('cart-items');
    const summarySubtotalEl = document.getElementById('summary-subtotal');
    const summaryTaxEl = document.getElementById('summary-tax');
    const summaryTotalEl = document.getElementById('summary-total');
    const processSaleBtnEl = document.getElementById('process-sale-btn');
    const generateReceiptBtnEl = document.getElementById('generate-receipt-btn');
    const clearCartBtnEl = document.getElementById('clear-cart-btn');

    // --- Main App Initialization ---
    async function initializeApp() {
        setupEventListeners();
        await refreshInventoryData();
        showView('billing-view'); // Default to billing view
    }

    async function refreshInventoryData() {
        await fetchBooks();
        if (allBooks.length > 0) {
            populateCategoryFilter();
            applyFiltersAndRender(false); // Initial render
        }
    }

    // --- Core Functions ---

    /**
     * Shows a specific view ('inventory' or 'billing') and hides others.
     * Also updates the 'active' state of the nav links.
     * @param {string} viewId - The ID of the view to show.
     */
    function showView(viewId) {
        Object.values(views).forEach(v => v.classList.add('d-none'));
        document.getElementById(viewId)?.classList.remove('d-none');
        navLinks.forEach(l => l.classList.toggle('active', l.dataset.view === viewId));
    }

    /**
     * Fetches all books from the API and stores them in the 'allBooks' global state.
     * Handles fetch errors and displays a message to the user.
     */
    async function fetchBooks() {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error(`Server Error: ${res.status}`);
            allBooks = await res.json();
        } catch (err) {
            console.error("FETCH FAILED:", err);
            bookListEl.innerHTML = '<div class="col alert alert-danger">Failed to load books. Is the server running?</div>';
            allBooks = [];
        }
    }

    /**
     * Renders a paginated list of books to the DOM.
     * @param {Array} books - The filtered array of books to render from.
     */
    function renderBooks(books) {
        // Clear the list only if it's the first page
        if (currentlyDisplayedBooks === 0) bookListEl.innerHTML = '';

        // Handle no books found
        if (books.length === 0 && currentlyDisplayedBooks === 0) {
            bookListEl.innerHTML = '<div class="col"><p class="text-center text-muted mt-4">No books found.</p></div>';
            loadMoreBtnEl.classList.add('d-none');
            return;
        }

        // Determine the slice of books to render
        const booksToRender = books.slice(currentlyDisplayedBooks, currentlyDisplayedBooks + BOOKS_PER_PAGE);

        // Create and append card for each book
        booksToRender.forEach(book => {
            const stockBadge = book.stock > 10 ? 'bg-success' : (book.stock > 0 ? 'bg-warning' : 'bg-danger');
            const stockText = book.stock > 0 ? `In Stock: ${book.stock}` : 'Out of Stock';
            const card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4 col-xl-3';
            card.innerHTML = `
                <div class="card h-100 book-card" data-id="${book.id}">
                    <img src="${book.coverImage || 'https://via.placeholder.com/150x220.png?text=No+Cover'}" class="card-img-top book-cover" alt="${book.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title" title="${book.title}">${book.title}</h5>
                        <p class="card-text text-muted mb-2">${book.author}</p>
                        <div class="mt-auto pt-2">
                            <p class="card-text fw-bold fs-5 mb-1">$${book.price.toFixed(2)}</p>
                            <p class="card-text"><span class="badge ${stockBadge}">${stockText}</span></p>
                        </div>
                    </div>
                    <div class="card-footer d-flex justify-content-end">
                        <button class="btn btn-sm btn-outline-secondary me-2 edit-btn"><i class="bi bi-pencil-square"></i> Edit</button>
                        <button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash"></i> Delete</button>
                    </div>
                </div>`;
            bookListEl.appendChild(card);
        });

        // Update the count of displayed books
        currentlyDisplayedBooks += booksToRender.length;

        // Show or hide the 'Load More' button
        if (currentlyDisplayedBooks < books.length) {
            loadMoreBtnEl.classList.remove('d-none');
        } else {
            loadMoreBtnEl.classList.add('d-none');
        }
    }

    /**
     * Applies filters from search, category, and stock dropdowns, then calls renderBooks.
     * @param {boolean} isLoadMore - If true, appends books instead of replacing.
     */
    function applyFiltersAndRender(isLoadMore = false) {
        if (!isLoadMore) {
            // Reset counter if it's a new search/filter action
            currentlyDisplayedBooks = 0;
        }

        let filtered = allBooks;
        const searchTerm = searchInputEl.value.toLowerCase().trim();
        const category = categoryFilterEl.value;
        const stock = stockFilterEl.value;

        if (searchTerm) filtered = filtered.filter(b => b.title.toLowerCase().includes(searchTerm) || b.author.toLowerCase().includes(searchTerm));
        if (category) filtered = filtered.filter(b => b.category === category);
        if (stock) {
            if (stock === 'in-stock') filtered = filtered.filter(b => b.stock > 10);
            else if (stock === 'low-stock') filtered = filtered.filter(b => b.stock > 0 && b.stock <= 10);
            else if (stock === 'out-of-stock') filtered = filtered.filter(b => b.stock === 0);
        }

        renderBooks(filtered);
    }

    /**
     * Populates the category filter dropdown with unique categories from allBooks.
     */
    function populateCategoryFilter() {
        const categories = [...new Set(allBooks.map(b => b.category).filter(Boolean))];
        categoryFilterEl.innerHTML = '<option value="">All Categories</option>';
        categories.sort().forEach(c => categoryFilterEl.innerHTML += `<option value="${c}">${c}</option>`);
    }

    /**
     * Renders the current state of the 'cart' array to the billing page.
     */
    function renderCart() {
        if (!cart.length) {
            cartItemsContainerEl.innerHTML = '<p class="text-muted">No items in the cart.</p>';
        } else {
            cartItemsContainerEl.innerHTML = `
                <table class="table align-middle">
                    <thead>
                        <tr>
                            <th>Book</th>
                            <th class="text-center">Qty</th>
                            <th class="text-end">Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cart.map(item => `
                            <tr data-id="${item.id}">
                                <td>
                                    ${item.title}<br>
                                    <small class="text-muted">$${item.price.toFixed(2)} each</small>
                                </td>
                                <td class="text-center">
                                    <input type="number" class="form-control form-control-sm cart-quantity-input" value="${item.quantity}" min="1" max="${item.stock}">
                                </td>
                                <td class="text-end fw-bold">$${(item.price * item.quantity).toFixed(2)}</td>
                                <td class="text-end">
                                    <button class="btn btn-sm btn-outline-danger remove-from-cart-btn"><i class="bi bi-x-lg"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>`;
        }
        updateBillSummary();
    }

    /**
     * Updates the subtotal, tax, and total fields in the billing summary.
     * Also enables/disables cart-related buttons.
     */
    function updateBillSummary() {
        const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
        const tax = subtotal * 0.05; // 5% tax
        const total = subtotal + tax;

        summarySubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        summaryTaxEl.textContent = `$${tax.toFixed(2)}`;
        summaryTotalEl.textContent = `$${total.toFixed(2)}`;

        const hasCartItems = cart.length > 0;
        processSaleBtnEl.disabled = !hasCartItems;
        clearCartBtnEl.disabled = !hasCartItems;
        generateReceiptBtnEl.disabled = lastSuccessfulSale === null;
    }

    /**
     * Adds a book to the cart or increments its quantity if already present.
     * @param {string} bookId - The ID of the book to add.
     */
    function addToCart(bookId) {
        const book = allBooks.find(b => b.id === bookId);
        if (!book || book.stock <= 0) {
            alert('Book is out of stock.');
            return;
        }

        const cartItem = cart.find(i => i.id === bookId);
        if (cartItem) {
            if (cartItem.quantity < book.stock) {
                cartItem.quantity++;
            } else {
                alert('Cannot add more than available stock.');
            }
        } else {
            cart.push({ ...book, quantity: 1 });
        }
        renderCart();
    }

    /**
     * Generates a PDF receipt for a given sale.
     * @param {Array} saleData - The array of cart items from the sale.
     */
    function generateReceipt(saleData) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const subtotal = saleData.reduce((s, i) => s + i.price * i.quantity, 0);
        const tax = subtotal * 0.05;
        const total = subtotal + tax;

        doc.setFontSize(22);
        doc.text("The Story Shelf - Receipt", 10, 20);
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleString()}`, 10, 30);

        let y = 40;
        doc.line(10, y, 200, y); y += 10; // Horizontal line
        doc.text("Item", 10, y);
        doc.text("Qty", 120, y);
        doc.text("Price", 150, y);
        doc.text("Total", 180, y);
        y += 5; doc.line(10, y, 200, y); y += 10;

        saleData.forEach(item => {
            doc.text(item.title.substring(0, 50), 10, y);
            doc.text(item.quantity.toString(), 120, y);
            doc.text(`$${item.price.toFixed(2)}`, 150, y);
            doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 180, y);
            y += 7;
        });

        y += 5; doc.line(10, y, 200, y); y += 10;
        doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, y); y += 7;
        doc.text(`Tax (5%): $${tax.toFixed(2)}`, 150, y); y += 7;
        doc.setFontSize(16);
        doc.text(`Total: $${total.toFixed(2)}`, 150, y);

        doc.save(`receipt-${Date.now()}.pdf`);
    }

    // --- Event Listeners Setup ---
    function setupEventListeners() {
        // Navigation: Logo click
        brandLogoEl.addEventListener('click', e => {
            e.preventDefault();
            showView('billing-view');
        });

        // Navigation: Nav links
        navLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                showView(e.target.dataset.view);
            });
        });

        // Inventory: Load More
        loadMoreBtnEl.addEventListener('click', () => {
            applyFiltersAndRender(true); // Pass true to indicate 'load more'
        });

        // Inventory: Filters
        searchInputEl.addEventListener('input', () => applyFiltersAndRender(false));
        categoryFilterEl.addEventListener('change', () => applyFiltersAndRender(false));
        stockFilterEl.addEventListener('change', () => applyFiltersAndRender(false));

        // Inventory: Add Book Button
        addBookBtnEl.addEventListener('click', () => {
            bookFormEl.reset();
            bookFormEl.querySelector('#book-id').value = ''; // Clear hidden ID
            bookModalLabelEl.textContent = 'Add New Book';
            bookModal.show();
        });

        // Inventory: Edit/Delete buttons on book cards
        bookListEl.addEventListener('click', e => {
            const card = e.target.closest('.book-card');
            if (!card) return;
            const bookId = card.dataset.id;
            const book = allBooks.find(b => b.id === bookId);
            if (!book) return;

            // Handle Edit
            if (e.target.closest('.edit-btn')) {
                bookFormEl.reset();
                bookModalLabelEl.textContent = 'Edit Book';
                // Populate form with book data
                Object.keys(book).forEach(key => {
                    const input = bookFormEl.querySelector(`#${key}`);
                    if (input) input.value = book[key];
                });
                bookFormEl.querySelector('#book-id').value = book.id; // Set hidden ID
                bookModal.show();
            }

            // Handle Delete
            if (e.target.closest('.delete-btn')) {
                if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
                    fetch(`${API_URL}/${bookId}`, { method: 'DELETE' })
                        .then(res => {
                            if (res.ok) {
                                refreshInventoryData(); // Refresh list after delete
                            } else {
                                alert('Delete failed. Please try again.');
                            }
                        });
                }
            }
        });

        // Inventory: Book Modal Form (Add/Edit)
        bookFormEl.addEventListener('submit', e => {
            e.preventDefault();
            const id = bookFormEl.querySelector('#book-id').value;
            // Create data object from form
            const bookData = {
                id: id || bookFormEl.querySelector('#isbn').value, // Use ISBN as ID if new
                title: bookFormEl.querySelector('#title').value,
                author: bookFormEl.querySelector('#author').value,
                isbn: bookFormEl.querySelector('#isbn').value,
                price: parseFloat(bookFormEl.querySelector('#price').value),
                stock: parseInt(bookFormEl.querySelector('#stock').value, 10),
                category: bookFormEl.querySelector('#category').value,
                coverImage: bookFormEl.querySelector('#coverImage').value,
                description: bookFormEl.querySelector('#description').value,
            };

            const method = id ? 'PUT' : 'POST';
            const url = id ? `${API_URL}/${id}` : API_URL;

            fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            })
            .then(res => {
                if (!res.ok) throw new Error('Save operation failed');
                bookModal.hide();
                refreshInventoryData(); // Refresh list after add/edit
            })
            .catch(err => alert(err.message));
        });

        // Billing: Search
        billingSearchEl.addEventListener('input', () => {
            const searchTerm = billingSearchEl.value.toLowerCase().trim();
            if (searchTerm.length < 2) {
                billingSearchResultsEl.innerHTML = '';
                return;
            }
            // Filter only in-stock books
            const results = allBooks.filter(b => b.stock > 0 &&
                (b.title.toLowerCase().includes(searchTerm) || b.author.toLowerCase().includes(searchTerm))
            );
            // Show top 5 results
            billingSearchResultsEl.innerHTML = results.slice(0, 5).map(b =>
                `<a href="#" class="list-group-item list-group-item-action" data-id="${b.id}">${b.title} (${b.author})</a>`
            ).join('');
        });

        // Billing: Add from search results
        billingSearchResultsEl.addEventListener('click', e => {
            e.preventDefault();
            const target = e.target.closest('a');
            if (target && target.dataset.id) {
                addToCart(target.dataset.id);
                billingSearchEl.value = ''; // Clear search bar
                billingSearchResultsEl.innerHTML = ''; // Clear results
            }
        });

        // Billing: Cart quantity change
        cartItemsContainerEl.addEventListener('change', e => {
            if (e.target.classList.contains('cart-quantity-input')) {
                const bookId = e.target.closest('tr').dataset.id;
                const newQuantity = parseInt(e.target.value, 10);
                const cartItem = cart.find(i => i.id === bookId);
                
                if (newQuantity > 0 && newQuantity <= cartItem.stock) {
                    cartItem.quantity = newQuantity;
                    renderCart();
                } else {
                    // Revert to old value if invalid
                    e.target.value = cartItem.quantity;
                    alert(`Quantity must be between 1 and ${cartItem.stock}.`);
                }
            }
        });

        // Billing: Remove from cart
        cartItemsContainerEl.addEventListener('click', e => {
            if (e.target.closest('.remove-from-cart-btn')) {
                const bookId = e.target.closest('tr').dataset.id;
                cart = cart.filter(item => item.id !== bookId);
                renderCart();
            }
        });

        // Billing: Clear Cart
        clearCartBtnEl.addEventListener('click', () => {
            if (cart.length > 0 && confirm('Are you sure you want to clear the entire cart?')) {
                cart = [];
                lastSuccessfulSale = null;
                renderCart();
            }
        });

        // Billing: Generate Receipt
        generateReceiptBtnEl.addEventListener('click', () => {
            if (lastSuccessfulSale) {
                generateReceipt(lastSuccessfulSale);
            } else {
                alert('No recent sale to generate a receipt for.');
            }
        });

        // Billing: Process Sale
        processSaleBtnEl.addEventListener('click', async () => {
            processSaleBtnEl.disabled = true;
            processSaleBtnEl.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Processing...`;

            try {
                // Create an array of fetch promises to update stock for each item
                const updatePromises = cart.map(item => {
                    const newStock = item.stock - item.quantity;
                    return fetch(`${API_URL}/${item.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ stock: newStock }) // Only update stock
                    });
                });

                const responses = await Promise.all(updatePromises);
                
                // Check if any update failed
                if (responses.some(res => !res.ok)) {
                    throw new Error('One or more stock updates failed.');
                }

                alert('Sale successful!');
                lastSuccessfulSale = JSON.parse(JSON.stringify(cart)); // Save a deep copy of the cart
                cart = [];
                renderCart();
                await refreshInventoryData(); // Refresh all book data

            } catch (err) {
                alert(`Sale processing failed: ${err.message}`);
                lastSuccessfulSale = null; // Clear last sale if it failed
            } finally {
                processSaleBtnEl.disabled = false;
                processSaleBtnEl.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Process Sale';
                updateBillSummary(); // Update button states
            }
        });
    }

    // --- Start the Application ---
    initializeApp();
});