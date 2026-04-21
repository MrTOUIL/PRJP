import Constants from 'expo-constants';

const getBaseUrl = () => {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];

  if (host) {
    return `http://${host}:5000`;
  }

  return 'http://localhost:5000';
};

export const BASE_URL = getBaseUrl();
export const ADMIN_TOKEN = 'dev-admin-token';

type ApiOptions = RequestInit & { body?: unknown };

export async function apiJson(path: string, options: ApiOptions = {}) {
  const headers = { ...(options.headers ?? {}) } as Record<string, string>;
  let body = options.body;

  if (path.startsWith('/api/admin') && ADMIN_TOKEN) {
    headers['x-admin-token'] = ADMIN_TOKEN;
  }

  if (body !== undefined && typeof body !== 'string') {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
    body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body: body as BodyInit | null | undefined,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string'
      ? payload
      : payload?.message || payload?.error || 'Request failed';
    throw new Error(message);
  }

  return payload;
}
