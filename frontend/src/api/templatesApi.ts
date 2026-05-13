import type { GetClerkToken } from './clerkAuth';
import { withAuthHeaders } from './clerkAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface FetchTemplatesResponse {
  currentUsage: number;
  usageLimit: number | undefined;
}

interface CreateTemplatesResponse {
  message: string;
  currentUsage: number;
}

export const fetchTemplates = async (
  getToken: GetClerkToken,
): Promise<FetchTemplatesResponse> => {
  const headers = await withAuthHeaders(getToken);
  const response = await fetch(`${API_BASE_URL}/api/templates`, { headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`${response.status}: ${data.error}`);
  }

  return data;
};

export const createTemplate = async (
  getToken: GetClerkToken,
): Promise<CreateTemplatesResponse> => {
  const headers = await withAuthHeaders(getToken, {
    'Content-Type': 'application/json',
  });
  const response = await fetch(`${API_BASE_URL}/api/templates`, {
    method: 'POST',
    headers,
    body: JSON.stringify({}),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`${response.status}: ${data.error}`);
  }

  return data;
};
