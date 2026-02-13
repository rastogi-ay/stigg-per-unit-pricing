import type { Template } from '../components/Templates';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchTemplates = async (): Promise<Template[]> => {
  const response = await fetch(`${API_BASE_URL}/api/templates`);
  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }
  return response.json();
};

export const createTemplate = async (
  template: Template,
  customerId: string,
  featureId: string,
): Promise<Template> => {
  const response = await fetch(`${API_BASE_URL}/api/templates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ template, customerId, featureId }),
  });
  if (!response.ok) {
    throw new Error('Failed to create template');
  }
  return response.json();
};
