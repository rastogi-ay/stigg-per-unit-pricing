import type { Campaign } from '../components/Campaigns';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const response = await fetch(`${API_BASE_URL}/api/campaigns`);
  if (!response.ok) {
    throw new Error('Failed to fetch campaigns');
  }
  return response.json();
};

export const createCampaign = async (
  campaign: Campaign,
  customerId: string,
  featureId: string,
): Promise<Campaign> => {
  const response = await fetch(`${API_BASE_URL}/api/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ campaign, customerId, featureId }),
  });
  if (!response.ok) {
    throw new Error('Failed to create campaign');
  }
  return response.json();
};
