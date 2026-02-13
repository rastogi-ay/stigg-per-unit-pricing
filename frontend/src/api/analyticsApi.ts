const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface FetchAnalyticsResponse {
  hiddenMessage: string;
}

export const fetchAnalytics = async (customerId: string): Promise<FetchAnalyticsResponse> => {
  const url = new URL(`${API_BASE_URL}/api/analytics`);
  url.searchParams.set('customerId', customerId);

  const response = await fetch(url.toString());
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`${response.status}: ${data.error}`);
  }

  return data;
};