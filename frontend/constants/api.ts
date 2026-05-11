import Constants from 'expo-constants';
import { Platform } from 'react-native';

function normalizeBaseUrl(value?: string | null) {
  if (!value) return null;

  const trimmed = value.trim().replace(/\/$/, '');
  if (!trimmed) return null;

  return /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
}

function resolveMetroHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.debuggerHost ||
    (Constants as any).manifest?.debuggerHost;

  if (!hostUri) return null;

  const host = hostUri
    .replace(/^https?:\/\//i, '')
    .replace(/^exp(s)?:\/\//i, '')
    .split(':')[0]
    .split('/')[0]
    .trim();

  return host || null;
}

const ENV_API_BASE = normalizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL);
const METRO_HOST = resolveMetroHost();

export const API_BASE =
  ENV_API_BASE ||
  (Platform.OS === 'web'
    ? 'http://localhost:5000'
    : METRO_HOST && METRO_HOST !== 'localhost' && METRO_HOST !== '127.0.0.1'
      ? `http://${METRO_HOST}:5000`
      : Platform.OS === 'android'
        ? 'http://10.0.2.2:5000'
        : 'http://localhost:5000');

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
