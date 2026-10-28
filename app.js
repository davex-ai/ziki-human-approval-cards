/**
 * Ziki Human Approval Cards — interactive demo logic.
 *
 * Everything in this file runs locally in the browser against the sample
 * data below. No network requests, no credentials, no storage.
 */

'use strict';

/* ============================================================
 * 1. Demo data (illustrative only)
 * ============================================================ */

const DEMO_CARDS = [
  {
    id: 'card-a',
    agent: 'Alex',
    initials: 'AL',
    role: 'Reviewer',
    issue: '#1151',
    issueTitle: 'Default Google client ID differs between AppConfig and env fallback',
    action: 'Submit real/accept validation',
    risk: 'Low',
    blocking: false,
    reason: 'The default client ID disagrees between the constructor and the environment fallback.',
    evidence: [
      'Two different default Google client IDs exist in AppConfig.',
      'The constructor and environment fallback return different values.'
    ],
    permission: 'Reviewer',
    permissionCheck: 'Role Reviewer matches the required permission Reviewer.',
    impact: 'Adds one independent validation; may move the issue toward confirmation.',
    reversibility: 'Reversible',
    reversibilityNote: 'Reversible — another reviewer can submit a different validation at any time.',
    riskNote: 'Low risk — an independent validation is informational and changes no ownership or state.',
    warning: null,
    payload: {
      action: 'validation.submit',
      issue: '#1151',
      mode: 'real_accept',
      verdict: 'confirmed',
      note: 'Independent check of the default Google client ID mismatch'
    },
    primaryLabel: 'Approve validation',
    timestamp: '8 minutes ago',
    status: 'pending'
  },
  {
    id: 'card-b',
    agent: 'Seraphine',
    initials: 'SE',
    role: 'Contributor',
    issue: '#1151',
    issueTitle: 'Default Google client ID differs between AppConfig and env fallback',
    action: 'Submit solution bid',
    risk: 'Medium',
    blocking: false,
    reason: 'Reproduction and acceptance criteria are clear, and the affected config file is identified.',
    evidence: [
      'The issue has a clear reproduction and acceptance criteria.',
      'The agent has identified the affected configuration file.'
    ],
    permission: 'Contributor',
    permissionCheck: 'Role Contributor matches the required permission Contributor.',
    impact: 'Creates an open bid for the agent owner’s account.',
    reversibility: 'Reviewable',
    reversibilityNote: 'Reviewable — the bid can be audited, withdrawn, or superseded by another bid.',
    riskNote: 'Medium risk — the bid is visible to others but does not change issue state.',
    warning: null,
    payload: {
      action: 'bid.submit',
      issue: '#1151',
      role: 'Contributor',
      points: 40,
      summary: 'Fix default Google client ID mismatch in AppConfig'
    },
    primaryLabel: 'Approve bid',
    timestamp: '21 minutes ago',
    status: 'pending'
  },
  {
    id: 'card-c',
    agent: 'Ryan',
    initials: 'RY',
    role: 'Triager',
    issue: '#520',
    issueTitle: 'Notification preferences are not saved (reported as duplicate of #418)',
    action: 'Clear a duplicate report',
    risk: 'High',
    blocking: true,
    reason: 'The report looks like a duplicate of a confirmed issue and the action changes triage state.',
    evidence: [
      'The report appears to duplicate an already confirmed issue.',
      'The proposed action changes the report’s triage state.'
    ],
    permission: 'Triager',
    permissionCheck: 'Role Triager matches the required permission Triager.',
    impact: 'May close or de-prioritize a report and affect another contributor’s work.',
    reversibility: 'Hard to reverse',
    reversibilityNote: 'Hard to reverse — undoing a triage change needs a separate action and can mislead another contributor in the meantime.',
    riskNote: 'High risk — the action changes issue state that other people rely on.',
    warning: 'This action changes issue triage state and may affect another contributor’s work on the report.',
    payload: {
      action: 'report.clear',
      issue: '#520',
      reason: 'duplicate_of #418',
      new_state: 'cleared',
      notify: true
    },
    primaryLabel: 'Review evidence',
    timestamp: '34 minutes ago',
    status: 'pending'
  },
  {
    id: 'card-d',
    agent: 'Nexora',
    initials: 'NE',
    role: 'Contributor',
    issue: '#756',
    issueTitle: 'Silent failure when linking an external account',
    action: 'Link a completed pull request',
    risk: 'High',
    blocking: true,
    reason: 'The fix is ready for maintainer review and needs its pull request linked to the issue.',
    evidence: [
      'A pull request URL is available.',
      'The proposed link includes the branch and commit SHA.',
      'The change is ready for maintainer review.'
    ],
    permission: 'Contributor with an active claim',
    permissionCheck: 'Role Contributor with an active claim matches the required permission.',
    impact: 'Makes the fix reviewable and may move the task into review-ready state.',
    reversibility: 'Hard to reverse',
    reversibilityNote: 'Hard to reverse — a public link is seen by others as soon as it is posted.',
    riskNote: 'High risk — the link is public and moves the issue into a review-ready state.',
    warning: 'This action posts a public link to the project and changes the issue’s review state.',
    payload: {
      action: 'pull_request.link',
      issue: '#756',
      pull_request_url: 'https://github.com/your-org/ziki-demo/pull/842',
      branch: 'fix/account-link-silent-failure',
      commit_sha: '3f9c2a1d5b7e8406'
    },
    primaryLabel: 'Review PR link',
    timestamp: '12 minutes ago',
    status: 'pending'
  },
  {
    id: 'card-e',
    agent: 'Orca',
    initials: 'OR',
    role: 'Contributor',
    issue: '#700',
    issueTitle: 'Settings save flow lacks regression coverage',
    action: 'Deliver completed test evidence',
    risk: 'Low',
    blocking: false,
    reason: 'The test run finished and produced a summary for the audit trail.',
    evidence: [
      'Test command completed successfully.',
      'The result includes a short test summary.'
    ],
    permission: 'Contributor',
    permissionCheck: 'Role Contributor matches the required permission Contributor.',
    impact: 'Adds evidence to the issue audit trail.',
    reversibility: 'Reversible',
    reversibilityNote: 'Reversible — evidence stays part of the record and can be annotated or corrected.',
    riskNote: 'Low risk — this card is informational and changes no issue state.',
    warning: null,
    payload: {
      action: 'test_evidence.deliver',
      issue: '#700',
      command: 'npm test -- --filter settings',
      result: 'passed',
      summary: '24 passed, 0 failed'
    },
    primaryLabel: 'View evidence',
    timestamp: '1 hour ago',
    status: 'completed'
  }
];

const DEMO_TIMELINE = [
  {
    kind: 'proposed',
    tag: 'Proposed',
    text: 'Alex proposed an independent validation.',
    meta: 'Alex · Reviewer · #1151 · 16 minutes ago'
  },
  {
    kind: 'proposed',
    tag: 'Proposed',
    text: 'Seraphine proposed a solution bid.',
    meta: 'Seraphine · Contributor · #1151 · 24 minutes ago'
  },
  {
    kind: 'proposed',
    tag: 'Requested review',
    text: 'Ryan requested human review before clearing a duplicate.',
    meta: 'Ryan · Triager · #520 · 36 minutes ago'
  },
  {
    kind: 'proposed',
    tag: 'Prepared',
    text: 'Nexora prepared a pull-request link.',
    meta: 'Nexora · Contributor · #756 · 18 minutes ago'
  },
  {
    kind: 'evidence',
    tag: 'Evidence delivered',
    text: 'Orca delivered completed test evidence.',
    meta: 'Orca · Contributor · #700 · 1 hour ago'
  }
];

const STATUS_LABELS = {
  pending: 'Pending review',
  approved: 'Approved',
  rejected: 'Rejected',
  more_evidence: 'More evidence requested',
  completed: 'Completed'
};

const DEMO_NOTICE = 'This demo will not call Ziki. It only simulates the approval.';

/* ============================================================
 * 2. State
 * ============================================================ */

let state = null;
let lastFocusedElement = null;
let lastFocusedCardId = null;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createInitialState() {
  return {
    cards: clone(DEMO_CARDS),
    timeline: clone(DEMO_TIMELINE),
    filter: 'all',
    modal: null,
    message: ''
  };
}

function findCard(cardId) {
  return state.cards.find(function (card) { return card.id === cardId; }) || null;
}

/* ============================================================
 * 3. Element helpers
 * ============================================================ */

function byId(id) {
  return document.getElementById(id);
}

function makeElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (typeof text === 'string') node.textContent = text;
  return node;
}

function makeButton(label, className, onClick) {
  const button = makeElement('button', className, label);
  button.type = 'button';
  button.addEventListener('click', onClick);
  return button;
}

function makeBlock(title, nodes) {
  const block = makeElement('div', 'detail-block');
  block.appendChild(makeElement('h3', null, title));
  nodes.forEach(function (node) { block.appendChild(node); });
  return block;
}

function makeFold(title, nodes) {
  const fold = makeElement('details', 'fold');
  fold.appendChild(makeElement('summary', null, title));
  nodes.forEach(function (node) { fold.appendChild(node); });
  return fold;
}

function makeEvidenceList(items) {
  const list = makeElement('ul', 'evidence-list');
  items.forEach(function (item) {
    list.appendChild(makeElement('li', null, item));
  });
  return list;
}

function makePayloadPre(payload) {
  const pre = makeElement('pre', 'payload');
  pre.textContent = JSON.stringify(payload, null, 2);
  return pre;
}

/* ============================================================
 * 4. Filtering, counts, and rendering
 * ============================================================ */

function getVisibleCards() {
  return state.cards.filter(function (card) {
    switch (state.filter) {
      case 'blocking':
        return card.blocking && card.status === 'pending';
      case 'low':
        return card.risk === 'Low';
      case 'approved':
        return card.status === 'approved';
      case 'rejected':
        return card.status === 'rejected';
      case 'all':
      default:
        return true;
    }
  });
}

function updateCounts() {
  const pending = state.cards.filter(function (card) { return card.status === 'pending'; });
  const blocking = pending.filter(function (card) { return card.blocking; });
  const visible = getVisibleCards();

  byId('pending-count').textContent = String(pending.length);
  byId('blocking-count').textContent = String(blocking.length);
  byId('visible-count').textContent =
    'Showing ' + visible.length + ' of ' + state.cards.length + ' cards';
}

function updateFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(function (button) {
    const active = button.dataset.filter === state.filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function showStatus(text, toneClass) {
  const region = byId('status-message');
  region.textContent = text;
  region.className = 'status-message' + (toneClass ? ' ' + toneClass : '');
  state.message = text;
}

function statusBadgeClass(status) {
  return 'badge badge-status-' + status;
}

function riskClass(risk) {
  return 'meta-risk-' + risk.toLowerCase();
}

function buildCard(card) {
  const article = makeElement('article', 'card risk-' + card.risk.toLowerCase());
  article.classList.add('is-' + card.status.replace('_', '-'));
  article.dataset.id = card.id;

  /* Header: avatar, name, role, status */
  const head = makeElement('div', 'card-head');
  head.appendChild(makeElement('span', 'avatar', card.initials)).setAttribute('aria-hidden', 'true');
  const who = makeElement('span', 'card-who');
  who.appendChild(makeElement('p', 'agent-name', card.agent));
  who.appendChild(makeElement('p', 'agent-role', card.role));
  head.appendChild(who);
  head.appendChild(makeElement('span', statusBadgeClass(card.status), STATUS_LABELS[card.status]));
  article.appendChild(head);

  /* Proposed action */
  article.appendChild(makeElement('h3', 'action-title', card.action));

  /* One-line reason */
  article.appendChild(makeElement('p', 'card-reason', card.reason));

  /* Only the two things a first-timer needs at a glance */
  const badges = makeElement('div', 'badge-row');
  badges.appendChild(makeElement('span', 'badge ' + riskClass(card.risk), 'Risk: ' + card.risk));
  if (card.blocking) {
    badges.appendChild(makeElement('span', 'badge meta-blocking', 'Blocking'));
  }
  article.appendChild(badges);

  /* Rejection reason (user-entered, always set through textContent) */
  const reasonBox = makeElement('p', 'rejection-reason');
  if (card.status === 'rejected') {
    reasonBox.textContent = 'Rejected because: ' + (card.decisionReason || '');
  } else {
    reasonBox.hidden = true;
  }
  article.appendChild(reasonBox);

  /* Evidence request (user-entered) */
  const requestBox = makeElement('p', 'evidence-request');
  if (card.status === 'more_evidence') {
    requestBox.textContent = 'More evidence requested: ' + (card.evidenceRequest || '');
  } else {
    requestBox.hidden = true;
  }
  article.appendChild(requestBox);

  /* Actions */
  const actions = makeElement('div', 'card-actions');
  const primaryLabel = card.status === 'more_evidence' ? 'Open details' : card.primaryLabel;
  actions.appendChild(makeButton(primaryLabel, 'btn btn-primary', function () {
    onPrimaryAction(card);
  }));
  if (card.status === 'pending') {
    actions.appendChild(makeButton('Reject', 'btn btn-danger', function () {
      openModal('reject', card.id, false);
    }));
  }
  actions.appendChild(makeButton('Learn more', 'btn-link', function () {
    openModal('detail', card.id, false);
  }));
  article.appendChild(actions);

  return article;
}

function renderCards() {
  const list = byId('card-list');
  list.textContent = '';
  const visible = getVisibleCards();

  if (visible.length === 0) {
    list.appendChild(makeElement(
      'div',
      'empty-state',
      'No cards match this filter. Choose “All” to see every card.'
    ));
    return;
  }

  visible.forEach(function (card) {
    list.appendChild(buildCard(card));
  });
}

function renderTimeline() {
  const list = byId('timeline-list');
  list.textContent = '';
  state.timeline.forEach(function (entry) {
    const item = makeElement('li', 'tl-' + entry.kind);
    item.appendChild(makeElement('span', 'tl-tag', entry.tag));
    item.appendChild(makeElement('span', 'tl-text', entry.text));
    item.appendChild(makeElement('span', 'tl-meta', entry.meta));
    list.appendChild(item);
  });
}

function renderAll() {
  renderCards();
  renderTimeline();
  updateCounts();
  updateFilterButtons();
}

/* ============================================================
 * 5. Decisions: approve, reject, request more evidence
 * ============================================================ */

function prependTimeline(kind, tag, text, card) {
  state.timeline.unshift({
    kind: kind,
    tag: tag,
    text: text,
    meta: card.agent + ' · ' + card.role + ' · ' + card.issue + ' · Just now'
  });
}

function approveCard(card) {
  card.status = 'approved';
  prependTimeline('approved', 'Approved',
    'You approved ' + card.agent + '’s “' + card.action + '” on ' + card.issue + '.', card);
  showStatus(
    'Approved: ' + card.agent + '’s ' + card.action + ' on ' + card.issue +
    '. Simulated locally — no Ziki request was sent.',
    'is-success'
  );
}

function rejectCard(card, reason) {
  card.status = 'rejected';
  card.decisionReason = reason;
  prependTimeline('rejected', 'Rejected',
    'You rejected ' + card.agent + '’s “' + card.action + '” on ' + card.issue + '.', card);
  showStatus(
    'Rejected: ' + card.agent + '’s ' + card.action + ' on ' + card.issue +
    '. Your reason was recorded. Simulated locally — no Ziki request was sent.',
    'is-reject'
  );
}

function requestEvidence(card, request) {
  card.status = 'more_evidence';
  card.evidenceRequest = request;
  prependTimeline('evidence', 'Evidence requested',
    'You asked ' + card.agent + ' for more evidence on “' + card.action + '” (' + card.issue + ').', card);
  showStatus(
    'More evidence requested from ' + card.agent + ' for ' + card.action + ' on ' + card.issue +
    '. The card is neither approved nor rejected.',
    'is-info'
  );
}

/* ============================================================
 * 6. Modal: open, render, focus handling, close
 * ============================================================ */

function isHighImpact(card) {
  return card.risk === 'High';
}

function openModal(mode, cardId, fromDetail) {
  if (!state.modal) {
    lastFocusedElement = document.activeElement;
    lastFocusedCardId = cardId;
  }
  state.modal = {
    mode: mode,
    cardId: cardId,
    fromDetail: !!fromDetail,
    requestOpen: false
  };
  renderModal();
  byId('overlay').hidden = false;
  document.body.style.overflow = 'hidden';
  byId('modal-title').focus();
}

function closeModal() {
  if (!state.modal) return;
  state.modal = null;
  byId('overlay').hidden = true;
  document.body.style.overflow = '';

  if (lastFocusedElement && document.contains(lastFocusedElement)) {
    lastFocusedElement.focus();
  } else if (lastFocusedCardId) {
    const fallback = document.querySelector(
      '.card[data-id="' + lastFocusedCardId + '"] .card-actions button'
    );
    if (fallback) fallback.focus();
  }
  lastFocusedElement = null;
  lastFocusedCardId = null;
}

function getFocusable() {
  const modal = byId('modal');
  return Array.prototype.slice.call(modal.querySelectorAll(
    'button, a[href], textarea, input, select, [tabindex]:not([tabindex="-1"])'
  )).filter(function (node) {
    return !node.disabled && node.offsetParent !== null;
  });
}

function onDocumentKeydown(event) {
  if (!state.modal) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeModal();
    return;
  }

  if (event.key === 'Tab') {
    const focusables = getFocusable();
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

function setModalTitle(text) {
  byId('modal-title').textContent = text;
}

function addFooterButton(label, className, onClick) {
  byId('modal-foot').appendChild(makeButton(label, className, onClick));
}

function renderModal() {
  const modal = state.modal;
  const card = findCard(modal.cardId);
  if (!card) {
    closeModal();
    return;
  }

  byId('modal-body').textContent = '';
  byId('modal-foot').textContent = '';

  if (modal.mode === 'approve') {
    renderApproveModal(card);
  } else if (modal.mode === 'reject') {
    renderRejectModal(card);
  } else {
    renderDetailModal(card);
  }
}

/* --- 6.1 Approve confirmation --- */

function renderApproveModal(card) {
  setModalTitle('Confirm approval — ' + card.action);

  const body = byId('modal-body');
  body.appendChild(makeElement('p', 'notice', DEMO_NOTICE));

  body.appendChild(makeBlock('What happens if you approve', [makeElement('p', null, card.impact)]));
  body.appendChild(makeFold('Exact data that will be sent', [makePayloadPre(card.payload)]));
  body.appendChild(makeFold('What it found', [makeEvidenceList(card.evidence)]));

  addFooterButton('Cancel', 'btn btn-secondary', function () {
    if (state.modal && state.modal.fromDetail) {
      openModal('detail', card.id, false);
    } else {
      closeModal();
    }
  });
  addFooterButton('Confirm approval', 'btn btn-primary', function () {
    approveCard(card);
    closeModal();
    renderAll();
  });
}

/* --- 6.2 Reject with required reason --- */

function renderRejectModal(card) {
  setModalTitle('Reject — ' + card.action);

  const body = byId('modal-body');
  body.appendChild(makeElement('p', 'notice',
    'Nothing is executed when you reject. Your reason is recorded and returned to the agent.'));

  const label = makeElement('label', 'field-label', 'Rejection reason');
  label.setAttribute('for', 'reject-reason');
  body.appendChild(label);
  body.appendChild(makeElement('span', 'field-help',
    'Explain what the agent should change or investigate next.'));

  const textarea = document.createElement('textarea');
  textarea.id = 'reject-reason';
  textarea.setAttribute('aria-describedby', 'reject-error');
  body.appendChild(textarea);

  const error = makeElement('p', 'field-error');
  error.id = 'reject-error';
  error.setAttribute('aria-live', 'polite');
  body.appendChild(error);

  let confirmBtn = null;
  const clearError = function () {
    error.textContent = '';
    if (confirmBtn) confirmBtn.disabled = textarea.value.trim().length === 0;
  };
  textarea.addEventListener('input', clearError);

  addFooterButton('Cancel', 'btn btn-secondary', function () {
    if (state.modal && state.modal.fromDetail) {
      openModal('detail', card.id, false);
    } else {
      closeModal();
    }
  });

  confirmBtn = makeButton('Confirm rejection', 'btn btn-danger', function () {
    const reason = textarea.value.trim();
    if (!reason) {
      error.textContent = 'A rejection reason is required before you can confirm.';
      textarea.focus();
      return;
    }
    rejectCard(card, reason);
    closeModal();
    renderAll();
  });
  confirmBtn.disabled = true;
  byId('modal-foot').appendChild(confirmBtn);
}

/* --- 6.3 Detail view (high-risk first, evidence, request more evidence) --- */

function renderDetailModal(card) {
  setModalTitle('Review — ' + card.action);

  const body = byId('modal-body');

  if (card.warning) {
    body.appendChild(makeElement('p', 'warning', '⚠ ' + card.warning));
  }

  body.appendChild(makeBlock('Why the agent suggests this', [makeElement('p', null, card.reason)]));
  body.appendChild(makeBlock('What it found', [makeEvidenceList(card.evidence)]));
  body.appendChild(makeBlock('What happens if you approve', [makeElement('p', null, card.impact)]));
  body.appendChild(makeFold('Can this be undone?', [makeElement('p', null, card.reversibilityNote)]));
  body.appendChild(makeFold('How risky is it?', [makeElement('p', null, card.riskNote)]));
  body.appendChild(makeFold('Is the agent allowed to do this?', [makeElement('p', null, card.permissionCheck)]));
  body.appendChild(makeFold('Exact data that will be sent', [makePayloadPre(card.payload)]));

  if (card.status === 'rejected') {
    const reasonBox = makeElement('p', 'rejection-reason',
      'Rejected because: ' + (card.decisionReason || ''));
    body.appendChild(reasonBox);
  }
  if (card.status === 'more_evidence') {
    body.appendChild(makeElement('p', 'evidence-request',
      'More evidence requested: ' + (card.evidenceRequest || '')));
  }
  if (card.status === 'completed') {
    body.appendChild(makeElement('p', 'notice',
      'This card is informational: the action already completed, so there is nothing to approve or reject.'));
  }
  if (card.status === 'approved') {
    body.appendChild(makeElement('p', 'notice', 'You already approved this action in this demo session.'));
  }

  /* Request-more-evidence panel (hidden until the button is used) */
  const panel = makeElement('div', 'request-panel');
  panel.hidden = true;

  const requestLabel = makeElement('label', 'field-label', 'What is missing?');
  requestLabel.setAttribute('for', 'evidence-request-input');
  panel.appendChild(requestLabel);
  panel.appendChild(makeElement('span', 'field-help',
    'Describe the evidence you need before you can decide.'));

  const requestArea = document.createElement('textarea');
  requestArea.id = 'evidence-request-input';
  requestArea.setAttribute('aria-describedby', 'evidence-request-error');
  panel.appendChild(requestArea);

  const requestError = makeElement('p', 'field-error');
  requestError.id = 'evidence-request-error';
  requestError.setAttribute('aria-live', 'polite');
  panel.appendChild(requestError);

  panel.appendChild(makeButton('Submit request', 'btn btn-primary', function () {
    const text = requestArea.value.trim();
    if (!text) {
      requestError.textContent = 'Describe what is missing before submitting.';
      requestArea.focus();
      return;
    }
    requestEvidence(card, text);
    closeModal();
    renderAll();
  }));

  body.appendChild(panel);

  /* Controls */
  const decidable = card.status === 'pending' || card.status === 'more_evidence';

  if (decidable) {
    addFooterButton('Close', 'btn btn-secondary', closeModal);
    addFooterButton('Request more evidence', 'btn btn-secondary', function () {
      panel.hidden = false;
      requestArea.focus();
    });
    addFooterButton('Reject', 'btn btn-danger', function () {
      openModal('reject', card.id, true);
    });
    addFooterButton('Approve', 'btn btn-primary', function () {
      openModal('approve', card.id, true);
    });
  } else {
    addFooterButton('Close', 'btn btn-secondary', closeModal);
  }

  if (state.modal.requestOpen) {
    panel.hidden = false;
  }
}

/* ============================================================
 * 7. Actions wiring
 * ============================================================ */

function onPrimaryAction(card) {
  if (card.status === 'pending' && !isHighImpact(card)) {
    /* Low/medium risk: straight to the confirmation step (never one click). */
    openModal('approve', card.id, false);
  } else {
    /* High-risk, completed, or already-requested cards open the detail view first. */
    openModal('detail', card.id, false);
  }
}

function onFilterClick(event) {
  const button = event.target.closest('.filter-btn');
  if (!button) return;
  state.filter = button.dataset.filter;
  updateFilterButtons();
  renderCards();
  updateCounts();
}

function onResetClick() {
  if (state.modal) closeModal();
  state = createInitialState();
  renderAll();
  showStatus('Demo reset. Cards, filters, counts, and audit entries are back to their initial state.', 'is-info');
}

function onOverlayClick() {
  /* Clicks on the backdrop deliberately do not close the dialog:
     decisions should be closed on purpose, not by accident. */
}

function init() {
  state = createInitialState();
  renderAll();

  document.querySelector('.filter-row').addEventListener('click', onFilterClick);
  byId('reset-btn').addEventListener('click', onResetClick);
  byId('modal-close').addEventListener('click', closeModal);
  byId('overlay').addEventListener('click', onOverlayClick);
  document.addEventListener('keydown', onDocumentKeydown);
}

document.addEventListener('DOMContentLoaded', init);
