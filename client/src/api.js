const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const setToken = (token) => {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');

export const authFetch = async (path, opts = {}) => {
  const headers = opts.headers || {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!headers['Content-Type'] && !(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ msg: res.statusText }));
    throw err;
  }
  return res.json();
};
