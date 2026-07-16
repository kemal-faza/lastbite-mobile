import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setTokens(accessToken: string, refreshToken: string) {
  await AsyncStorage.setItem('accessToken', accessToken);
  await AsyncStorage.setItem('refreshToken', refreshToken);
}

export async function setSession(accessToken: string, refreshToken: string, user: any) {
  await setTokens(accessToken, refreshToken);
  await AsyncStorage.setItem('user', JSON.stringify(user));
}

export async function clearTokens() {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
}
