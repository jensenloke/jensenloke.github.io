# Jensen Loke

Static personal site and blog served with GitHub Pages, organized into five
research tracks: **Success IT Engineering** (blog), **Book Reviews**,
**Building a Second Brain** (research, with knowledge graph papers published
underneath it), **Local Models & Harnesses**, and **Qwen** — plus cross-cutting
catalogs for talks, trainings, work (linked to GitHub repositories), and papers.

## Local Preview

Open `index.html` in a browser, or serve the folder with any static file server
(e.g. `python3 -m http.server`).

## Adding Articles

1. Add a new HTML file inside its track directory (`engineering/`, `reviews/`,
   `second-brain/`, `local-models/`, or `qwen/`).
2. Add an entry to that track's `index.html` (newest first).
3. Add an entry to `writing/index.html`.
4. Update the featured card on `index.html` if it is the latest article.
5. Reuse `assets/styles.css` for shared layout and article components.

## Adding Talks

1. Add an entry to the master catalogue in `talks/index.html` — this covers every
   presentation, including ones whose materials live only on GitHub.
2. If the deck is hosted here, add a self-contained presentation under
   `talks/<talk-slug>/` and keep public-safe media inside that talk folder.
3. Link the presentation from the catalogue entry.

## Adding Trainings

1. Add an entry to `trainings/index.html` (newest first).
2. Link to the hosted training site or repository.
3. Link to related talks or writing where they exist.

## Adding Work

1. Add a card or compact row to `work/index.html` linking to the repository.
2. Link to related writing, talks, or papers on this site where they exist.

## Adding Papers

1. Copy `papers/template.html` to `papers/<paper-slug>.html` and fill it in.
2. Add an entry to `papers/index.html` (newest first).
3. For knowledge graph research, also add the entry to `second-brain/index.html`.

This site intentionally has no build step.
