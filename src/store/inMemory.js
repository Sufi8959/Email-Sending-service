// store/inMemoryStore.js

const sentEmails = new Set();
const statuses = new Map();

function isSent(id) {
  return sentEmails.has(id);
}

function markSent(id) {
  sentEmails.add(id);
}

function updateStatus(id, status) {
  statuses.set(id, status);
}

function getStatus(id) {
  return statuses.get(id);
}

export { isSent, markSent, updateStatus, getStatus };
