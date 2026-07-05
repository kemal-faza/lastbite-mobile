import { apiFetch } from './client';

export async function registerDeviceToken(token: string, platform = 'android') {
  return apiFetch('/devices', {
    auth: true,
    method: 'POST',
    body: JSON.stringify({ token, platform }),
  });
}
