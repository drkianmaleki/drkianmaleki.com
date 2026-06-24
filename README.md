# Kian Maleki Website — Phase 2 Static Site

This folder contains a complete static website update for `drkianmaleki.com`.

## Files

- `index.html` — main homepage
- `styles.css` — full visual styling
- `scripts.js` — weekly phrase rotation, mobile navigation, current year
- `resume.html` — redirects to the Data Scientist resume PDF
- `cv.html` — redirects to the Academic CV PDF
- `CNAME` — GitHub Pages custom domain
- `documents/` — resume/CV PDFs
- `assets/` — profile image and visual assets

## Run locally

Open `index.html` directly in your browser.

For a cleaner local test, run one of these commands inside this folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Push to GitHub

Copy these files into your website repository, then run:

```bash
git add .
git commit -m "Update website appearance and content"
git push
```

GitHub Pages should update the live website after the push.
