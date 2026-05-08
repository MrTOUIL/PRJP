import { Platform } from 'react-native';

const API_HOST = process.env.EXPO_PUBLIC_API_BASE_URL || '172.20.10.5';

export const API_BASE = Platform.OS === 'web' ? 'http://localhost:5000' : `http://${API_HOST}:5000`;

const ADMIN_TOKEN = 'dev-admin-token';
import { getCurrentAdminId } from './adminSession';

export async function apiJson(path: string, opts: RequestInit = {}) {
  const headers = Object.assign({ 'x-admin-token': ADMIN_TOKEN }, (opts.headers || {}));

  const currentAdminId = getCurrentAdminId();
  if (currentAdminId && !headers['x-admin-id']) {
    headers['x-admin-id'] = currentAdminId;
  }

  // If body is a plain object, stringify it and set content-type
  let body = opts.body as any;
  if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof URLSearchParams) && !(body instanceof ArrayBuffer)) {
    body = JSON.stringify(body);
    if (!headers['Content-Type'] && !headers['content-type']) headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(API_BASE + path, Object.assign({}, opts, { headers, body }));
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    let message = `HTTP ${res.status}`;
    try {
      const json = JSON.parse(txt || '{}');
      if (json.message) message = json.message;
    } catch (e) {}
    throw new Error(message);
  }
  return res.json();
}

export default apiJson;
