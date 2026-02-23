import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_KEY = 'sc_token';
export const USER_KEY = 'sc_user';

export const saveAuth = async ({ token, user }) => {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user || null)],
  ]);
};

export const getToken = async () => AsyncStorage.getItem(TOKEN_KEY);

export const getStoredUser = async () => {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearAuth = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
};
