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

Cross-cutting pages (not tracks). The nav groups everything as **Essays · Talks & Trainings · GitHub**: the four tracks above sit under the Essays hub; talks and trainings share one merged catalogue page. Qwen ambassador content is folded into the Essays archive (tagged *Qwen*) rather than a standalone track.
- `essays/index.html` — the Essays hub: one flat, searchable archive of every published long-form piece (articles and papers together, newest first) with dates, format/track tags, and excerpts, plus a pipeline section for planned work. Track pages remain the home of roadmaps and per-track context.
- `talks/index.html` — "Talks & Trainings": one merged catalogue — Conference talks / Meetups & briefings / Classes & training sites (`#trainings`) / Archives & materials on GitHub. Event-presentation decks live in `talks/<talk-slug>/` as fully self-contained folders (custom vanilla-JS slide deck — absolute-positioned `.slide` elements toggled via `.active`; not reveal.js or any library) with their own media.
- `trainings/index.html` — redirect stub to `talks/#trainings`. Deck-based classes are still hosted under `trainings/<slug>/` (self-contained, same deck pattern as talks); only the catalogue page moved.
- `work/index.html` — open catalogue of work across fields; cards/rows link to GitHub repos and related site content.
- `papers/` — holds only `papers/template.html` (abstract + numbered sections + references + related). Finished papers live flat in `essays/<slug>.html` alongside articles; there is no separate papers index.

## Conventions

- **Every article belongs to exactly one track** and lives inside that track's directory: `engineering/<slug>.html`, `reviews/<slug>.html`, `second-brain/<slug>.html`, `local-models/<slug>.html`. Papers live flat in `essays/` (start from `papers/template.html`). Everything long-form is listed once, in `essays/index.html`; Qwen ambassador pieces are tagged *Qwen* there.
- Nav on all non-deck pages: Essays · Talks & Trainings · Projects (external links live in footers and hero socials). "Essays" is `aria-current` on the essays hub, all four track indexes, and article/paper pages; "Talks & Trainings" on `talks/`; "Projects" on `work/`.
- **Cross-linking is the architecture:** every article/talk/paper links to its sibling content and repos ("Related" section at the end); track pages carry `inline-links` to related tracks; the article kicker states its track.
- Track index pages carry an HTML comment marking where new entries go (newest first). Empty tracks show an `.empty-note` describing what is planned.
- Talk media lives in `talks/<talk-slug>/public-assets/` and must be **safe to publish publicly**. Confidential screenshots (e.g. internal product UI) are deliberately excluded — don't pull media in from outside the repo.
- Plain semantic HTML with accessibility attributes (aria-labels, landmarks); system font stacks only, no web fonts.
- `assets/styles.css` is the shared design system (mint/teal/slate palette, Inter/system font stack, 8px radii) for homepage, tracks, indexes, articles, and papers. Talk decks keep their styles inline.

## Workflow

- **Preview:** open the file in a browser, or `python3 -m http.server` from the repo root.
- **Publish:** commit and push to `main`; GitHub Pages serves it. There is no CI or deploy script.
- **New article:** create `<track>/<slug>.html`, add an entry to that track's `index.html` (newest first), add it to `essays/index.html`, and update the homepage featured card if it is the latest.
- **New paper:** copy `papers/template.html` → `essays/<slug>.html`; add entries to `essays/index.html` (tagged *Paper*) and, for second-brain research, to `second-brain/index.html`.
- **New talk:** add an entry to `talks/index.html`; if the deck is hosted here, add the self-contained folder `talks/<slug>/` too.
- **New training:** add an entry to `trainings/index.html` (newest first). Deck-based class: host the self-contained deck under `trainings/<slug>/` and link the deck plus any handout. Training site: link the hosted site or repository and related talks/writing.
- **New work/repo:** add a card or compact row to `work/index.html`.

## Gotchas

- Homepage featured article/talk and the Research-tracks grid are hand-maintained in `index.html` — keep them in sync when publishing new content.
- Talk decks are large single-file HTML documents (~1.5k lines) in presentation mode with no site chrome — edit by locating slide sections; don't add site nav to them.
- Work catalogue entries are sourced from real repos on `github.com/jensenloke` — verify repos still exist before linking; descriptions should stay factual.
- Qwen ambassador statements are Jensen's own claims (he is also a Cognition ambassador). Ambassador identity is expressed through Qwen-tagged essays and talks; there is no standalone ambassador note on the site.
