# AGENTS.md

## Project: Ziki Human Approval Cards Prototype

You are an implementation agent. Create the entire repository described in this file. Do not assume that another agent has created files, installed dependencies, configured a framework, or supplied content. Start from an empty directory and produce a complete, runnable static website.

The goal is to propose and demonstrate an improvement to Ziki's human-agent interaction:

> Agents should prepare evidence-backed action proposals, while humans can review, edit, approve, reject, or request more evidence before high-impact actions are executed.

This is a product-concept prototype. It must not claim to connect to Ziki's production API. Use illustrative local data only and label the prototype as a demo wherever appropriate.

---

## 1. Required output

Create exactly this minimum repository structure:

```text
ziki-human-approval-cards/
├── AGENTS.md
├── README.md
├── index.html
├── proposal.html
├── styles.css
└── app.js
```

You may add an `assets/` directory only if an asset is genuinely needed. Prefer CSS and inline SVG over external images. Do not add a build system, package manager, backend, database, framework, or external runtime dependency unless it is essential. The prototype must work by opening `index.html` directly or by serving the folder with a basic static HTTP server.

Do not create placeholder files. Every required file must contain finished, coherent content.

---

## 2. Product name and visual direction

Use this product name throughout the prototype:

**Ziki Human Approval Cards**

Use a calm, professional dashboard visual style:

- Light neutral page background.
- White cards with subtle borders and shadows.
- Dark navy or charcoal text.
- One clear accent color for primary actions.
- Green for approved/safe states.
- Amber for waiting or medium-risk states.
- Red only for rejection or high-risk warnings.
- Rounded cards, but do not make the interface look like a marketing landing page.
- Use accessible contrast.
- Use a responsive layout that works on desktop and mobile widths.

The interface should resemble a productivity tool used by a person supervising agents, not a generic AI chat screen.

Use system fonts or a robust font stack. Do not rely on a remote font provider.

---

## 3. Required pages and navigation

Create two linked pages:

### 3.1 `index.html`

This is the interactive prototype dashboard.

It must contain:

1. A top navigation bar with:
   - Product name: `Ziki`.
   - Current area label: `Human approval center`.
   - A visible status indicator saying `Prototype · illustrative data`.
   - A `Reset demo` button.

2. A prominent summary area showing:
   - `Waiting on you`.
   - A numeric count of pending actions.
   - A smaller count of blocking actions.
   - Supporting text explaining that the cards below are proposed agent actions awaiting human review.

3. A filter row with buttons or tabs:
   - `All`.
   - `Blocking`.
   - `Low risk`.
   - `Approved`.
   - `Rejected`.

4. A list or grid of approval cards. At least five cards must be visible in the initial state.

5. A link to `proposal.html` labelled `Read the proposal`.

### 3.2 `proposal.html`

This is the written product proposal. It must be readable without JavaScript.

Include these sections:

1. Title and one-sentence pitch.
2. The problem.
3. What Ziki already does well.
4. Where human-agent interaction breaks down.
5. The proposed Human Approval Card model.
6. Card anatomy.
7. Approval flow.
8. Risk and reversibility rules.
9. Audit trail.
10. Example user walkthrough.
11. Implementation approach.
12. Out of scope.
13. Acceptance criteria.
14. Link back to the interactive prototype.

Add a small note near the top:

> This is an illustrative prototype. Names, numbers, issue IDs, evidence, and outcomes are demo data and are not connected to Ziki production systems.

---

## 4. Required approval-card scenarios

The initial dashboard must include these five scenarios. Use different agents, roles, actions, risk levels, and outcomes.

### Card A: Independent validation

- Agent: `Alex`
- Role: `Reviewer`
- Issue: `#1151`
- Action: `Submit real/accept validation`
- Risk: `Low`
- Blocking: `No`
- Evidence:
  - Two different default Google client IDs exist in `AppConfig`.
  - The constructor and environment fallback return different values.
- Required permission: `Reviewer`
- Expected impact: `Adds one independent validation; may move the issue toward confirmation.`
- Primary action: `Approve validation`

### Card B: Solution bid

- Agent: `Seraphine`
- Role: `Contributor`
- Issue: `#1151`
- Action: `Submit solution bid`
- Risk: `Medium`
- Blocking: `No`
- Evidence:
  - The issue has a clear reproduction and acceptance criteria.
  - The agent has identified the affected configuration file.
- Required permission: `Contributor`
- Expected impact: `Creates an open bid for the agent owner's account.`
- Primary action: `Approve bid`

### Card C: Claim or ownership-sensitive action

- Agent: `Ryan`
- Role: `Triager`
- Issue: `#520`
- Action: `Clear a duplicate report`
- Risk: `High`
- Blocking: `Yes`
- Evidence:
  - The report appears to duplicate an already confirmed issue.
  - The proposed action changes the report's triage state.
- Required permission: `Triager`
- Expected impact: `May close or de-prioritize a report and affect another contributor's work.`
- Primary action: `Review evidence`
- Do not make this action execute immediately. It should open the detail drawer first.

### Card D: Pull-request link

- Agent: `Nexora`
- Role: `Contributor`
- Issue: `#756`
- Action: `Link a completed pull request`
- Risk: `High`
- Blocking: `Yes`
- Evidence:
  - A pull request URL is available.
  - The proposed link includes the branch and commit SHA.
  - The change is ready for maintainer review.
- Required permission: `Contributor` with an active claim.
- Expected impact: `Makes the fix reviewable and may move the task into review-ready state.`
- Primary action: `Review PR link`

### Card E: Completed action

- Agent: `Orca`
- Role: `Contributor`
- Issue: `#700`
- Action: `Deliver completed test evidence`
- Risk: `Low`
- Blocking: `No`
- Evidence:
  - Test command completed successfully.
  - The result includes a short test summary.
- Required permission: `Contributor`
- Expected impact: `Adds evidence to the issue audit trail.`
- Primary action: `View evidence`
- This card should demonstrate a completed or informational state rather than a pending approval.

Do not use real credentials, real API tokens, or private repository URLs in the prototype.

---

## 5. Required card content

Every pending approval card must visibly show:

- Agent avatar or initials.
- Agent name.
- Agent role.
- Issue number and issue title.
- Proposed action.
- Risk badge.
- Blocking/non-blocking status.
- A concise reason.
- Evidence summary.
- Required permission.
- Expected impact.
- Reversibility label:
  - `Reversible` for low-risk informational actions.
  - `Reviewable` for actions that can be audited or superseded.
  - `Hard to reverse` for ownership, claim, triage, or public-link changes.
- Timestamp such as `8 minutes ago`.
- Primary action button.
- Secondary `Reject` button for pending cards.

Avoid displaying long paragraphs inside cards. Use an expandable detail view for full evidence.

---

## 6. Required interactions

Implement all interactions in plain JavaScript in `app.js`. Do not use fake links that do nothing.

### 6.1 Filter buttons

Filtering must update the visible cards without reloading the page.

- `All`: show all cards.
- `Blocking`: show only blocking pending cards.
- `Low risk`: show only low-risk cards.
- `Approved`: show cards approved in the current demo session.
- `Rejected`: show cards rejected in the current demo session.

Update the visible count after every filter or state change.

### 6.2 Approve action

When the user clicks an approval button:

1. Open a confirmation/detail modal or side drawer.
2. Show the exact proposed action payload in readable JSON or key-value form.
3. Show the evidence and impact again.
4. Show a clear sentence:
   `This demo will not call Ziki. It only simulates the approval.`
5. Provide `Confirm approval` and `Cancel` buttons.
6. Only after `Confirm approval`:
   - Change the card status to `Approved`.
   - Add an approval event to the audit timeline.
   - Update the summary counts.
   - Show a visible success message.

Do not approve directly from a single click.

### 6.3 Reject action

When the user clicks `Reject`:

1. Open a modal or drawer.
2. Require a rejection reason from a textarea.
3. Provide example helper text:
   `Explain what the agent should change or investigate next.`
4. Require a non-empty reason before enabling `Confirm rejection`.
5. After confirmation:
   - Change the card status to `Rejected`.
   - Display the human reason on the card.
   - Add a rejection event to the audit timeline.
   - Show a visible status message.

### 6.4 Review evidence / Review PR link

For high-risk cards, the primary action must open details first rather than approving immediately.

The detail view must show:

- Evidence items.
- Proposed payload.
- Permission check.
- Risk explanation.
- Reversibility explanation.
- A warning if the action affects claims, issue state, ownership, or public links.
- `Approve` and `Reject` controls.

### 6.5 Request more evidence

The detail view must include a `Request more evidence` button.

When clicked:

1. Show a textarea.
2. Require the human to describe what is missing.
3. On submit, change the card status to `More evidence requested`.
4. Add the request to the audit timeline.
5. Do not mark the card approved or rejected.

### 6.6 Reset demo

`Reset demo` must restore all cards, filters, audit entries, counts, and messages to their initial state without reloading the page.

### 6.7 Keyboard and accessibility behavior

- All buttons must be real `<button>` elements.
- Modals/drawers must be closable with `Escape`.
- Modal controls must have accessible names.
- Focus should move into the modal when it opens and return to the triggering button when it closes where practical.
- Do not rely on color alone to communicate status.
- Use semantic headings, lists, labels, and live regions for status messages.
- Ensure keyboard users can operate every demo action.

---

## 7. Audit timeline

Add an audit timeline panel to `index.html`.

The initial timeline should contain illustrative entries such as:

- `Alex proposed an independent validation.`
- `Seraphine proposed a solution bid.`
- `Ryan requested human review before clearing a duplicate.`
- `Nexora prepared a pull-request link.`

After the user approves, rejects, or requests more evidence, prepend a new entry with:

- Action.
- Human result.
- Agent.
- Issue.
- Relative time or `Just now`.

Label the panel:

`Demo audit trail — simulated locally; no Ziki request is sent.`

---

## 8. Proposal content requirements

`proposal.html` must explain the following clearly in plain English.

### Problem

Ziki supports agents with different roles and permissions, but a human may not understand exactly what an agent is about to do before the action changes bids, validations, claims, ownership, issue state, or public project links.

### Core proposal

Introduce a structured Human Approval Card for meaningful state-changing actions. The card is a reviewable contract between the agent and human.

### Approval card fields

Explain these fields:

- Agent identity.
- Agent role.
- Proposed action.
- Exact payload.
- Evidence.
- Required permission.
- Risk.
- Expected impact.
- Reversibility.
- Expiry.

### Action classes

Explain that:

- Read-only actions can run immediately.
- Low-risk reversible actions may use optional approval.
- High-impact actions require explicit approval.
- Actions involving claims, ownership, points, public links, or issue state require explicit approval.

### Auditability

Every proposal and decision should be recorded with the original proposal, human edits, final payload, approver, timestamp, and resulting API response.

### Safety rules

Include these rules:

- The approved payload must match what the human saw.
- An expired approval cannot execute.
- An agent cannot approve its own proposal.
- A human rejection must include a reason.
- Batch approval must be limited to clearly equivalent actions.
- Read-only access must remain available without unnecessary friction.

### Out of scope

State explicitly that this prototype does not implement:

- Real Ziki authentication.
- Real API calls.
- Real GitHub operations.
- Real claims, bids, points, or issue updates.
- Production persistence.
- Automatic agent training or long-term memory.

### Acceptance criteria

Include a checklist with at least:

- [ ] Humans can see what an agent wants to do before execution.
- [ ] The card identifies the agent and role.
- [ ] Evidence and exact payload are visible.
- [ ] Risk and reversibility are visible.
- [ ] High-impact actions require explicit confirmation.
- [ ] Humans can approve, reject with a reason, or request more evidence.
- [ ] The demo records decisions in a local audit timeline.
- [ ] The prototype is usable by keyboard and screen-reader users.
- [ ] The prototype clearly states that it uses illustrative data.

---

## 9. README requirements

Write a useful `README.md` containing:

1. Project title.
2. One-paragraph summary.
3. Screenshot or preview instructions, if a screenshot exists.
4. How to run locally.
5. How to use the demo.
6. What is simulated.
7. What is intentionally out of scope.
8. Suggested GitHub Pages deployment steps.
9. A short file map.
10. A note that all names, issue IDs, evidence, and outcomes are illustrative.

Local run instructions must include both methods:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Also state that opening `index.html` directly is supported, although a local server is preferred.

---

## 10. Technical constraints

- Use only HTML, CSS, and vanilla JavaScript.
- Do not use React, Vue, Svelte, Angular, Tailwind, Bootstrap, or a bundler.
- Do not use external CDNs.
- Do not use external API calls.
- Do not store or request credentials.
- Do not include real GitHub tokens, Ziki keys, cookies, or secrets.
- Keep all demo data in `app.js` or clearly marked static HTML data.
- Use `textContent` rather than unsafe `innerHTML` for user-entered rejection reasons.
- Keep JavaScript organized into small functions.
- Avoid inline `onclick` handlers; register event listeners in `app.js`.
- Keep the prototype deterministic and usable offline.

---

## 11. Testing and quality checks

Before declaring the repository complete, perform all applicable checks:

1. Verify every required file exists.
2. Run a local static server:

   ```bash
   python3 -m http.server 8000
   ```

3. Open `http://localhost:8000/` in a browser if browser tooling is available.
4. Test:
   - Initial dashboard renders.
   - Five required scenarios appear.
   - Every filter works.
   - Approve requires confirmation.
   - Reject requires a reason.
   - Request-more-evidence requires text.
   - High-risk cards open detail view.
   - Reset demo restores the initial state.
   - Escape closes dialogs.
   - Keyboard navigation reaches all controls.
   - Proposal page links back to the demo.
5. Check browser console for errors.
6. Check all links.
7. Check responsive layout at approximately 375px, 768px, and 1440px widths.
8. Search the repository for accidental secrets:

   ```bash
   grep -RInE 'ziki_[A-Za-z0-9_-]+|github_pat_|ghp_[A-Za-z0-9_]+|BEGIN (RSA|OPENSSH|EC) PRIVATE KEY' . --exclude=AGENTS.md
   ```

   The command must return no real credentials.
9. Run a basic JavaScript syntax check if Node.js is available:

   ```bash
   node --check app.js
   ```

10. Review the final diff and remove unused files, debug logging, and fake production claims.

---

## 12. Suggested implementation order

Follow this order exactly unless a concrete technical reason requires a change:

1. Create the directory and required files.
2. Write the static HTML structure for the dashboard.
3. Write the proposal page.
4. Add the CSS layout, responsive behavior, badges, cards, modal, drawer, and timeline.
5. Add the local demo data.
6. Add filtering and summary-count logic.
7. Add modal, approval, rejection, evidence-request, and reset interactions.
8. Add keyboard and accessibility behavior.
9. Write the README.
10. Run all checks in Section 11.
11. Fix every console error and broken interaction.
12. Only then prepare the repository for GitHub Pages.

---

## 13. Final completion report

At the end, report:

- Files created.
- How the prototype is run locally.
- Which interactions were tested.
- Whether browser testing was performed.
- Whether `node --check app.js` passed.
- Whether a screenshot or hosted preview was created.
- Any limitations that remain.

Do not claim that a PR, GitHub Pages deployment, Ziki proposal, or production integration exists unless it was actually completed and the exact URL is available.
