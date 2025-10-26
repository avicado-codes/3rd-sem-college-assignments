# Tourist Information System (TIS)

A local-only web application that helps users discover places, plan trips, and view maps and local information.

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Database:** SQLite
- **Maps:** Leaflet.js with OpenStreetMap tiles

## How to Run

1.  **Prerequisites:** Make sure you have [Node.js](https://nodejs.org/) (LTS version) installed.

2.  **Clone the Repository:**
    ```bash
    git clone <your-repo-url>
    cd 3rd-sem-college-assignments
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd Tourist-Information-System/server
    npm install
    ```

4.  **Initialize the Database:** (Only needs to be run once)
    ```bash
    npm run db:init
    ```

5.  **Start the Backend Server:**
    ```bash
    npm start
    ```
    The API will be running at `http://localhost:3001`.

*(Frontend instructions will be added later.)*
*(Instructions will be added as the project is developed.)*