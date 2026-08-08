# AGENTS.md — jensenloke.github.io

## Repository purpose

Jensen Loke's personal site and blog, organized into **five research tracks** plus cross-cutting catalogues. Published via **GitHub Pages** directly from the repo root (`.nojekyll` present — files are served as-is, no Jekyll processing). The site is the narrative layer over the work; content cross-links to repositories at `github.com/jensenloke` and back.

**No build step, no package manager, no tests, no frameworks.** Everything is hand-written static HTML/CSS. Do not introduce build tools, generators, or dependencies.

## Research tracks (the top-level taxonomy)

| Track | Directory | Scope |
| --- | --- | --- |
| Success IT Engineering (blog) | `engineering/` | CodeGraph, `.claude` pattern linting, agentic engineering practice |
| Book Reviews | `reviews/` | Victor Dibia, knowledge graph books, AI/systems books |
| Building a Second Brain (research) | `second-brain/` | Personal + corporate second brains; **knowledge graph research papers are published and listed underneath this track** |
| Local Models & Harnesses | `local-models/` | Local model reviews, agent harness reviews |
| Qwen | `qwen/` | Dedicated Qwen section. Jensen is a **Qwen event ambassador for Singapore** — ambassador content lives here |

Cross-cutting pages (not tracks):
- `talks/index.html` — master catalogue of every presentation, including talks whose materials live only on GitHub. Hosted decks live in `talks/<talk-slug>/` as fully self-contained folders (custom vanilla-JS slide deck — absolute-positioned `.slide` elements toggled via `.active`; not reveal.js or any library) with their own media.
- `work/index.html` — open catalogue of work across fields; cards/rows link to GitHub repos and related site content.
- `papers/` — paper storage + template. Papers are flat files `papers/<slug>.html` (abstract + numbered sections + references + related); start from `papers/template.html`. KG papers are listed both in `papers/index.html` and under `second-brain/index.html`.
- `writing/index.html` — archive of all articles across tracks.

## Conventions

- **Every article belongs to exactly one track** and lives inside that track's directory: `engineering/<slug>.html`, `reviews/<slug>.html`, `second-brain/<slug>.html`, `local-models/<slug>.html`, `qwen/<slug>.html`. Papers stay flat in `papers/`.
- Nav on all non-deck pages: Engineering · Reviews · Second Brain · Local Models · Qwen · Talks · GitHub (external).
- **Cross-linking is the architecture:** every article/talk/paper links to its sibling content and repos ("Related" section at the end); track pages carry `inline-links` to related tracks; the article kicker states its track.
- Track index pages carry an HTML comment marking where new entries go (newest first). Empty tracks show an `.empty-note` describing what is planned.
- Talk media lives in `talks/<talk-slug>/public-assets/` and must be **safe to publish publicly**. Confidential screenshots (e.g. internal product UI) are deliberately excluded — don't pull media in from outside the repo.
- Plain semantic HTML with accessibility attributes (aria-labels, landmarks); system font stacks only, no web fonts.
- `assets/styles.css` is the shared design system (mint/teal/slate palette, Inter/system font stack, 8px radii) for homepage, tracks, indexes, articles, and papers. Talk decks keep their styles inline.

## Workflow

- **Preview:** open the file in a browser, or `python3 -m http.server` from the repo root.
- **Publish:** commit and push to `main`; GitHub Pages serves it. There is no CI or deploy script.
- **New article:** create `<track>/<slug>.html`, add an entry to that track's `index.html` (newest first), add it to `writing/index.html`, and update the homepage featured card if it is the latest.
- **New paper:** copy `papers/template.html` → `papers/<slug>.html`; add entries to `papers/index.html` and, for KG research, to `second-brain/index.html`.
- **New talk:** add an entry to `talks/index.html`; if the deck is hosted here, add the self-contained folder `talks/<slug>/` too.
- **New work/repo:** add a card or compact row to `work/index.html`.

## Gotchas

- Homepage featured article/talk and the Research-tracks grid are hand-maintained in `index.html` — keep them in sync when publishing new content.
- Talk decks are large single-file HTML documents (~1.5k lines) in presentation mode with no site chrome — edit by locating slide sections; don't add site nav to them.
- Work catalogue entries are sourced from real repos on `github.com/jensenloke` — verify repos still exist before linking; descriptions should stay factual.
- Qwen ambassador statements are Jensen's own claims; keep the wording on `qwen/` consistent with the homepage track card.
