# Local design studies

Three isolated static design options for Jensen's site:

- `editorial/`: warm paper and serif typography.
- `atelier/`: white, cobalt, and a structured sans-serif layout.
- `nocturne/`: charcoal, cream, and sage.

Each option includes a homepage, essay archive, and the full *Two Brains, One Operator* reading page. Other content links to the existing site. Atelier was selected and applied to the main site; these folders preserve the original comparison studies. No dependencies or build step are required.

From the repository root, run `python3 -m http.server 8766 --bind 0.0.0.0`, then open <http://localhost:8766/design-previews/>. Binding to all interfaces also allows a phone on the same network to connect using the computer's LAN address.

The comparison page includes captured desktop and phone screenshots. Open each option to interact with it. These screenshots are snapshots, so regenerate them if the designs change.

Unused folders and their screenshots can be removed independently. The main site uses its own shared styles and does not depend on these previews.
