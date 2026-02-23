import React, { useCallback, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import api from '../lib/api';
import { Card, Screen, Title } from './ui';

export default function TimeClockAdminScreen() {
  const [rows, setRows] = useState([]);

  const load = useCallback(async () => {
    const { data } = await api.get('/timeclock/today');
    setRows(Array.isArray(data) ? data : data.items || []);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const inCount = rows.filter((r) => !r.clockOut).length;
  const totalHours = rows.reduce((a, r) => a + (Number(r.hours) || 0), 0);

  return (
    <Screen>
      <ScrollView>
        <Title>Time Clock</Title>
        <Card><Text className="text-zinc-400">Clocked In Now</Text><Text className="text-white text-3xl font-semibold">{inCount}</Text></Card>
        <Card><Text className="text-zinc-400">Total Hours Today</Text><Text className="text-white text-3xl font-semibold">{totalHours.toFixed(2)}</Text></Card>
        {rows.map((r, i) => (
          <Card key={i}>
            <Text className="text-white font-semibold">{r.user?.name || 'Employee'}</Text>
            <Text className="text-zinc-400">In: {r.clockIn || '-'}</Text>
            <Text className="text-zinc-400">Out: {r.clockOut || 'Active'}</Text>
            <Text className="text-zinc-400">Hours: {r.hours || 0}</Text>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}
