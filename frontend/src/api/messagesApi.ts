import type { GetClerkToken } from './clerkAuth';
import { withAuthHeaders } from './clerkAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface SendMessageResponse {
  message: string;
}

export const sendMessage = async (
  getToken: GetClerkToken,
): Promise<SendMessageResponse> => {
  const headers = await withAuthHeaders(getToken, {
    'Content-Type': 'application/json',
  });
  const response = await fetch(`${API_BASE_URL}/api/messages`, {
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
