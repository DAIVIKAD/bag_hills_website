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
    ├── bg-fog.jpg
    ├── divine-place-devi-chowdamma.jpg
    ├── monsoon-crab.jpg
    └── monsoon-mushroom.jpg
```

## Images

All images are stored in `images/` and referenced with relative paths, so the site works on GitHub Pages. Replace any image by keeping the same filename, or update the matching `src` path in `index.html`.

Recommended image dimensions:

- `hero-collage.jpg`: wide landscape, around 2400 x 1400
- `bag-rock.jpg`, `mushrooms.jpg`, `cashew-roast.jpg`: portrait or closeup images
- `honeycomb.jpg`, `trail.jpg`, `bg-forest.jpg`, `bg-fog.jpg`: landscape images

## Editing Text

Most visible text is in `index.html`. English is used as the main content language, with Kannada used as supporting cultural text in major sections. Edit the copy directly inside the related section.

## Existing Google Sheets Integration

The contact form uses the same deployed Google Apps Script and Google Sheet as the portfolio website. Do not create or deploy another Sheet or Apps Script for this form.

```javascript
const scriptURL = "https://script.google.com/macros/s/AKfycbz5I9PEO04JtZAmPm4pM2ACLcXOwSW80VI7d9CIx75LfnlwKbhyzGOtf-xzbyjsiWXDvA/exec";
```

The form submits `Name`, `email`, `Phone Number`, `Message`, and `Website` using `fetch()` with `FormData`. The lowercase `email` key matches the portfolio form. The hidden `Website` value is `Bag Hills`, allowing submissions to be identified in the shared Sheet.

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
