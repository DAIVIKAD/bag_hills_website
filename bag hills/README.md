# Bag Hills - Arekere, Karnataka

A premium static website for Bag Hills in Arekere, Karnataka. The site is designed as a cinematic nature and place-story experience, highlighting the hill landscape, monsoon mushrooms, wild honeycomb, traditional cashew roasting, forest trails, and local atmosphere.

## Folder Structure

```text
bag hills/
├── index.html
├── style.css
├── script.js
├── README.md
├── apps-script/
│   └── Code.gs
└── images/
    ├── hero-collage.jpg
    ├── bag-rock.jpg
    ├── mushrooms.jpg
    ├── cashew-roast.jpg
    ├── honeycomb.jpg
    ├── trail.jpg
    ├── bg-forest.jpg
    └── bg-fog.jpg
```

## Images

All images are stored in `images/` and referenced with relative paths, so the site works on GitHub Pages. Replace any image by keeping the same filename, or update the matching `src` path in `index.html`.

Recommended image dimensions:

- `hero-collage.jpg`: wide landscape, around 2400 x 1400
- `bag-rock.jpg`, `mushrooms.jpg`, `cashew-roast.jpg`: portrait or closeup images
- `honeycomb.jpg`, `trail.jpg`, `bg-forest.jpg`, `bg-fog.jpg`: landscape images

## Editing Text

Most visible text is in `index.html`. English is used as the main content language, with Kannada used as supporting cultural text in major sections. Edit the copy directly inside the related section.

## Google Sheets Form Setup

The contact and feedback forms are static HTML forms. To save submissions into Google Sheets, create a Google Apps Script Web App connected to a spreadsheet, deploy it, then paste the deployed Web App URL into `script.js`.

This project includes `apps-script/Code.gs`, already configured for this spreadsheet:

```text
https://docs.google.com/spreadsheets/d/1GTJUsOYQOj0Lf8wFgcTEh2bULqT431AsI6LDXPUw-kA/edit
```

The spreadsheet ID used in `apps-script/Code.gs` is:

```javascript
const SPREADSHEET_ID = "1GTJUsOYQOj0Lf8wFgcTEh2bULqT431AsI6LDXPUw-kA";
```

### Apps Script Deployment

1. Open the Google Sheet.
2. Go to **Extensions > Apps Script**.
3. Paste the contents of `apps-script/Code.gs` into the Apps Script editor.
4. Save the project.
5. Click **Deploy > New deployment**.
6. Choose **Web app**.
7. Set **Execute as** to **Me**.
8. Set **Who has access** to **Anyone**.
9. Deploy and copy the Web App URL ending in `/exec`.

In `script.js`, replace:

```javascript
const SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
```

with your deployed Apps Script Web App URL:

```javascript
const SCRIPT_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

The site stays fully static. Google Sheets saving works because the browser posts JSON to the Apps Script Web App, and Apps Script writes that data into the spreadsheet.

The Apps Script will create two tabs if they do not already exist:

- `Contact Messages`
- `Feedback`

Expected contact payload:

```javascript
{
  formType: "contact",
  name: "...",
  phone: "...",
  email: "...",
  message: "..."
}
```

Expected feedback payload:

```javascript
{
  formType: "feedback",
  name: "...",
  place: "...",
  rating: "...",
  feedback: "..."
}
```

## Local Preview

Because this is a plain static site, you can open `index.html` directly in a browser. For the closest GitHub Pages-style preview, run a simple static server from the project folder:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deploying on GitHub Pages

1. Push this folder to a GitHub repository.
2. Open the repository settings on GitHub.
3. Go to **Pages**.
4. Set the source to the main branch and root folder.
5. Save the settings.
6. GitHub will publish the static site after the Pages build completes.

No backend server, framework, package install, or build step is required.

## Maps Link

The Visit button and footer Google Maps link currently point to:

```text
https://share.google/qg2zh8csfG2j6T6Hn
```
