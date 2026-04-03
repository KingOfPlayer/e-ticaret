interface ApiRequestOptions extends RequestInit {
  useGateway?: boolean; // Flag to use gateway URL instead of API base
  query?: Record<string, any>; // Query parameters
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:5000';
/*

*/
export async function apiRequest(path: string, options: ApiRequestOptions = {}) {
  const { useGateway = false, query, ...fetchOptions } = options;

  // Use gateway URL if flag is set, otherwise use API base URL
  const baseUrl = useGateway ? GATEWAY_URL : API_BASE_URL;
  
  // Build URL with query parameters if provided
  let url = `${baseUrl}${path}`;
  if (query && Object.keys(query).length > 0) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    url += `?${params.toString()}`;
  }

  // Client-side'da olduğumuzdan emin olalım
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...fetchOptions.headers,
  };

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  }

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
  get: (path: string, useGateway: boolean = false, query?: Record<string, any>) =>
    apiRequest(path, { method: 'GET', useGateway, query }),
  post: (path: string, data: any, useGateway: boolean = false,) =>
    apiRequest(path, { method: 'POST', body: JSON.stringify(data), useGateway }),
  put: (path: string, data: any, useGateway: boolean = false) =>
    apiRequest(path, { method: 'PUT', body: JSON.stringify(data), useGateway }),
  patch: (path: string, data: any, useGateway: boolean = false) =>
    apiRequest(path, { method: 'PATCH', body: JSON.stringify(data), useGateway }),
  delete: (path: string, useGateway: boolean = false,) =>
    apiRequest(path, { method: 'DELETE', useGateway }),
};
