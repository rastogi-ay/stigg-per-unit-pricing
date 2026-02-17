import { useState } from 'react';
import { toast } from 'react-toastify';
import '../styles/App.css';
import '../styles/Messages.css';
import { sendMessage } from '../api/messagesApi';

const CUSTOMER_ID = import.meta.env.VITE_STIGG_CUSTOMER_ID;

export default function Messages() {
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const result = await sendMessage(CUSTOMER_ID);
      setMessage('');
      toast.success(result.message,
        { toastId: 'messages-send-success' }
      );
    } catch (error: any) {
      toast.error(error.message,
        { toastId: 'messages-send-error' }
      );
    }
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
