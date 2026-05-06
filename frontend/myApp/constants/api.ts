export const BASE_URL = 'https://alemni-app.onrender.com';
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
