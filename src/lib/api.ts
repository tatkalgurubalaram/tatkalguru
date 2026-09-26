export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
  let token = localStorage.getItem('accessToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'omit' // We only use credentials (cookies) for /auth routes natively
  });

  if (response.status === 401) {
    try {
      // Try refresh
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' // Important for refresh token cookie
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        if (refreshData.success && refreshData.data?.accessToken) {
          localStorage.setItem('accessToken', refreshData.data.accessToken);
          
          // Retry
          const newHeaders = {
            ...headers,
            Authorization: `Bearer ${refreshData.data.accessToken}`
          };
          response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: newHeaders,
            credentials: 'omit'
          });
        } else {
          localStorage.removeItem('accessToken');
        }
      } else {
        localStorage.removeItem('accessToken');
      }
    } catch (e) {
      localStorage.removeItem('accessToken');
    }
  }

  return response;
}

export const apiClient = {
  async post<T>(endpoint: string, data: any): Promise<T> {
    const isAuthRoute = endpoint.startsWith('/auth/logout') || endpoint.startsWith('/auth/login') || endpoint.startsWith('/auth/register');
    
    let response;
    if (isAuthRoute) {
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include' // allow setting cookies
      });
    } else {
      response = await fetchWithAuth(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    }

    if (!response.ok) {
      let message = 'An error occurred';
      try {
        const errorData = await response.json();
        message = errorData.message || message;
      } catch (_e) {
        // ignore
      }
      throw new Error(message);
    }

    return response.json();
  },

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetchWithAuth(endpoint, { method: 'GET' });

    if (!response.ok) {
      let message = 'An error occurred';
      try {
        const errorData = await response.json();
        message = errorData.message || message;
      } catch (_e) {
        // ignore
      }
      throw new Error(message);
    }

    return response.json();
  },
  
  async patch<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetchWithAuth(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let message = 'An error occurred';
      try {
        const errorData = await response.json();
        message = errorData.message || message;
      } catch (_e) {
        // ignore
      }
      throw new Error(message);
    }

    return response.json();
  }
};
