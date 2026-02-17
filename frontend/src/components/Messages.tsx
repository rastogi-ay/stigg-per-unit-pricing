import { useState } from 'react';
import { toast } from 'react-toastify';
import '../styles/App.css';
import '../styles/Messages.css';

export default function Messages() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;

    toast.success('Message sent', { toastId: 'messages-send-success' });
    setMessage('');
  };

  return (
    <div className="app">
      <h1>Messages</h1>
      <div className="input-section">
        <textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input-field messages-textarea"
          rows={4}
        />
        <button
          onClick={handleSend}
          className="add-button"
          disabled={!message.trim()}
        >
          Send Message (& report event to Stigg)
        </button>
      </div>
    </div>
  );
}
