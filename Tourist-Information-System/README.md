#  Wanderlust - Tourist Information System (TIS)

##  Project Overview

**Wanderlust** is a full-stack, local-only Tourist Information System designed as a web application. It runs 100% on your local machine with no need for external APIs, paid services, or cloud hosting. This software provides a complete solution for travelers and students to discover new places, view them on a map, and build a personal day-by-day itinerary.

The application is built with a modern, responsive frontend using vanilla JavaScript, HTML, and CSS, and a robust Node.js backend that interacts with a local SQLite database, making it both lightweight and powerful.

---

##  Core Features

-   ** Place Directory**: Browse a rich list of tourist attractions with details like descriptions, images, ratings, opening hours, and entry fees.
-   ** Search & Dynamic Filters**: Instantly search for places by name or tag, and filter the entire directory by category with a single click.
-   ** Interactive Map**: Each place detail page features an interactive map (powered by Leaflet.js and OpenStreetMap) with a marker showing the exact location.
-   ** Itinerary Planner**: Add places to a personal itinerary, which is saved locally in your browser. You can also export your final plan as a JSON file.
-   ** User Reviews & Ratings**: (Coming Soon) Users can submit their own ratings and text reviews for places they have visited.
-   ** Admin Panel**: A simple and powerful admin interface (activated by appending `#admin` to the URL) for full CRUD (Create, Read, Update, Delete) management of the places in the database.
-   ** 100% Offline Capable**: The entire application, including the server and database, runs locally. An internet connection is only needed to download the map tiles.
-   ** Creative & Responsive UI**: A clean, modern, and user-friendly interface that works beautifully on desktops, tablets, and mobile devices.

---

##  Live Demo

Since this is a local-only application, a live web demo isn't possible. Here's an animated GIF showcasing the user experience and core functionalities:

![TIS Demo GIF](./docs-tis/tis-demo.gif)

*(**To create your own GIF:** Use a free tool like [ScreenToGif](https://www.screentogif.com/) (Windows) or [Kap](https://getkap.co/) (macOS) to record your screen while using the app, then upload the GIF to your GitHub repository and replace the link above.)*

---

##  Tech Stack

-   **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
-   **Styling**: Custom CSS & Bootstrap 5 (via CDN) for responsive layout.
-   **Backend**: Node.js with Express.js for the local API server.
-   **Database**: SQLite (a lightweight, file-based database).
-   **Database Queries**: Knex.js (a flexible SQL query builder).
-   **Mapping**: Leaflet.js with OpenStreetMap tiles.

---

##  File Structure

The project is organized in a clean, modular structure:

/Tourist-Information-System
|
├── /data/ # Contains the database file
│ └── tis.db
|
├── /server/ # Contains all backend code
│ ├── db-init.js # Script to initialize the database schema
│ ├── index.js # The Express.js server
│ ├── knexfile.js # Knex.js database configuration
│ └── package.json # Node.js project dependencies
|
├── /shared-assets/ # Contains all place images
│ └── gateway-india.jpg
|
└── /src/ # Contains all frontend code
├── app.js # Main application logic
├── index.html # HTML structure for the single-page app
└── styles.css # Custom CSS styles

---

##  Setup and Run Instructions

Follow these steps to get the full-stack application running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (which includes `npm`) must be installed on your system.
-   A modern web browser (e.g., Chrome, Firefox).
-   A code editor like [Visual Studio Code](https://code.visualstudio.com/) with the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.

### 1. Initial Setup (First Time Only)

1.  Open a terminal and navigate to the server directory:
    ```bash
    cd path/to/Tourist-Information-System/server
    ```
2.  Install all the necessary backend packages:
    ```bash
    npm install
    ```

### 2. Running the Application

This is a full-stack application. You must have both the backend and frontend running at the same time.

#### A. Start the Backend Server (Terminal 1)

1.  In your terminal (which should still be in the `/server` directory), run:
    ```bash
    npm start
    ```
2.  The terminal should display: `Server is running on http://localhost:3001`. Keep this terminal running.

#### B. Launch the Frontend (VS Code)

1.  In VS Code, right-click on the `/Tourist-Information-System/src/index.html` file.
2.  Select **"Open with Live Server"**.

Your browser will open the application, and it will now be connected to your live local backend.

### 3. Resetting the Database

If you ever want to reset the database to its initial sample data (e.g., after a code change in `db-init.js`), follow these steps:
1. Stop the backend server (`Ctrl + C` in Terminal 1).
2. Delete the database file located at `/Tourist-Information-System/data/tis.db`.
3. In the `/server` directory terminal, run: `npm run db:init`
4. Restart the server: `npm start`

### 4. Using the Admin Panel

To access the administrative functions (add, edit, and manage places), simply append `#admin` to the URL in your browser's address bar:

`http://localhost:5500/Tourist-Information-System/src/index.html#admin`

---

##  Version Control Workflow

This project follows a standard Git workflow:

1.  Development happens on feature branches (e.g., `feature/tis-reviews`).
2.  Completed features are merged into the `dev` branch via Pull Requests.
3.  The `dev` branch is for staging and integration testing.
4.  Once stable, `dev` is merged into the `main` branch, which always holds the production-ready code.