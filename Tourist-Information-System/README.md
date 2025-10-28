# Tourist Information System (TIS)

A full-stack, local-only web application that helps users discover places, plan trips, and manage attraction data through an admin panel.

## Live Demo GIF

![TIS Demo GIF](./docs-tis/tis-demo.gif)

## Features

- **Dynamic Data:** All data is served from a local Node.js server and stored in an SQLite database.
- **Discover & Filter:** Browse a grid of tourist attractions, with live filtering by category and a "Load More" feature for pagination.
- **Search:** Instantly search for places by name, category, or tag.
- **Place Details:** View detailed information for each place, including opening hours, entry fees, contact info, and an interactive map marker (via Leaflet.js).
- **Itinerary Planner:** Add/remove places from a personal itinerary that persists between sessions using `localStorage`.
- **Admin Panel:** A dedicated `#admin` view allows for creating new places and editing existing ones directly in the database.
- **Responsive Design:** A clean, mobile-first UI that works on all screen sizes.

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Database:** SQLite with Knex.js as the query builder.
- **Maps:** Leaflet.js with OpenStreetMap tiles.

## How to Run Locally

This project requires Node.js (LTS version) to be installed.

**1. Clone the Repository:**
```bash
git clone <your-repo-url>
cd 3rd-sem-college-assignments