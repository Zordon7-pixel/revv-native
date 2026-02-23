import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';
import * as Location from 'expo-location';
import api from '../lib/api';
import { Card, Screen, Title } from './ui';

export default function TimeClockScreen() {
  const [status, setStatus] = useState({ clockedIn: false, currentSession: null });
  const [now, setNow] = useState(Date.now());

  const load = async () => {
    const { data } = await api.get('/timeclock/status');
    setStatus(data || {});
  };

  useEffect(() => {
    load();
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsed = useMemo(() => {
    if (!status?.clockedIn || !status?.currentSession?.clockIn) return '00:00:00';
    const start = new Date(status.currentSession.clockIn).getTime();
    const sec = Math.max(0, Math.floor((now - start) / 1000));
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }, [status, now]);

  const toggle = async () => {
    const { status: perm } = await Location.requestForegroundPermissionsAsync();
    if (perm !== 'granted') return Alert.alert('Location required', 'Enable location to use time clock.');
    const loc = await Location.getCurrentPositionAsync({});
    const payload = { lat: loc.coords.latitude, lng: loc.coords.longitude };
    if (status.clockedIn) await api.post('/timeclock/clockout', payload);
    else await api.post('/timeclock/clockin', payload);
    load();
  };

  return (
    <Screen>
      <Title>Time Clock</Title>
      <Card className="items-center">
        <Text className="text-zinc-400">Current Status</Text>
        <Text className="text-white text-2xl font-semibold mt-1">{status.clockedIn ? 'CLOCKED IN' : 'CLOCKED OUT'}</Text>
        <Text className="text-zinc-400 mt-1">Session Timer: {elapsed}</Text>
        <Pressable onPress={toggle} className="mt-5 bg-accent rounded-xl py-4 px-10 items-center">
          <Text className="text-white text-lg font-semibold">{status.clockedIn ? 'CLOCK OUT' : 'CLOCK IN'}</Text>
        </Pressable>
      </Card>
    </Screen>
  );
}
