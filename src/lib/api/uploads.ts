import { API_BASE } from './client';
import * as ImageManipulator from 'expo-image-manipulator';

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

export async function prepareAndUploadImage(uri: string) {
  const manipulated = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
  return uploadImage({ uri: manipulated.uri, name: 'product.jpg', type: 'image/jpeg' });
}
