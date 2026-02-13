import { useState, useEffect } from 'react';
import '../styles/App.css';
import '../styles/Analytics.css';
import { fetchAnalytics } from '../api/analytics';
import { useBooleanEntitlement } from '@stigg/react-sdk';

const CUSTOMER_ID = import.meta.env.VITE_STIGG_CUSTOMER_ID;
const ANALYTICS_FEATURE_ID = 'feature-04-analytics'; // feature ID from Stigg

export default function Analytics() {
  // Stigg context to get the relevant entitlement information for the analytics feature
  const { hasAccess } = useBooleanEntitlement({ featureId: ANALYTICS_FEATURE_ID });

  const [hiddenMessage, setHiddenMessage] = useState<string | null>(null);

  useEffect(() => {
    // if the customer does not have access to the analytics feature, return
    if (!hasAccess) return;

    async function load() {
      try {
        const message = await fetchAnalytics(CUSTOMER_ID, ANALYTICS_FEATURE_ID);
        setHiddenMessage(message);
      } catch {
        setHiddenMessage(null);
      }
    }

    load();
  }, [hasAccess]);

  return (
    <div className="app analytics-page">
      <h1>Analytics</h1>
      <div className="analytics-content-wrapper">
        <div
          className={
            hasAccess
              ? 'analytics-content'
              : 'analytics-content analytics-content--blurred'
          }
        >
          <div className="analytics-cards">
            <div className="analytics-card">
              <span className="analytics-card__label">Analytics</span>
              <span className="analytics-card__value">
                {hasAccess
                  ? hiddenMessage === null
                    ? '…'
                    : hiddenMessage
                  : '—'}
              </span>
            </div>
          </div>
        </div>
        {!hasAccess && (
          <div className="analytics-content__overlay" aria-live="polite">
            You don't have access to analytics.
          </div>
        )}
      </div>
    </div>
  );
}
