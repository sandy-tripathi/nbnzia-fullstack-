import type { ApiFailure, ApiSuccess } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class ApiRequestError extends Error {
  status: number;
  errors?: ApiFailure['errors'];

  constructor(status: number, message: string, errors?: ApiFailure['errors']) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions extends RequestInit {
  body?: unknown;
}

/**
 * Thin fetch wrapper for the NBNZIA backend.
 * - Always sends cookies (needed for admin JWT auth).
 * - JSON-encodes plain object bodies automatically.
 * - Throws ApiRequestError with the backend's message on non-2xx responses,
 *   so callers can show it directly instead of a generic "something broke".
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...rest,
      credentials: 'include',
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiRequestError(0, 'Could not reach the server. Check your connection and try again.');
  }

  let json: ApiSuccess<T> | ApiFailure | null = null;
  try {
    json = await res.json();
  } catch {
    // No JSON body (e.g. 204) — fine for some endpoints.
  }

  if (!res.ok || !json || json.success === false) {
    const message = (json as ApiFailure)?.message || `Request failed (${res.status})`;
    const errors = (json as ApiFailure)?.errors;
    throw new ApiRequestError(res.status, message, errors);
  }

  return (json as ApiSuccess<T>).data;
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
};
