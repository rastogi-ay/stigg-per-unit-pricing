import { useState, useEffect } from 'react';
import '../styles/App.css';
import '../styles/Analytics.css';
import { useGetBooleanEntitlement } from '../entitlements/useGetBooleanEntitlement';
import { fetchAnalytics } from '../api/analytics';

const ANALYTICS_FEATURE_ID = 'feature-04-analytics';
const CUSTOMER_ID = import.meta.env.VITE_STIGG_CUSTOMER_ID;

export default function Analytics() {
  const { hasAccess } = useGetBooleanEntitlement(ANALYTICS_FEATURE_ID);
  const [templateCount, setTemplateCount] = useState<number | null>(null);
  const [campaignCount, setCampaignCount] = useState<number | null>(null);
  const [hiddenMessage, setHiddenMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!hasAccess || !CUSTOMER_ID) return;

    let cancelled = false;

    async function load() {
      try {
        const data = await fetchAnalytics(CUSTOMER_ID);
        if (!cancelled) {
          setTemplateCount(data.templateCount);
          setCampaignCount(data.campaignCount);
          setHiddenMessage(data.hiddenMessage);
        }
      } catch {
        if (!cancelled) {
          setTemplateCount(null);
          setCampaignCount(null);
          setHiddenMessage(null);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
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
          <p className="analytics-intro">Overview of your usage and activity.</p>
          {hiddenMessage && (
            <p className="analytics-hidden-message" role="status">
              {hiddenMessage}
            </p>
          )}
          <div className="analytics-cards">
            <div className="analytics-card">
              <span className="analytics-card__label">Templates</span>
              <span className="analytics-card__value">
                {hasAccess
                  ? templateCount === null
                    ? '…'
                    : templateCount
                  : '—'}
              </span>
            </div>
            <div className="analytics-card">
              <span className="analytics-card__label">Campaigns</span>
              <span className="analytics-card__value">
                {hasAccess
                  ? campaignCount === null
                    ? '…'
                    : campaignCount
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
