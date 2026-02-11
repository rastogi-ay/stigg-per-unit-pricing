import { useState, useEffect } from 'react';
import '../styles/App.css';
import '../styles/Campaigns.css';
import { useGetMeteredEntitlement } from '../entitlements/useGetMeteredEntitlement';
import { fetchCampaigns, createCampaign } from '../api/campaigns';

const CUSTOMER_ID = import.meta.env.VITE_STIGG_CUSTOMER_ID;
const CAMPAIGNS_FEATURE_ID = 'feature-02-campaigns';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
}

export default function Campaigns() {
  // Stigg context hook to get the current usage and usage limit for the campaigns feature
  const { currentUsage, usageLimit, hasAccess, refreshData } = useGetMeteredEntitlement(CAMPAIGNS_FEATURE_ID);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    if (name.trim()) {
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim() || undefined,
      };
      try {
        if (hasAccess) {
          const campaign = await createCampaign(newCampaign, CUSTOMER_ID);
          await refreshData();
          setCampaigns((prev) => [...prev, campaign]);
          setName('');
          setDescription('');
        } else {
          console.error("You don't have access to campaigns.");
        }
      } catch (error) {
        console.error('Failed to create campaign:', error);
      }
    }
  };

  useEffect(() => {
    async function load() {
      const list = await fetchCampaigns();
      setCampaigns(list);
    }
    load();
  }, []);

  return (
    <div className="app campaigns-page">
      <p className="app-note" aria-label="note">
        * Campaigns: with Sidecar implementation (not implemented yet)
      </p>
      <h1>Campaigns</h1>

      <div className="templates-usage">
        {!hasAccess && (
          <span className="templates-usage__text templates-usage__error">
            You don't have access to campaigns.
          </span>
        )}
        {usageLimit !== undefined && (
          <>
            <span className="templates-usage__text">
              <strong>{currentUsage}</strong> of <strong>{usageLimit}</strong> campaigns used (entitlement limit)
            </span>
            <div className="templates-usage__bar">
              <div
                className={`templates-usage__fill ${
                  currentUsage >= usageLimit ? 'templates-usage__fill--at-limit' : ''
                }`}
                style={{
                  width: `${Math.min(100, (currentUsage / usageLimit) * 100)}%`,
                }}
              />
            </div>
          </>
        )}
      </div>

      <div className="input-section">
        <input
          type="text"
          placeholder="Campaign name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Campaign description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
        />
        <button type="button" onClick={handleAdd} className="add-button" disabled={!hasAccess}>
          Add Campaign (& report usage to Stigg)
        </button>
      </div>

      <div className="tasks-section">
        {campaigns.length === 0 ? (
          <p className="empty-message">No campaigns yet. Add one above!</p>
        ) : (
          <ul className="task-list campaigns-list">
            {campaigns.map((campaign) => (
              <li key={campaign.id} className="campaign-card-wrapper">
                <article className="campaign-card">
                  <h2 className="campaign-name">{campaign.name}</h2>
                  {campaign.description && (
                    <p className="campaign-description">{campaign.description}</p>
                  )}
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
