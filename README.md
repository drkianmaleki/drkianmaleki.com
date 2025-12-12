# Kian Maleki — Portfolio

This repository contains a minimal, responsive static portfolio website for Kian Maleki. The site is a single-page HTML/CSS project with a small JavaScript helper to power accessible skill-tag filtering and a projects demo.

What's included
- `index.html` — the full site (hero, about, skills, CV, projects, contact/footer)
- `styles.css` — styles and responsive layout
- `scripts.js` — accessible skill-tag keyboard interactions and project filtering
- `Portfolio_photo.jpg` — Hero portrait (replace with your preferred image)

Branching
- Active feature work is on the branch `feature/index-improvements`. Merge the branch into `main` when ready.

Run / Preview locally
1. Open `index.html` directly in your browser (double-click). This works for most previews.
2. For a local server (recommended for proper relative-path handling):

```powershell
# from the repository root
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Notes for maintainers
- Skill tags are implemented as accessible `<button>` elements with `aria-pressed` state and keyboard support (Enter/Space). See `scripts.js` for the filter implementation.
- Project cards use a `data-skills` attribute for filtering; ensure the skill names match the `data-skill` values on tags.
- SVG placeholders are used for skill icons to avoid third-party licensing issues. Replace with licensed icons if desired.

How to contribute
- Fork the repository and open a pull request against `main` (or open a PR from the feature branch). Keep changes focused and include a short summary of edits.

License
- The repository does not include a license file. Add `LICENSE` if you want to permit reuse.

Questions or updates
- If you'd like me to: add multi-select filtering, ARIA live announcements for screen readers, or connect the projects list to the GitHub API, say which and I'll implement it.

-- Kian Maleki
