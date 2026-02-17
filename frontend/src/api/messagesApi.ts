const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface SendMessageResponse {
  message: string;
}

export const sendMessage = async (customerId: string): Promise<SendMessageResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customerId }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`${response.status}: ${data.error}`);
  }

  return data;
};
