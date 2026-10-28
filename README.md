# Ziki Human Approval Cards

A static, dependency-free prototype of a **human approval center** for Ziki: agents prepare
evidence-backed action proposals as structured cards, and a human reviews, edits, approves,
rejects, or requests more evidence before any high-impact action is executed. The prototype
demonstrates the interaction model — confirmation steps, risk and reversibility labels, required
rejection reasons, and a local audit timeline — entirely in the browser with illustrative data.

## Preview / screenshots

No screenshot is checked in. To take one, run the demo (below), open
`http://localhost:8000/`, and capture the dashboard at desktop width; capture
`http://localhost:8000/proposal.html` for the written proposal.

## Run locally

From the project folder:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Opening `index.html` directly in a browser is also supported, although a local server is
preferred (it behaves exactly like the eventual hosted version).

## How to use the demo

1. The dashboard opens with **five cards**, four of them waiting for a decision and two of them
   blocking. Each card shows only who, what, why (one line), and risk.
2. Use `All` / `Blocking` to narrow the list. Click **Learn more** on any card for evidence,
   impact, reversibility, permission and the exact data — each one a click away.
3. On a low- or medium-risk card, press the primary button (for example **Approve validation**).
   A confirmation dialog shows the exact payload, the evidence, the impact, and a notice that the
   demo does not call Ziki. Only **Confirm approval** applies the decision.
4. Press **Reject** on any pending card. A rejection reason is required before **Confirm
   rejection** becomes available; your reason appears on the card.
5. High-risk cards (**Review evidence**, **Review PR link**) open the detail view first:
   evidence, payload, permission check, risk, reversibility, and a warning about issue state or
   public links — with `Approve`, `Reject`, and `Request more evidence` controls.
6. **Request more evidence** requires a description of what is missing and moves the card to
   *More evidence requested* without approving or rejecting it.
7. Every decision is prepended to the **Demo audit trail** panel.
8. **Reset demo** in the top bar restores cards, filters, counts, audit entries, and messages
   without reloading the page.
9. Keyboard: every control is a real `<button>`; `Escape` closes dialogs, focus moves into the
   dialog on open and returns to the triggering control on close, and status updates are
   announced through a live region.

## What is simulated

- All card data, evidence, payloads, timestamps, and outcomes are hard-coded sample data in
  `app.js` / `index.html`.
- Approve, reject, and request-more-evidence only mutate local in-memory state and append to a
  local audit timeline.
- No network requests, no storage, no credentials — the prototype works fully offline.

## Intentionally out of scope

- Real Ziki authentication.
- Real API calls.
- Real GitHub operations.
- Real claims, bids, points, or issue updates.
- Production persistence.
- Automatic agent training or long-term memory.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository (for example `ziki-human-approval-cards`).
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Pick branch `main` and folder `/ (root)`, then **Save**.
5. Wait for the check to finish; the site will be available at
   `https://<your-account>.github.io/<your-repo>/`.
6. Verify `index.html`, `proposal.html`, `styles.css`, and `app.js` all load and the demo works
   on the published URL.

## File map

```text
ziki-human-approval-cards/
├── AGENTS.md       # Task specification
├── README.md       # This file
├── index.html      # Interactive approval-center dashboard
├── proposal.html   # Written product proposal (readable without JavaScript)
├── styles.css      # All styling: layout, badges, cards, dialog, timeline, responsive rules
└── app.js          # Demo data, filters, counts, dialog interactions, audit timeline, reset
```

## Note

All names, issue IDs, evidence, and outcomes are illustrative. The prototype is a demo and is
not connected to Ziki production systems.
