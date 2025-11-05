# AI-Travel-Guide-App — WanderWise (Single-file Travel Companion)

**AI-Travel-Guide-App (WanderWise)** is a polished, single-file web application that provides short, friendly travel overviews for any destination.  
It’s designed as a lightweight, local-first prototype you can run from a single `index.html` file.

The app features a refined indigo-and-gold themed interface, theme toggle, language selector, presets, local search history, and tools like copy/download/share — all in one page.  
It demonstrates how an elegant, fully-featured front-end experience can be achieved without complex frameworks.

---

## Live Demo

This is a **local-first** app — no hosted demo is included.  
You can record a short animation of the app in action:

![WanderWise Demo GIF](./docs-ai-travel-guide/wanderwise-demo.gif)

**To create your own GIF:**  
Use a free screen recorder like [ScreenToGif](https://www.screentogif.com/) (Windows) or [Kap](https://getkap.co/) (macOS).  
Record yourself using the app (searching, toggling themes, copying results) and save the file as `wanderwise-demo.gif` inside a `demo` folder.

---

##  Final Features

- **Single-file App** — All HTML, CSS, and JS live in one `index.html`.  
- **Elegant Indigo & Gold UI** — Readable light/dark modes with smooth gradients and subtle glassmorphism.  
- **Persistent Theme** — Dark/light preference saved via `localStorage`.  
- **Refined Header & Logo** — Custom compass-style logo and “WanderWise” branding.  
- **Destination Search** — Enter any city or country and get an instant, concise travel overview.  
- **Gemini API Integration (optional)** — Uses Google Generative Language API (client-side fetch).  
- **Markdown Cleanup** — Removes markdown artifacts (`#`, `**`, etc.) for clean text.  
- **Loading Skeleton** — Smooth shimmer animation while waiting for AI response.  
- **Search Presets** — Tailor tone with *Family*, *Budget*, *Luxury*, or *Romantic* filters.  
- **Language Selector** — Choose English, Hindi, Spanish, or French.  
- **Recent Searches** — Clickable chips stored in `localStorage` for quick re-search.  
- **Pinned Result** — Save one result locally to revisit later.  
- **Copy / Download / Share** — Copy to clipboard, download as `.txt`, or email results.  
- **Reformat Button** — Re-clean response text on demand.  
- **Word & Character Counters** — Live counts below every result.  
- **Keyboard Shortcuts** — Press **Enter** to trigger a search.  
- **Local-first Operation** — All UI and storage features run offline.

---

##  Tech Stack

- **Frontend:** HTML + CSS + Vanilla JavaScript  
- **AI Model (optional):** Google Generative Language (Gemini) REST API  
- **Storage:** Browser `localStorage` (theme, history, pinned result)

---

##  Security & API Notes

If you plan to use the Gemini API:
- **Never expose your API key** in client-side code when deploying publicly.
- Instead, use a small **server-side proxy** (see `server.js` example below).
- For local demos, it’s fine to keep the key in `index.html` temporarily.
- To test without API access, stub the `callGemini()` function to return sample text.

---

##  Local Setup and Installation

You only need `index.html`.  
Two easy options:

### **Option 1 — Open directly**

1. Save `index.html` to any folder.  
2. Double-click to open in your browser.  
   > Some browsers block external API calls from `file://` URLs.  
   > For best results, use a simple HTTP server.

### **Option 2 — Run a quick local server**

#### Using Python
```bash
# Python 3
cd /path/to/project-folder
python -m http.server 5500

##  How to Use (Quick Checklist)

1. **Open the page** in your browser.  
2. **Toggle between Dark and Light themes** — the app remembers your choice across sessions.  
3. **Type a destination** (e.g., `Venice`) and click **Get Travel Info**.  
4. Wait for the **skeleton loader** to finish — the result appears as clean, formatted text.  
5. Use **Presets** to focus on different travel styles:  
   - *Family*  
   - *Budget*  
   - *Luxury*  
   - *Romantic*  
6. Switch **Language** (English, Hindi, Spanish, French) and re-run the search to get localized output.  
7. Use the **Copy**, **Download**, or **Share via Email** buttons to save or share the generated text.  
8. Click **Pin Result** to save one summary locally (persists using `localStorage`).  
9. Check **Recent Searches** chips to quickly revisit previous destinations.  
10. Use **Reformat Result** if any stray markdown symbols (`#`, `**`, etc.) appear.  
11. Optionally test offline — most UI features (theme, history, pin, copy/download) work without network connectivity.
