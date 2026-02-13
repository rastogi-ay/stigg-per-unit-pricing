const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchAnalytics = async (customerId: string, featureId: string): Promise<string> => {
  const url = new URL(`${API_BASE_URL}/api/analytics`);
  url.searchParams.set('customerId', customerId);
  url.searchParams.set('featureId', featureId);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }
  const data = await response.json();
  return data.hiddenMessage;
};
