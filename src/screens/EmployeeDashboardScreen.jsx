import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';
import * as Location from 'expo-location';
import api from '../lib/api';
import { Card, Screen, Title } from './ui';

export default function EmployeeDashboardScreen() {
  const [status, setStatus] = useState({ clockedIn: false, currentSession: null });
  const [shift, setShift] = useState(null);

  const load = async () => {
    const [clockRes, scheduleRes] = await Promise.all([
      api.get('/timeclock/status'),
      api.get('/schedule/my'),
    ]);
    setStatus(clockRes.data || {});
    setShift((scheduleRes.data?.shifts || [])[0] || null);
  };

  useEffect(() => { load(); }, []);

  const toggleClock = async () => {
    const { status: perm } = await Location.requestForegroundPermissionsAsync();
    if (perm !== 'granted') return Alert.alert('Location required', 'Enable location to clock in or out.');
    const loc = await Location.getCurrentPositionAsync({});
    const payload = { lat: loc.coords.latitude, lng: loc.coords.longitude };
    if (status.clockedIn) await api.post('/timeclock/clockout', payload);
    else await api.post('/timeclock/clockin', payload);
    load();
  };

  return (
    <Screen>
      <Title>Employee Dashboard</Title>
      <Card>
        <Text className="text-zinc-400">Today Shift</Text>
        <Text className="text-white mt-1">{shift ? `${shift.start} - ${shift.end}` : 'No shift scheduled'}</Text>
      </Card>
      <Card>
        <Text className="text-zinc-400">Time Clock</Text>
        <Text className="text-white text-xl mt-1">{status.clockedIn ? 'Clocked In' : 'Clocked Out'}</Text>
        <Pressable onPress={toggleClock} className="mt-3 bg-accent rounded-xl py-3 items-center">
          <Text className="text-white font-semibold">{status.clockedIn ? 'CLOCK OUT' : 'CLOCK IN'}</Text>
        </Pressable>
      </Card>
    </Screen>
  );
}
