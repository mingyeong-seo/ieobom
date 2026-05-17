const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

async function request(path, { token, ...options } = {}) {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let detail = response.statusText;

    try {
      const error = await response.json();
      detail = error.detail ?? detail;
    } catch {
      // Keep the status text when the API does not return JSON.
    }

    throw new Error(detail);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function bootstrapDemo() {
  return request('/demo/bootstrap');
}

export function getTodaySession(token) {
  return request('/checkin/sessions/today', { token });
}

export function sendConversationMessage(token, sessionId, payload) {
  return request(`/conversation/sessions/${sessionId}/messages`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function generateStory(token, sessionId, forceRegenerate = false) {
  return request(`/stories/sessions/${sessionId}/generate`, {
    method: 'POST',
    token,
    body: JSON.stringify({ force_regenerate: forceRegenerate }),
  });
}

export function getLatestStory(token) {
  return request('/stories/latest', { token });
}

export function getStoryReactions(token, storyId) {
  return request(`/reactions/stories/${storyId}`, { token });
}

export function createStoryReaction(token, storyId, payload) {
  return request(`/reactions/stories/${storyId}`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}
