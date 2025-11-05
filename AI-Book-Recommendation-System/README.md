# Bookwise: A Local Recommendation Chatbot

Bookwise is a feature-rich, single-page web application that functions as a friendly and interactive book recommendation chatbot. Users can input a book they've enjoyed or a genre they're interested in, and the application provides three personalized recommendations from its local database.

This project was built from the ground up with a modern tech stack and showcases a polished user interface, robust state management, and a clean client-server architecture, all designed to run entirely on a local machine without external API dependencies.

---

## Live Demo

Since this is a local-only application, a live web demo isn't possible. Here's an animated GIF showcasing the user experience and core functionalities:

![Bookwise Demo GIF](./docs-ai-bas/ai-bas-demo.gif)

*(**To create your own GIF:** Use a free tool like [ScreenToGif](https://www.screentogif.com/) (Windows) or [Kap](https://getkap.co/) (macOS) to record your screen while using the app. Create a `demo` folder inside this project directory, save the GIF as `bookwise-demo.gif` inside it, and it will appear here automatically.)*

---

### Final Features

-   **Interactive Chat UI:** A sleek, modern, full-screen interface inspired by top-tier chatbots, with a soothing dark theme.
-   **Local Recommendation Engine:** A Node.js/Express server that uses a keyword-matching algorithm against a local `books.json` database to provide relevant suggestions.
-   **Dynamic "AI" Experience:** Features like a typing indicator and smooth animations make the local engine feel alive and conversational.
-   **Example Prompts:** New users are greeted with clickable prompt buttons to instantly engage with the chatbot.
-   **Favorites System:** Users can "like" books, and their selections are saved persistently in the browser's `localStorage`.
-   **Slide-Out Favorites Panel:** A beautiful, animated panel allows users to view and manage their list of saved favorite books.
-   **Utility Features:** Includes a "Copy to Clipboard" button on each recommendation for easy sharing.

---

### Tech Stack

-   **Frontend:** React (with Vite)
-   **Backend:** Node.js with Express
-   **Styling:** Custom CSS with modern features like variables and animations.
-   **Core Logic:** JavaScript (ES6+)

---

### Project Structure

The project is organized into a `client` (frontend) and `server` (backend) directory.

/AI-Book-Recommendation-System

- **/client/** — Frontend (React-based) client application  
  - **package.json** — Client-side dependencies and scripts  
  - **/src/** — All frontend source code  
    - **/components/** — UI components  
      - **BookCard.jsx**  
      - **FavoritesPanel.jsx**  
      - ... *(other UI components)*  
    - **App.jsx** — Main React component  
    - **App.css** — Styling for the app  
    - **main.jsx** — Entry point for React  

- **/server/** — Backend server logic  
  - **package.json** — Server-side dependencies  
  - **index.js** — Express.js server and routes  
  - **books.json** — Local dataset or mock API for book data  

- **README.md** — Project documentation file

---

### Local Setup and Installation

Follow these instructions to run the project on your local machine.

#### Prerequisites

-   Node.js (v18 or later)
-   npm

#### 1. Clone the Repository

Clone the main `3rd-sem-college-assignments` repository to your local machine.

```bash
git clone <your-repository-url>
cd 3rd-sem-college-assignments