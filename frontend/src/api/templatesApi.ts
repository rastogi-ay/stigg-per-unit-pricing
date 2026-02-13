const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface FetchTemplatesResponse {
  currentUsage: number;
  usageLimit: number | undefined;
}

interface CreateTemplatesResponse {
  message: string;
  currentUsage: number;
}

export const fetchTemplates = async (customerId: string): Promise<FetchTemplatesResponse> => {
  const url = new URL(`${API_BASE_URL}/api/templates`);
  url.searchParams.set('customerId', customerId);

  const response = await fetch(url.toString());
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`${response.status}: ${data.error}`);
  }
  
  return data;
}


export const createTemplate = async (customerId: string): Promise<CreateTemplatesResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/templates`, {
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
