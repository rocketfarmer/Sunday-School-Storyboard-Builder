import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  };
}

export const api = {
  async getStories() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/stories`, { headers });

    if (!response.ok) {
      throw new Error('Failed to fetch stories');
    }

    return response.json();
  },

  async getStory(id: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/stories/${id}`, { headers });

    if (!response.ok) {
      throw new Error('Failed to fetch story');
    }

    return response.json();
  },

  async createStory(data: {
    title: string;
    originalInput: string;
    inputType: 'prompt' | 'text';
    prompts?: Array<{ text: string; order: number }>;
    style?: string;
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/stories`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create story');
    }

    return response.json();
  },

  async updateStory(id: string, data: {
    title?: string;
    status?: string;
    characterImageUrl?: string;
    characterApproved?: boolean;
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/stories/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update story');
    }

    return response.json();
  },

  async deleteStory(id: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/stories/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to delete story');
    }

    return response.json();
  },

  async updatePrompts(storyId: string, prompts: Array<{ text: string; order: number }>) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/stories/${storyId}/prompts`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ prompts }),
    });

    if (!response.ok) {
      throw new Error('Failed to update prompts');
    }

    return response.json();
  },

  async generateCharacter(data: {
    storyId: string;
    prompts: Array<{ text: string }>;
    storyTitle: string;
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/generate-character`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to generate character');
    }

    return response.json();
  },

  async generateStoryboard(data: {
    storyId: string;
    prompts: Array<{ id: string; text: string }>;
    characterImageUrl: string;
    storyTitle: string;
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/generate-storyboard`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to generate storyboard');
    }

    return response.json();
  },

  async generateVariation(data: {
    promptId: string;
    originalPrompt: string;
    editPrompt: string;
    sceneNumber: number;
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/generate-variation`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to generate variation');
    }

    return response.json();
  },
};
