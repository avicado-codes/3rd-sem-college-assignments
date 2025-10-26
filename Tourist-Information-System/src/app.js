// --- Wanderlust App - Main JavaScript File ---

// 1. STATE MANAGEMENT
// A central object to hold the application's state
const appState = {
  places: [], // Will be filled with data from places.json
  itinerary: [], // A list of place IDs added by the user
};

// 2. DOM ELEMENT REFERENCES
// Getting references to key elements on the page we'll need to interact with
const appContainer = document.getElementById("app");
const itineraryCountBadge = document.getElementById("itinerary-count");
const searchInput = document.getElementById("searchInput");

// 3. ROUTER
// A simple hash-based router to navigate between views
function router() {
  const path = location.hash || "#home"; // Default to home if no hash

  if (path === "#home") {
    renderHomePage();
  } else if (path === "#itinerary") {
    renderItineraryPage();
  } else if (path.startsWith("#places/")) {
    const placeId = parseInt(path.split("/")[1]);
    renderDetailPage(placeId);
  }else if (path === '#admin') {
        renderAdminPage();
    } else {
    renderNotFound(); // A simple "not found" view
  }
}

// 4. RENDER FUNCTIONS
// These functions are responsible for generating HTML and putting it on the page

/** Renders the main home page with hero, filters, and place cards */
function renderHomePage(filteredPlaces = null) {
  const placesToRender = filteredPlaces || appState.places;

  // --- NEW: Dynamically generate filter buttons ---
  // 1. Get all unique categories from the places data, starting with 'All'
  const categories = [
    "All",
    ...new Set(appState.places.map((p) => p.category)),
  ];

  // 2. Create the HTML for the filter bar
  const filterBarHTML = `
        <div class="filter-bar mb-4">
            ${categories
              .map(
                (category) => `
                <button class="filter-btn ${
                  category === "All" ? "active" : ""
                }" data-action="filter-category" data-category="${category}">
                    ${category}
                </button>
            `
              )
              .join("")}
        </div>
    `;

  // 3. Create the HTML for the hero and the grid
  const heroHTML = `
        <div class="hero-section">
            <h1 class="display-4">Find Your Next Adventure</h1>
            <p class="lead">Explore the most beautiful and exciting destinations curated just for you.</p>
        </div>
    `;
  const placesGridHTML = `
        <div class="places-grid">
            ${placesToRender
              .map((place) => createPlaceCardHTML(place))
              .join("")}
        </div>
    `;

  // 4. Combine and render
  appContainer.innerHTML = heroHTML + filterBarHTML + placesGridHTML;
}

/** Renders the detail page for a single place */
function renderDetailPage(placeId) {
  const place = appState.places.find((p) => p.id === placeId);
  if (!place) {
    renderNotFound();
    return;
  }

  const detailHTML = `
        <div class="detail-view">
            <a href="#home" class="btn btn-outline-secondary mb-4">&larr; Back to List</a>
            <div class="detail-header">
                <img src="../shared-assets/${place.image}" alt="${place.name}" class="img-fluid">
                <h1 class="mt-3">${place.name}</h1>
                <p class="lead text-muted">${place.category}</p>
            </div>
            <div class="detail-body mt-4">
                <p>${place.description}</p>
                <div id="map" class="mt-4"></div>
                <button class="btn btn-lg btn-secondary mt-4" data-action="add-to-itinerary" data-place-id="${place.id}">
                    Add to My Itinerary
                </button>
            </div>
        </div>
    `;
  appContainer.innerHTML = detailHTML;
  initMap(place.latitude, place.longitude, place.name);
}

/** Renders the user's itinerary page */
function renderItineraryPage() {
  const itineraryPlaces = appState.itinerary.map((id) =>
    appState.places.find((p) => p.id === id)
  );

  let contentHTML;
  if (itineraryPlaces.length === 0) {
    contentHTML = `
            <h2>Your Itinerary is Empty</h2>
            <p>Go back to the <a href="#home">home page</a> to add some places!</p>
        `;
  } else {
    contentHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Your Itinerary</h2>
                <button class="btn btn-primary" data-action="export-itinerary">Export as JSON</button>
            </div>
            <div class="itinerary-list">
                ${itineraryPlaces
                  .map((place) => createItineraryItemHTML(place))
                  .join("")}
            </div>
        `;
  }

  appContainer.innerHTML = `<div class="itinerary-page">${contentHTML}</div>`;
}

/** Renders the admin page for adding/editing places */
function renderAdminPage() {
    const placesListHTML = appState.places.map(place => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            ${place.name}
            <div>
                <button class="btn btn-sm btn-outline-secondary" data-action="edit-place" data-place-id="${place.id}">Edit</button>
            </div>
        </li>
    `).join('');

    const adminHTML = `
        <div class="admin-page">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin Panel</h2>
                <button class="btn btn-success" data-action="download-json">Download Updated places.json</button>
            </div>
            
            <div class="row">
                <!-- Add/Edit Form Column -->
                <div class="col-md-5">
                    <div id="admin-form-container">
                        ${createAdminFormHTML()}
                    </div>
                </div>

                <!-- Places List Column -->
                <div class="col-md-7">
                    <h4>Existing Places</h4>
                    <ul class="list-group">
                        ${placesListHTML}
                    </ul>
                </div>
            </div>
        </div>
    `;
    appContainer.innerHTML = adminHTML;
}

/** Renders a "Page Not Found" message */
function renderNotFound() {
  appContainer.innerHTML = `
        <div class="text-center py-5">
            <h2>404 - Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
            <a href="#home" class="btn btn-primary">Go Home</a>
        </div>
    `;
}

// 5. HTML COMPONENT CREATORS
// Helper functions that return HTML strings for components like cards

/** Creates HTML for a single place card */
function createPlaceCardHTML(place) {
  return `
        <div class="place-card">
            <img src="../shared-assets/${place.image}" alt="${place.name}" class="card-image">
            <div class="card-content">
                <h3 class="card-title">${place.name}</h3>
                <p class="card-description">${place.description.substring(
                  0,
                  100
                )}...</p>
                <div class="card-footer">
                    <span class="card-rating">⭐ ${place.rating}</span>
                    <a href="#places/${
                      place.id
                    }" class="btn btn-primary btn-sm">View Details</a>
                </div>
            </div>
        </div>
    `;
}

/** Creates HTML for a single item in the itinerary list */
function createItineraryItemHTML(place) {
  return `
        <div class="itinerary-item">
            <img src="../shared-assets/${place.image}" alt="${place.name}">
            <div class="itinerary-item-info">
                <h4>${place.name}</h4>
                <p class="text-muted">${place.category}</p>
            </div>
            <button class="btn btn-danger btn-sm" data-action="remove-from-itinerary" data-place-id="${place.id}">Remove</button>
        </div>
    `;
}

/** Creates HTML for the admin form */
function createAdminFormHTML(place = {}) {
    // If we are editing, 'place' will be an object. If adding, it's an empty object.
    const isEditing = place.id != null;
    return `
        <h4>${isEditing ? 'Edit Place' : 'Add New Place'}</h4>
        <form id="admin-form" data-editing-id="${isEditing ? place.id : ''}">
            <div class="mb-2">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" required value="${place.name || ''}">
            </div>
            <div class="mb-2">
                <label for="category" class="form-label">Category</label>
                <input type="text" class="form-control" id="category" required value="${place.category || ''}">
            </div>
            <div class="mb-2">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" rows="3" required>${place.description || ''}</textarea>
            </div>
            <div class="mb-2">
                <label for="image" class="form-label">Image Filename (e.g., "new-place.jpg")</label>
                <input type="text" class="form-control" id="image" required value="${place.image || ''}">
            </div>
            <div class="row">
                <div class="col">
                    <label for="latitude" class="form-label">Latitude</label>
                    <input type="number" step="any" class="form-control" id="latitude" required value="${place.latitude || ''}">
                </div>
                <div class="col">
                    <label for="longitude" class="form-label">Longitude</label>
                    <input type="number" step="any" class="form-control" id="longitude" required value="${place.longitude || ''}">
                </div>
            </div>
             <div class="row mt-2">
                <div class="col">
                    <label for="rating" class="form-label">Rating</label>
                    <input type="number" step="0.1" min="0" max="5" class="form-control" id="rating" required value="${place.rating || ''}">
                </div>
                <div class="col">
                    <label for="tags" class="form-label">Tags (comma-separated)</label>
                    <input type="text" class="form-control" id="tags" required value="${(place.tags || []).join(', ')}">
                </div>
            </div>
            <button type="submit" class="btn btn-primary mt-3">${isEditing ? 'Save Changes' : 'Add Place'}</button>
            ${isEditing ? '<button type="button" class="btn btn-secondary mt-3 ms-2" data-action="cancel-edit">Cancel</button>' : ''}
        </form>
    `;
}

// 6. ITINERARY & LOCALSTORAGE LOGIC

/** Adds a place to the itinerary */
function addToItinerary(placeId) {
  if (!appState.itinerary.includes(placeId)) {
    appState.itinerary.push(placeId);
    saveItineraryToLocalStorage();
    updateItineraryBadge();
    showToast("Added to itinerary!");
  } else {
    showToast("Already in your itinerary.", true);
  }
}

/** Removes a place from the itinerary */
function removeFromItinerary(placeId) {
  appState.itinerary = appState.itinerary.filter((id) => id !== placeId);
  saveItineraryToLocalStorage();
  updateItineraryBadge();
  renderItineraryPage(); // Re-render the page to show the change
}

/** Saves the current itinerary to the browser's local storage */
function saveItineraryToLocalStorage() {
  localStorage.setItem("tis-itinerary", JSON.stringify(appState.itinerary));
}

/** Loads itinerary from local storage when the app starts */
function loadItineraryFromLocalStorage() {
  const savedItinerary = localStorage.getItem("tis-itinerary");
  if (savedItinerary) {
    appState.itinerary = JSON.parse(savedItinerary);
  }
}

/** Updates the count on the itinerary navigation link */
function updateItineraryBadge() {
  const count = appState.itinerary.length;
  if (count > 0) {
    itineraryCountBadge.textContent = count;
    itineraryCountBadge.classList.remove("d-none");
  } else {
    itineraryCountBadge.classList.add("d-none");
  }
}

/** Exports the itinerary as a JSON file */
function exportItinerary() {
  const itineraryPlaces = appState.itinerary.map((id) =>
    appState.places.find((p) => p.id === id)
  );
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(itineraryPlaces, null, 2));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "my_itinerary.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  showToast("Itinerary exported!");
}

// 7. MAP & OTHER UTILITIES

/** Initializes a Leaflet map on the detail page */
function initMap(lat, lon, placeName) {
  // Check if Leaflet is loaded
  if (typeof L === "undefined") {
    document.getElementById("map").innerHTML =
      '<p class="text-danger">Map could not be loaded. Please check your internet connection.</p>';
    return;
  }
  const map = L.map("map").setView([lat, lon], 14);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  L.marker([lat, lon]).addTo(map).bindPopup(`<b>${placeName}</b>`).openPopup();
}

/** Shows a toast notification message */
function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.backgroundColor = isError
    ? "var(--accent-color)"
    : "var(--primary-color)";
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/** Handles search input */
function handleSearch(event) {
  const query = event.target.value.toLowerCase();
  const filtered = appState.places.filter(
    (place) =>
      place.name.toLowerCase().includes(query) ||
      place.category.toLowerCase().includes(query) ||
      place.tags.some((tag) => tag.toLowerCase().includes(query))
  );
  renderHomePage(filtered);
}

/** Handles the submission of the admin add/edit form */
function handleAdminFormSubmit(form) {
    const editingId = parseInt(form.dataset.editingId);
    const placeData = {
        name: form.querySelector('#name').value,
        category: form.querySelector('#category').value,
        description: form.querySelector('#description').value,
        image: form.querySelector('#image').value,
        latitude: parseFloat(form.querySelector('#latitude').value),
        longitude: parseFloat(form.querySelector('#longitude').value),
        rating: parseFloat(form.querySelector('#rating').value),
        tags: form.querySelector('#tags').value.split(',').map(tag => tag.trim()),
    };

    if (editingId) {
        // Update existing place
        const index = appState.places.findIndex(p => p.id === editingId);
        if (index > -1) {
             appState.places[index] = { ...appState.places[index], ...placeData };
             showToast('Place updated successfully!');
        }
    } else {
        // Add new place
        placeData.id = Date.now(); // Simple unique ID
        appState.places.push(placeData);
        showToast('Place added successfully!');
    }

    // Re-render the entire admin page to show the updated list and clear the form
    renderAdminPage();
}

/** Triggers a download of the current appState.places as a JSON file */
function downloadPlacesJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState.places, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "places.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// 8. EVENT LISTENERS
/** Central event listener using event delegation */
function setupEventListeners() {
  // Listen for hash changes to trigger the router
  window.addEventListener("hashchange", router);

  // Listen for search input
  searchInput.addEventListener("input", handleSearch);

  // Listen for form submissions. We attach it to the appContainer
    // because the form is created and destroyed dynamically.
    appContainer.addEventListener('submit', event => {
        // We only care about submissions from our specific admin form
        if (event.target.id === 'admin-form') {
            event.preventDefault(); // Always prevent the default page reload on form submit
            handleAdminFormSubmit(event.target);
        }
    });

  // Use event delegation for clicks on dynamic content
  document.body.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;
    const placeId = parseInt(target.dataset.placeId);

    if (action === "add-to-itinerary") {
      addToItinerary(placeId);
    } else if (action === "remove-from-itinerary") {
      removeFromItinerary(placeId);
    } else if (action === "export-itinerary") {
      exportItinerary();
    } else if (action === 'filter-category') {
        const category = target.dataset.category;

        // First, remove the 'active' class from all filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        // Then, add the 'active' class to the button that was just clicked
        target.classList.add('active');

        // Filter the places based on the selected category and re-render the home page
        if (category === 'All') {
            renderHomePage(appState.places);
        } else {
            const filtered = appState.places.filter(place => place.category === category);
            renderHomePage(filtered);
        }
    } else if (action === 'edit-place') {
        const placeId = parseInt(target.dataset.placeId);
        const place = appState.places.find(p => p.id === placeId);
        document.getElementById('admin-form-container').innerHTML = createAdminFormHTML(place);
    } else if (action === 'cancel-edit') {
        document.getElementById('admin-form-container').innerHTML = createAdminFormHTML();
    } else if (action === 'download-json') {
        downloadPlacesJSON();
    }
  });
}

// 9. INITIALIZATION
/** The main function to kick off the application */
async function init() {
  // Load itinerary from previous sessions
  loadItineraryFromLocalStorage();
  updateItineraryBadge();

  // Fetch the place data from our local JSON file
  try {
    const response = await fetch("./places.json");
    if (!response.ok) throw new Error("Network response was not ok");
    appState.places = await response.json();

    // Setup listeners and initial render
    setupEventListeners();
    router(); // Initial page load routing
  } catch (error) {
    appContainer.innerHTML = `<div class="alert alert-danger">Could not load place data. Please ensure 'places.json' is in the 'src' folder.</div>`;
    console.error("Fetch error:", error);
  }
}

// Start the app once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", init);
