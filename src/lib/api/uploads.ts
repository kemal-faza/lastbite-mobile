import { API_BASE } from './client';

export async function uploadImage(file: { uri: string; name: string; type: string }) {
  const formData = new FormData();
  formData.append('file', file as any);

  const res = await fetch(`${API_BASE}/uploads`, {
    method: 'POST',
    body: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.json() as Promise<{ url: string }>;
}
