import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../styles/App.css';
import '../styles/Analytics.css';
import { fetchAnalytics } from '../api/analyticsApi';

const CUSTOMER_ID = import.meta.env.VITE_STIGG_CUSTOMER_ID;

export default function Analytics() {
  const [hiddenMessage, setHiddenMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadPage() {
      try {
        const { hiddenMessage } = await fetchAnalytics(CUSTOMER_ID);
        setHiddenMessage(hiddenMessage);
      } catch (error: any) {
        setHiddenMessage(null);
        toast.error(error.message, {
          toastId: 'analytics-error',
        });
      }
    }

    loadPage();
  }, []);

  return (
    <div className="app analytics-page">
      <h1>Analytics</h1>
      <div className="analytics-content-wrapper">
        <div
          className={
            hiddenMessage
              ? 'analytics-content'
              : 'analytics-content analytics-content--blurred'
          }
        >
          <div className="analytics-cards">
            <div className="analytics-card">
              <span className="analytics-card__label">Analytics</span>
              <span className="analytics-card__value">
                {hiddenMessage
                  ? hiddenMessage
                  : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
