import { apiFetch } from './client';
import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Upload a file to the server.
 * Uses apiFetch with auth: true to attach the Bearer token (H-3).
 * Content-Type is left unset for FormData — RN/browser auto-sets
 * the correct multipart boundary (H-4).
 */
export async function uploadImage(file: { uri: string; name: string; type: string }) {
  const formData = new FormData();
  formData.append('file', file as any);

  return apiFetch<{ url: string }>('/uploads', {
    method: 'POST',
    body: formData,
    auth: true,
  });
}

/**
 * Resize + compress an image, then upload it.
 * Reduces image to max 800px width with 80% JPEG quality before upload.
 */
export async function prepareAndUploadImage(uri: string) {
  const manipulated = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
  );
  return uploadImage({ uri: manipulated.uri, name: 'product.jpg', type: 'image/jpeg' });
}
