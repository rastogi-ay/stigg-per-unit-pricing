import { useState, useEffect } from 'react';
import '../styles/App.css';
import '../styles/Campaigns.css';
import { fetchCampaigns, createCampaign } from '../api/campaigns';
import { useMeteredEntitlement, useStiggContext } from '@stigg/react-sdk';

const CUSTOMER_ID = import.meta.env.VITE_STIGG_CUSTOMER_ID;
const CAMPAIGNS_FEATURE_ID = 'feature-02-campaigns'; // feature ID from Stigg

export interface Campaign {
  id: string;
  name: string;
  description?: string;
}

export default function Campaigns() {
  // Stigg context to get the relevant entitlement information for the campaigns feature
  const { refreshData } = useStiggContext();
  const { currentUsage, usageLimit } = useMeteredEntitlement({ featureId: CAMPAIGNS_FEATURE_ID });
  const canCreateCampaign = usageLimit !== undefined && currentUsage < usageLimit;

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
        if (canCreateCampaign) {
          // create the campaign and report the usage to Stigg
          const campaign = await createCampaign(newCampaign, CUSTOMER_ID, CAMPAIGNS_FEATURE_ID);
          // refresh the data immediately to update the entitlement status
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
      <h1>Campaigns</h1>

      <div className="templates-usage">
        {!canCreateCampaign && (
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
        <button type="button" onClick={handleAdd} className="add-button" disabled={!canCreateCampaign}>
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
