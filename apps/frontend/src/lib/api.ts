const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function apiRequest(path: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${path}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok && response.status !== 204) {
    const error = await response.json().catch(() => ({ message: 'API Hatası' }));
    throw new Error(error.message || 'Bir hata oluştu');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  get: (path: string) => apiRequest(path, { method: 'GET' }),
  post: (path: string, data: any) => apiRequest(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path: string, data: any) => apiRequest(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (path: string) => apiRequest(path, { method: 'DELETE' }),
};
