# Tourist Information System (TIS)

A beautiful, local-only web application that helps users discover places and plan trips. This project is built with vanilla HTML, CSS, and JavaScript, focusing on modern UI/UX principles without requiring any complex setup.

## Features

- **Discover Places:** Browse a curated list of attractions in a clean, card-based layout.
- **Search & Filter:** Instantly search for places by name, category, or tag.
- **Place Details:** View detailed information and a map location for each place.
- **Itinerary Planner:** Add or remove places from a personal itinerary.
- **Persistent State:** Your itinerary is saved in your browser, so it's there when you come back.
- **Export Itinerary:** Download your created itinerary as a JSON file.
- **Responsive Design:** Works beautifully on desktop, tablet, and mobile devices.

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript (ES6+)
- **Styling:** Custom CSS with a few layout utilities from Bootstrap (via CDN).
- **Maps:** Leaflet.js with OpenStreetMap tiles (requires an internet connection for map tiles).
- **Data:** Local `places.json` file (no database needed).

## How to Run Locally

This project is designed to be extremely simple to run.

1.  **Get the Code:** Clone this repository or download the source code.
2.  **Add Images:** Place your images (e.g., `india-gate.jpg`, `hawa-mahal.jpg`) inside the `/shared-assets/` folder in the root of the monorepo.
3.  **Open the App:**
    *   **Recommended:** Use a simple live server. If you are using VS Code, install the "Live Server" extension, right-click on the `Tourist-Information-System/src/index.html` file, and choose "Open with Live Server".
    *   **Alternative:** You can also open the `Tourist-Information-System/src/index.html` file directly in your web browser.

That's it! The application will run entirely in your browser.