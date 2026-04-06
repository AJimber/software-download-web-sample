# Software Download Web Sample

A static download page template for desktop apps with versioned Windows and macOS releases.

## Features
- Latest release buttons for Windows and macOS
- Version history powered by `data/releases.json`
- Simple static setup with no build step
- Easy to host on Apache, Nginx, or any static server

## Project structure
- `index.html` - main page
- `styles.css` - visual design
- `app.js` - release loader
- `data/releases.json` - release data source

## Update releases
Add a new entry at the top of `data/releases.json`:

```json
{
  "version": "1.3.0",
  "date": "2026-05-01",
  "notes": [
    "Added a new export workflow.",
    "Improved overall stability."
  ],
  "downloads": {
    "windows": "/downloads/1.3.0/your-app-setup-1.3.0.exe",
    "macos": "/downloads/1.3.0/your-app-1.3.0.dmg"
  }
}
