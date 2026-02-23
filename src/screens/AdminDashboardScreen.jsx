import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import api from '../lib/api';
import { Card, Screen, Title } from './ui';

export default function AdminDashboardScreen() {
  const [summary, setSummary] = useState({ openROs: 0, revenueToday: 0, employeesClockedIn: 0, pendingEstimates: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const { data } = await api.get('/reports/summary');
      setSummary({
        openROs: data.openROs || 0,
        revenueToday: data.revenueToday || 0,
        employeesClockedIn: data.employeesClockedIn || 0,
        pendingEstimates: data.pendingEstimates || 0,
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  return (
    <Screen>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}>
        <Title>Admin Dashboard</Title>
        <Card><Text className="text-zinc-400">Open Repair Orders</Text><Text className="text-white text-3xl font-semibold mt-1">{summary.openROs}</Text></Card>
        <Card><Text className="text-zinc-400">Revenue Today</Text><Text className="text-white text-3xl font-semibold mt-1">${summary.revenueToday}</Text></Card>
        <Card><Text className="text-zinc-400">Employees Clocked In</Text><Text className="text-white text-3xl font-semibold mt-1">{summary.employeesClockedIn}</Text></Card>
        <Card><Text className="text-zinc-400">Pending Estimates</Text><Text className="text-white text-3xl font-semibold mt-1">{summary.pendingEstimates}</Text></Card>
      </ScrollView>
    </Screen>
  );
}
