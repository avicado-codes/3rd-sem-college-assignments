# Bookshop Automation Software (BAS) - "The Story Shelf"

##  Project Overview

**The Story Shelf** is a fully-functional Bookshop Automation Software (BAS) designed as a local-only web application. It runs 100% offline with no need for external APIs or cloud services. This software provides a comprehensive solution for small bookshops or personal library management, covering inventory, billing, customer tracking, and sales analytics.

The application is built with a modern frontend using vanilla JavaScript, HTML, and CSS (styled with Bootstrap), and a lightweight Node.js backend that interacts with a local JSON file-based database.

---

##  Live Demo

This animation demonstrates the core features of the application, including inventory management, searching, filtering, processing a sale, and viewing the analytics dashboard.


![Live Demo of The Story Shelf](./docs-bas/bas-demo.gif)

*(**To create your own GIF:** Use a free tool like [ScreenToGif](https://www.screentogif.com/) (Windows) or [Kap](https://getkap.co/) (macOS) to record your screen while using the app, then upload the GIF to your GitHub repository and replace the link above.)*

---

##  Core Features

-   ** Inventory Management**: Full CRUD (Create, Read, Update, Delete) for books. Features include a book details modal, search, multi-level filtering, and "load more" pagination.
-   ** Admin Mode**: A simple and secure admin panel (activated by appending `#admin` to the URL) that reveals controls for adding, editing, and deleting books.
-   ** Point of Sale (POS) & Billing**: A streamlined billing interface to search for books, add them to a cart, select a customer, and process sales. Stock levels are automatically updated upon sale completion.
-   ** PDF Receipt Generation**: Instantly generate and download a printable PDF receipt for every sale.
-   ** Reports & Analytics**: A powerful dashboard with summary cards and visual charts (powered by Chart.js) to track:
    -   Total Revenue, Total Books Sold, and Total Transactions.
    -   Daily sales revenue trends.
    -   Top 10 best-selling books.
-   ** Customer Management**:
    -   Add and manage customer profiles (name and contact info).
    -   Associate sales with specific customers to track their purchase history.
-   ** 100% Offline Capable**: The entire application, including the server and database, runs locally on your machine.
-   ** Creative & Responsive UI**: A clean, modern, and user-friendly interface that works seamlessly on different screen sizes.

---

##  Tech Stack

-   **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
-   **Styling**: Bootstrap 5 (via CDN) for responsive layout and components.
-   **Backend**: Node.js with Express.js for the local API server.
-   **Database**: Local JSON files (`books.json`, `sales.json`, `customers.json`).
-   **PDF Generation**: jsPDF
-   **Charts & Analytics**: Chart.js

---

##  File Structure

The project follows a modular monorepo-style layout:
/Bookshop-Automation-Software

- **/src/** — Contains all frontend code
  - **/images/** — Book cover images
  - **app.js** — Main application logic
  - **index.html** — HTML for the single-page app
  - **styles.css** — Custom CSS styles
  - **favicon.ico** — Browser tab icon

- **/server/** — Contains all backend code
  - **/db/** — Local JSON database files
    - **books.json**
    - **sales.json**
    - **customers.json**
  - **index.js** — Express server
  - **package.json** — Node.js project dependencies
  - **package-lock.json**

- **README.md** — This documentation file


---

##  Setup and Run Instructions

Follow these steps to get the application running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (which includes `npm`) must be installed on your system.
-   A modern web browser (e.g., Chrome, Firefox).
-   A code editor like [Visual Studio Code](https://code.visualstudio.com/) with the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.

### 1. Configure Live Server

To prevent the app from auto-reloading every time a sale is made, you need to tell Live Server to ignore the `server` directory.

1.  In VS Code, go to **File > Preferences > Settings** (or press `Ctrl + ,`).
2.  Search for `Live Server Ignore Files`.
3.  Click **"Edit in settings.json"** and add the following configuration:
    ```json
    "liveServer.settings.ignoreFiles": [
        "**/server/**"
    ]
    ```
4.  Save and **restart VS Code**.

### 2. Run the Backend Server

1.  Open a terminal and navigate to the server directory:
    ```bash
    cd path/to/Bookshop-Automation-Software/server
    ```
2.  Install the necessary Node.js dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    node index.js
    ```
4.  The terminal should display: `Server is running on http://localhost:3000`. Keep this terminal running.

### 3. Launch the Frontend

1.  In VS Code, open the `Bookshop-Automation-Software/src/` folder.
2.  Right-click on `index.html`.
3.  Select **"Open with Live Server"**.

Your browser will open the application, and it is now ready to use!

### 4. Using Admin Mode

To access administrative functions (add, edit, delete books), simply append `#admin` to the URL in your browser's address bar:

`http://localhost:5500/src/index.html#admin`

---

##  Version Control Workflow

This project follows a standard Git workflow:

1.  Development happens on feature branches (e.g., `feature/bas-reports-analytics`).
2.  Completed features are merged into the `dev` branch.
3.  The `dev` branch is for staging and integration testing.
4.  Once stable, `dev` is merged into the `main` branch, which always holds the production-ready code.