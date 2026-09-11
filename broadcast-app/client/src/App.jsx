import React, { useEffect, useState } from 'react';
import { getContacts, saveContacts, sendMessage, getHistory } from './api';

const EMPTY_CONTACTS = Array.from({ length: 6 }, (_, i) => ({
  slot: i + 1,
  name: '',
  email: ''
}));

export default function App() {
  const [message, setMessage] = useState('');
  const [contacts, setContacts] = useState(EMPTY_CONTACTS);
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [savingContacts, setSavingContacts] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadContacts();
    loadHistory();
  }, []);

  async function loadContacts() {
    const data = await getContacts();
    if (Array.isArray(data) && data.length > 0) {
      const merged = EMPTY_CONTACTS.map(empty => {
        const found = data.find(c => c.slot === empty.slot);
        return found ? { slot: found.slot, name: found.name, email: found.email } : empty;
      });
      setContacts(merged);
    }
  }

  async function loadHistory() {
    const data = await getHistory();
    if (Array.isArray(data)) setHistory(data);
  }

  function updateContact(slot, field, value) {
    setContacts(prev =>
      prev.map(c => (c.slot === slot ? { ...c, [field]: value } : c))
    );
  }

  async function handleSaveContacts() {
    const filled = contacts.filter(c => c.email.trim());
    if (filled.length === 0) {
      setStatus({ type: 'error', text: 'Kam se kam ek email address daalo' });
      return;
    }
    setSavingContacts(true);
    const result = await saveContacts(filled);
    setSavingContacts(false);
    if (result.error) {
      setStatus({ type: 'error', text: result.error });
    } else {
      setStatus({ type: 'ok', text: 'Contacts save ho gaye' });
    }
  }

  async function handleSend() {
    if (!message.trim()) {
      setStatus({ type: 'error', text: 'Pehle message likho' });
      return;
    }
    setSending(true);
    const result = await sendMessage(message);
    setSending(false);
    if (result.error) {
      setStatus({ type: 'error', text: result.error });
    } else {
      setStatus({ type: 'ok', text: result.message });
      loadHistory();
    }
  }

  return (
    <div className="wrap">
      <div className="masthead">
        <h1>एक साथ संदेश</h1>
        <span>6 लोगों को एक क्लिक में ईमेल</span>
      </div>

      <div className="card">
        <h2>संदेश लिखें</h2>
        <textarea
          placeholder="यहाँ अपना संदेश टाइप करें..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <div className="charcount">{message.length} अक्षर</div>
      </div>

      <div className="card">
        <h2>6 लोगों की जानकारी भरें</h2>
        {contacts.map(c => (
          <div className="contact-row" key={c.slot}>
            <div className="contact-num">{c.slot}</div>
            <input
              type="text"
              placeholder="नाम (वैकल्पिक)"
              value={c.name}
              onChange={e => updateContact(c.slot, 'name', e.target.value)}
            />
            <input
              type="email"
              placeholder="ईमेल पता"
              value={c.email}
              onChange={e => updateContact(c.slot, 'email', e.target.value)}
            />
          </div>
        ))}
        <div className="hint">
          जितने भरोगे उतने save हो जाएंगे, सब 6 भरना ज़रूरी नहीं है।
        </div>
        <br />
        <button className="secondary" onClick={handleSaveContacts} disabled={savingContacts}>
          {savingContacts ? 'Save हो रहा है...' : 'Contacts Save करें'}
        </button>
      </div>

      <div className="card">
        <h2>भेजें</h2>
        <button className="primary" onClick={handleSend} disabled={sending}>
          {sending ? 'भेजा जा रहा है...' : 'सबको एक साथ भेजें'}
        </button>
        {status && (
          <div className={`status ${status.type === 'error' ? 'error' : ''}`}>
            {status.text}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="card">
          <h2>पिछले भेजे गए संदेश</h2>
          {history.map(h => (
            <div className="history-item" key={h._id}>
              <div>{h.text}</div>
              <div className="time">
                {new Date(h.createdAt).toLocaleString('hi-IN')} —{' '}
                {h.sentTo.filter(s => s.status === 'sent').length}/{h.sentTo.length} भेजा गया
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="footnote">
        Email bhejne ke liye backend me .env file me apni SMTP details
        (EMAIL_USER, EMAIL_PASS) sahi se bhari honi chahiye.
      </div>
    </div>
  );
}
