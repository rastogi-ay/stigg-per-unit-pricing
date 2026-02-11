const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface AnalyticsResponse {
  hiddenMessage: string;
  templateCount: number;
  campaignCount: number;
}

export const fetchAnalytics = async (customerId: string): Promise<AnalyticsResponse> => {
  const url = new URL(`${API_BASE_URL}/api/analytics`);
  url.searchParams.set('customerId', customerId);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }
  return response.json();
};
