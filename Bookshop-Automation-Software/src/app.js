document.addEventListener("DOMContentLoaded", () => {
  // --- Global State ---
  const API_URL = "http://localhost:3000/api";
  let allBooks = [],
    allSales = [],
    cart = [],
    lastSuccessfulSale = null,
    currentlyDisplayedBooks = 0;
  const BOOKS_PER_PAGE = 12;
  let salesChart = null,
    topBooksChart = null;

  // --- DOM Element References ---
  const bodyEl = document.body;
  const views = {
    inventory: document.getElementById("inventory-view"),
    billing: document.getElementById("billing-view"),
    reports: document.getElementById("reports-view"),
  };
  const brandLogoEl = document.getElementById("brand-logo");
  const loadMoreBtnEl = document.getElementById("load-more-btn");
  const bookDetailsModalEl = document.getElementById("book-details-modal");
  const bookDetailsModal = new bootstrap.Modal(bookDetailsModalEl);
  const navLinks = document.querySelectorAll(".nav-link[data-view]");
  const bookListEl = document.getElementById("book-list");
  const searchInputEl = document.getElementById("search-input");
  const categoryFilterEl = document.getElementById("category-filter");
  const stockFilterEl = document.getElementById("stock-filter");
  const addBookBtnEl = document.getElementById("add-book-btn");
  const bookModalEl = document.getElementById("book-modal");
  const bookModal = new bootstrap.Modal(bookModalEl);
  const bookFormEl = document.getElementById("book-form");
  const bookModalLabelEl = document.getElementById("bookModalLabel");
  const billingSearchEl = document.getElementById("billing-search");
  const billingSearchResultsEl = document.getElementById(
    "billing-search-results"
  );
  const cartItemsContainerEl = document.getElementById("cart-items");
  const summarySubtotalEl = document.getElementById("summary-subtotal");
  const summaryTaxEl = document.getElementById("summary-tax");
  const summaryTotalEl = document.getElementById("summary-total");
  const processSaleBtnEl = document.getElementById("process-sale-btn");
  const generateReceiptBtnEl = document.getElementById("generate-receipt-btn");
  const clearCartBtnEl = document.getElementById("clear-cart-btn");

  // --- Main App Flow ---
  async function initializeApp() {
    setupEventListeners();
    checkAdminMode();
    await Promise.all([refreshInventoryData(), fetchSales()]);
    showView("inventory-view");
  }

  async function refreshInventoryData() {
    await fetchBooks();
    if (allBooks.length > 0) {
      populateCategoryFilter();
      applyFiltersAndRender(false);
    }
  }

  async function fetchSales() {
    try {
      const res = await fetch(`${API_URL}/sales`);
      if (!res.ok) throw new Error("Failed to fetch sales");
      allSales = await res.json();
    } catch (err) {
      console.error("FETCH SALES FAILED:", err);
      allSales = [];
    }
  }

  // --- UI & View Management ---
  function checkAdminMode() {
    bodyEl.classList.toggle("admin-mode", window.location.hash === "#admin");
  }

  function showView(viewId) {
    Object.values(views).forEach((v) => v.classList.add("d-none"));
    const viewToShow = document.getElementById(viewId);
    if (viewToShow) viewToShow.classList.remove("d-none");
    navLinks.forEach((l) =>
      l.classList.toggle("active", l.dataset.view === viewId)
    );
    if (viewId === "reports-view") {
      renderReports();
    }
  }

  function showBookDetails(book) {
    bookDetailsModalEl.querySelector("#details-cover-image").src =
      book.coverImage ||
      "https://via.placeholder.com/300x450.png?text=No+Cover";
    bookDetailsModalEl.querySelector("#details-title").textContent = book.title;
    bookDetailsModalEl.querySelector(
      "#details-author"
    ).textContent = `by ${book.author}`;
    bookDetailsModalEl.querySelector("#details-description").textContent =
      book.description;
    bookDetailsModalEl.querySelector("#details-publisher").textContent =
      book.publisher;
    bookDetailsModalEl.querySelector("#details-category").textContent =
      book.category;
    bookDetailsModalEl.querySelector(
      "#details-price"
    ).textContent = `$${book.price.toFixed(2)}`;
    bookDetailsModal.show();
  }

  // --- Analytics Rendering ---
  function renderReports() {
    const totalRevenue = allSales.reduce(
      (sum, sale) => sum + sale.totalAmount,
      0
    );
    const totalBooksSold = allSales.reduce(
      (sum, sale) =>
        sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    );
    document.getElementById(
      "report-total-revenue"
    ).textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById("report-books-sold").textContent = totalBooksSold;
    document.getElementById("report-total-sales").textContent = allSales.length;

    const salesByDate = allSales.reduce((acc, sale) => {
      const date = new Date(sale.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + sale.totalAmount;
      return acc;
    }, {});
    const topBookSales = allSales
      .flatMap((sale) => sale.items)
      .reduce((acc, item) => {
        acc[item.title] = (acc[item.title] || 0) + item.quantity;
        return acc;
      }, {});
    const sortedBooks = Object.entries(topBookSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    if (salesChart) salesChart.destroy();
    salesChart = new Chart(document.getElementById("sales-over-time-chart"), {
      type: "line",
      data: {
        labels: Object.keys(salesByDate),
        datasets: [
          {
            label: "Daily Revenue",
            data: Object.values(salesByDate),
            tension: 0.1,
            borderColor: "rgb(75, 192, 192)",
          },
        ],
      },
    });

    if (topBooksChart) topBooksChart.destroy();
    topBooksChart = new Chart(document.getElementById("top-selling-chart"), {
      type: "bar",
      data: {
        labels: sortedBooks.map(([title]) => title),
        datasets: [
          {
            label: "Units Sold",
            data: sortedBooks.map(([, qty]) => qty),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
        ],
      },
      options: { indexAxis: "y", plugins: { legend: { display: false } } },
    });
  }

  // --- Core Data & UI Functions ---
  async function fetchBooks() {
    try {
      const res = await fetch(`${API_URL}/books`);
      if (!res.ok) throw new Error(`Server Error: ${res.status}`);
      allBooks = await res.json();
    } catch (err) {
      console.error("FETCH FAILED:", err);
      bookListEl.innerHTML = `<div class="col alert alert-danger">Failed to load books. Is the server running?</div>`;
      allBooks = [];
    }
  }
  function renderBooks(books) {
    if (currentlyDisplayedBooks === 0) bookListEl.innerHTML = "";
    if (books.length === 0 && currentlyDisplayedBooks === 0) {
      bookListEl.innerHTML =
        '<div class="col"><p class="text-center text-muted mt-4">No books found.</p></div>';
      loadMoreBtnEl.classList.add("d-none");
      return;
    }
    const booksToRender = books.slice(
      currentlyDisplayedBooks,
      currentlyDisplayedBooks + BOOKS_PER_PAGE
    );
    booksToRender.forEach((book) => {
      const stockBadgeColor =
        book.stock > 10
          ? "bg-success"
          : book.stock > 0
          ? "bg-warning"
          : "bg-danger";
      const stockStatus =
        book.stock > 0 ? `In Stock: ${book.stock}` : "Out of Stock";
      const card = document.createElement("div");
      card.className = "col-md-6 col-lg-4 col-xl-3";
      card.innerHTML = `<div class="card h-100 book-card" data-id="${
        book.id
      }"><img src="${
        book.coverImage ||
        "https://via.placeholder.com/150x220.png?text=No+Cover"
      }" class="card-img-top book-cover" alt="${
        book.title
      }"><div class="card-body d-flex flex-column"><h5 class="card-title" title="${
        book.title
      }">${book.title}</h5><p class="card-text text-muted mb-2">${
        book.author
      }</p><div class="mt-auto pt-2"><p class="card-text fw-bold fs-5 mb-1">$${book.price.toFixed(
        2
      )}</p><p class="card-text"><span class="badge ${stockBadgeColor}">${stockStatus}</span></p></div></div><div class="card-footer admin-only d-flex justify-content-end"><button class="btn btn-sm btn-outline-secondary me-2 edit-btn"><i class="bi bi-pencil-square"></i> Edit</button><button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash"></i> Delete</button></div></div>`;
      bookListEl.appendChild(card);
    });
    currentlyDisplayedBooks += booksToRender.length;
    if (currentlyDisplayedBooks < books.length) {
      loadMoreBtnEl.classList.remove("d-none");
    } else {
      loadMoreBtnEl.classList.add("d-none");
    }
  }
  function applyFiltersAndRender(isLoadMore = false) {
    if (!isLoadMore) currentlyDisplayedBooks = 0;
    let f = allBooks;
    const s = searchInputEl.value.toLowerCase().trim();
    const c = categoryFilterEl.value;
    const t = stockFilterEl.value;
    if (s)
      f = f.filter(
        (b) =>
          b.title.toLowerCase().includes(s) ||
          b.author.toLowerCase().includes(s)
      );
    if (c) f = f.filter((b) => b.category === c);
    if (t) {
      if (t === "in-stock") f = f.filter((b) => b.stock > 10);
      else if (t === "low-stock")
        f = f.filter((b) => b.stock > 0 && b.stock <= 10);
      else if (t === "out-of-stock") f = f.filter((b) => b.stock === 0);
    }
    renderBooks(f);
  }
  function populateCategoryFilter() {
    const cats = [...new Set(allBooks.map((b) => b.category).filter(Boolean))];
    categoryFilterEl.innerHTML = '<option value="">All Categories</option>';
    cats
      .sort()
      .forEach(
        (c) =>
          (categoryFilterEl.innerHTML += `<option value="${c}">${c}</option>`)
      );
  }
  function renderCart() {
    if (!cart.length) {
      cartItemsContainerEl.innerHTML =
        '<p class="text-muted">No items in the cart.</p>';
    } else {
      cartItemsContainerEl.innerHTML = `<table class="table align-middle"><thead><tr><th>Book</th><th class="text-center">Qty</th><th class="text-end">Total</th><th></th></tr></thead><tbody>${cart
        .map(
          (i) =>
            `<tr data-id="${i.id}"><td>${
              i.title
            }<br><small class="text-muted">$${i.price.toFixed(
              2
            )} each</small></td><td class="text-center"><input type="number" class="form-control form-control-sm cart-quantity-input" value="${
              i.quantity
            }" min="1" max="${i.stock}"></td><td class="text-end fw-bold">$${(
              i.price * i.quantity
            ).toFixed(
              2
            )}</td><td class="text-end"><button class="btn btn-sm btn-outline-danger remove-from-cart-btn"><i class="bi bi-x-lg"></i></button></td></tr>`
        )
        .join("")}</tbody></table>`;
    }
    updateBillSummary();
  }
  function updateBillSummary() {
    const sub = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = sub * 0.05;
    const total = sub + tax;
    summarySubtotalEl.textContent = `$${sub.toFixed(2)}`;
    summaryTaxEl.textContent = `$${tax.toFixed(2)}`;
    summaryTotalEl.textContent = `$${total.toFixed(2)}`;
    const hasCartItems = cart.length > 0;
    processSaleBtnEl.disabled = !hasCartItems;
    clearCartBtnEl.disabled = !hasCartItems;
    generateReceiptBtnEl.disabled = lastSuccessfulSale === null;
  }
  function addToCart(id) {
    const book = allBooks.find((b) => b.id === id);
    if (!book || book.stock <= 0) {
      alert("Book is out of stock.");
      return;
    }
    const item = cart.find((i) => i.id === id);
    if (item) {
      if (item.quantity < book.stock) item.quantity++;
      else alert("Cannot add more than available stock.");
    } else {
      cart.push({ ...book, quantity: 1 });
    }
    renderCart();
  }
  function generateReceipt(sale) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const sub = sale.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = sub * 0.05;
    const total = sub + tax;
    doc.setFontSize(22);
    doc.text("The Story Shelf - Receipt", 10, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleString()}`, 10, 30);
    let y = 40;
    doc.line(10, y, 200, y);
    y += 10;
    doc.text("Item", 10, y);
    doc.text("Qty", 120, y);
    doc.text("Price", 150, y);
    doc.text("Total", 180, y);
    y += 5;
    doc.line(10, y, 200, y);
    y += 10;
    sale.forEach((i) => {
      doc.text(i.title.substring(0, 50), 10, y);
      doc.text(i.quantity.toString(), 120, y);
      doc.text(`$${i.price.toFixed(2)}`, 150, y);
      doc.text(`$${(i.price * i.quantity).toFixed(2)}`, 180, y);
      y += 7;
    });
    y += 5;
    doc.line(10, y, 200, y);
    y += 10;
    doc.text(`Subtotal: $${sub.toFixed(2)}`, 150, y);
    y += 7;
    doc.text(`Tax (5%): $${tax.toFixed(2)}`, 150, y);
    y += 7;
    doc.setFontSize(16);
    doc.text(`Total: $${total.toFixed(2)}`, 150, y);
    doc.save(`receipt-${Date.now()}.pdf`);
  }

  // --- Event Listeners ---
  function setupEventListeners() {
    window.addEventListener("hashchange", checkAdminMode);
    brandLogoEl.addEventListener("click", (e) => {
      e.preventDefault();
      showView("inventory-view");
    });
    loadMoreBtnEl.addEventListener("click", () => applyFiltersAndRender(true));
    navLinks.forEach((l) =>
      l.addEventListener("click", (e) => {
        e.preventDefault();
        showView(e.target.dataset.view);
      })
    );
    searchInputEl.addEventListener("input", () => applyFiltersAndRender(false));
    categoryFilterEl.addEventListener("change", () =>
      applyFiltersAndRender(false)
    );
    stockFilterEl.addEventListener("change", () =>
      applyFiltersAndRender(false)
    );
    addBookBtnEl.addEventListener("click", () => {
      bookFormEl.reset();
      bookFormEl.querySelector("#book-id").value = "";
      bookModalLabelEl.textContent = "Add New Book";
      bookModal.show();
    });
    bookListEl.addEventListener("click", (e) => {
      const card = e.target.closest(".book-card");
      if (!card) return;
      const bookId = card.dataset.id;
      const book = allBooks.find((b) => b.id === bookId);
      if (!book) return;
      if (e.target.closest(".edit-btn")) {
        bookFormEl.reset();
        bookModalLabelEl.textContent = "Edit Book";
        Object.keys(book).forEach((k) => {
          const input = bookFormEl.querySelector(`#${k}`);
          if (input) input.value = book[k];
        });
        bookFormEl.querySelector("#book-id").value = book.id;
        bookModal.show();
      } else if (e.target.closest(".delete-btn")) {
        if (confirm(`Delete "${book.title}"?`)) {
          fetch(`${API_URL}/books/${bookId}`, { method: "DELETE" }).then(
            (r) => {
              if (r.ok) refreshInventoryData();
              else alert("Delete failed.");
            }
          );
        }
      } else {
        showBookDetails(book);
      }
    });
    billingSearchEl.addEventListener("input", () => {
      const t = billingSearchEl.value.toLowerCase().trim();
      if (t.length < 2) {
        billingSearchResultsEl.innerHTML = "";
        return;
      }
      const r = allBooks.filter(
        (b) =>
          b.stock > 0 &&
          (b.title.toLowerCase().includes(t) ||
            b.author.toLowerCase().includes(t))
      );
      billingSearchResultsEl.innerHTML = r
        .slice(0, 5)
        .map(
          (b) =>
            `<a href="#" class="list-group-item list-group-item-action" data-id="${b.id}">${b.title} (${b.author})</a>`
        )
        .join("");
    });
    billingSearchResultsEl.addEventListener("click", (e) => {
      e.preventDefault();
      const t = e.target.closest("a");
      if (t && t.dataset.id) {
        addToCart(t.dataset.id);
        billingSearchEl.value = "";
        billingSearchResultsEl.innerHTML = "";
      }
    });
    bookFormEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = bookFormEl.querySelector("#book-id").value;
      const data = {
        id: id || bookFormEl.querySelector("#isbn").value,
        title: bookFormEl.querySelector("#title").value,
        author: bookFormEl.querySelector("#author").value,
        isbn: bookFormEl.querySelector("#isbn").value,
        price: parseFloat(bookFormEl.querySelector("#price").value),
        stock: parseInt(bookFormEl.querySelector("#stock").value, 10),
        category: bookFormEl.querySelector("#category").value,
        coverImage: bookFormEl.querySelector("#coverImage").value,
        description: bookFormEl.querySelector("#description").value,
      };
      const method = id ? "PUT" : "POST";
      const url = id ? `${API_URL}/books/${id}` : `${API_URL}/books`;
      fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((r) => {
          if (!r.ok) throw new Error("Save failed");
          bookModal.hide();
          refreshInventoryData();
        })
        .catch((err) => alert("Save failed"));
    });
    cartItemsContainerEl.addEventListener("change", (e) => {
      if (e.target.classList.contains("cart-quantity-input")) {
        const id = e.target.closest("tr").dataset.id;
        const qty = parseInt(e.target.value, 10);
        const item = cart.find((i) => i.id === id);
        if (qty > 0 && qty <= item.stock) {
          item.quantity = qty;
          renderCart();
        } else {
          e.target.value = item.quantity;
          alert(`Qty must be between 1 and ${item.stock}.`);
        }
      }
    });
    cartItemsContainerEl.addEventListener("click", (e) => {
      if (e.target.closest(".remove-from-cart-btn")) {
        const id = e.target.closest("tr").dataset.id;
        cart = cart.filter((i) => i.id !== id);
        renderCart();
      }
    });
    clearCartBtnEl.addEventListener("click", () => {
      if (cart.length > 0 && confirm("Clear cart?")) {
        cart = [];
        renderCart();
        lastSuccessfulSale = null;
        updateBillSummary();
      }
    });
    generateReceiptBtnEl.addEventListener("click", () => {
      if (lastSuccessfulSale) {
        generateReceipt(lastSuccessfulSale);
      } else {
        alert("No recent sale to generate a receipt for.");
      }
    });

    processSaleBtnEl.addEventListener("click", async () => {
      processSaleBtnEl.disabled = true;
      processSaleBtnEl.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Processing...`;
      try {
        const totalAmount =
          cart.reduce((s, i) => s + i.price * i.quantity, 0) * 1.05;
        const salePayload = { items: cart, totalAmount };
        const saleRes = await fetch(`${API_URL}/sales`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(salePayload),
        });
        if (!saleRes.ok) throw new Error("Failed to log sale.");

        const updates = cart.map((i) =>
          fetch(`${API_URL}/books/${i.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock: i.stock - i.quantity }),
          })
        );
        const responses = await Promise.all(updates);
        if (responses.some((r) => !r.ok))
          throw new Error("Stock update failed.");

        alert("Sale successful!");
        lastSuccessfulSale = JSON.parse(JSON.stringify(cart));
        cart = [];
        renderCart();
        await Promise.all([refreshInventoryData(), fetchSales()]);
      } catch (err) {
        alert(`Sale processing failed: ${err.message}`);
        lastSuccessfulSale = null;
      } finally {
        processSaleBtnEl.disabled = false;
        processSaleBtnEl.innerHTML =
          '<i class="bi bi-check-circle-fill me-2"></i>Process Sale';
        updateBillSummary();
      }
    });
  }

  // --- Start the App ---
  initializeApp();
});
