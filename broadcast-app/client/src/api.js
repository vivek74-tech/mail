const BASE_URL = '/api';

export async function getContacts() {
  const res = await fetch(`${BASE_URL}/contacts`);
  return res.json();
}

export async function saveContacts(contacts) {
  const res = await fetch(`${BASE_URL}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contacts })
  });
  return res.json();
}

export async function sendMessage(text) {
  const res = await fetch(`${BASE_URL}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return res.json();
}

export async function getHistory() {
  const res = await fetch(`${BASE_URL}/send/history`);
  return res.json();
}
