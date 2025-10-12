# nirvana_Team_BasicCoder_Round1
# Basic Coder Marks — Bookmarks Chrome Extension

> **Hackathon submission** — lightweight browser bookmarks manager extension (popup UI) with folder support, search, quick-add, and delete confirmation.

## Project Overview

This is a simple Chrome/Edge browser extension that lets users:

* Save the current tab as a bookmark from the popup.
* Add bookmarks manually.
* Create folders and organize bookmarks.
* Search bookmarks inside the popup.
* Delete bookmarks with a confirmation dialog.

The UI is focused on quick, in-popup bookmark management — ideal for a small productivity extension demo at a hackathon.

---

## Features

* Add current tab as bookmark quickly.
* Add bookmarks manually (title + URL + choose folder).
* Create and manage folders from the popup.
* Search bookmarks by title/URL.
* Delete with a confirmation prompt to avoid accidental deletions.
* Clean, mobile-friendly popup layout.

---

##

---

## Project Structure (brief)

```
manifest.json        # extension manifest
popup.html           # extension popup UI
style.css            # popup styles
script.js            # popup logic (add/search/delete/bookmark handling)
icons8-*.png         # bookmark icons used in the UI
```

> The actual code files are part of the repository submitted with this README.

---

## How to install (for testing locally)

1. Open your Chromium-based browser (Chrome/Edge).
2. Go to `chrome://extensions/` (or `edge://extensions/`).
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and select the project folder containing `manifest.json`.
5. The extension `Basic Coder Marks` should appear — click the extension icon to open the popup.

---

## How to use

* Click **Bookmark This Tab** to quickly save the currently active tab.
* Use **Add Bookmark Manually** to add a title and URL into a selected folder.
* Create a new folder by entering a folder name and clicking **Add**.
* Search bookmarks using the search box — results filter live as you type.
* Click the trash icon to delete a bookmark; a confirmation dialog will appear.

---

## Known Limitations / Future Improvements

* Currently stores metadata in the browser's bookmarks API; syncing behavior depends on browser settings.
* UI polishing (animations, responsive tweaks) can improve look-and-feel.
* Add import/export of bookmarks (CSV/JSON) for backup.
* Support tagging and multi-select delete.

---

## Contributors

* Deepanshu
* Himanshu
* Vishal
* Gaurav

---

## License

This project is provided for hackathon/demo purposes. Use freely for learning and demos. If you'd like a formal license, add an open-source license file (e.g., MIT) to the repository.

---

##
