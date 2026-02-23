import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import api from '../lib/api';
import { saveAuth } from '../lib/auth';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', { email, password });
      await saveAuth({ token: data.token, user: data.user });
      onLogin?.(data.user);
    } catch (e) {
      Alert.alert('Login failed', e?.response?.data?.message || 'Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-bg-base px-6 justify-center">
      <View className="items-center mb-10">
        <ShieldCheck color="#6366F1" size={40} />
        <Text className="text-white text-3xl font-bold mt-3">REVV</Text>
        <Text className="text-zinc-400 text-center mt-2">Every repair tracked. Every dollar counted. Every customer impressed.</Text>
      </View>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
        className="bg-bg-card text-white p-4 rounded-xl mb-3 border border-zinc-800"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        className="bg-bg-card text-white p-4 rounded-xl mb-5 border border-zinc-800"
      />
      <Pressable onPress={submit} className="bg-accent rounded-xl py-4 items-center" disabled={loading}>
        <Text className="text-white font-semibold">{loading ? 'Signing in...' : 'Sign In'}</Text>
      </Pressable>
    </View>
  );
}
