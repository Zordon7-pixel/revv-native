import React, { useCallback, useState } from 'react';
import { ScrollView, Text, Pressable, View } from 'react-native';
import api from '../lib/api';
import { Card, Screen, StatusBadge, Title } from './ui';

const statuses = ['intake', 'estimate', 'approval', 'parts', 'repair', 'paint', 'qc', 'delivery', 'closed'];

export default function RepairOrderDetailScreen({ route }) {
  const { id } = route.params;
  const [ro, setRo] = useState(null);

  const load = useCallback(async () => {
    const { data } = await api.get(`/repair-orders/${id}`);
    setRo(data);
  }, [id]);

  const updateStatus = async (status) => {
    await api.put(`/repair-orders/${id}/status`, { status });
    load();
  };

  React.useEffect(() => { load(); }, [load]);

  if (!ro) return <Screen><Text className="text-zinc-400">Loading...</Text></Screen>;

  return (
    <Screen>
      <ScrollView>
        <Title>RO #{ro.roNumber || ro.id}</Title>
        <Card>
          <Text className="text-white font-semibold">Vehicle</Text>
          <Text className="text-zinc-400 mt-1">{ro.vehicle?.year} {ro.vehicle?.make} {ro.vehicle?.model}</Text>
          <Text className="text-zinc-400">VIN: {ro.vehicle?.vin || 'N/A'}</Text>
          <Text className="text-zinc-400">Mileage: {ro.vehicle?.mileage || 'N/A'}</Text>
        </Card>
        <Card>
          <Text className="text-white font-semibold mb-2">Customer</Text>
          <Text className="text-zinc-400">{ro.customer?.name}</Text>
          <Text className="text-zinc-400">{ro.customer?.email}</Text>
        </Card>
        <Card>
          <Text className="text-white font-semibold mb-2">Status</Text>
          <StatusBadge status={ro.status} />
          <View className="flex-row flex-wrap gap-2 mt-3">
            {statuses.map((s) => (
              <Pressable key={s} className="bg-zinc-800 px-3 py-2 rounded-lg" onPress={() => updateStatus(s)}>
                <Text className="text-white uppercase text-xs">{s}</Text>
              </Pressable>
            ))}
          </View>
        </Card>
        <Card>
          <Text className="text-white font-semibold mb-2">Parts</Text>
          {(ro.parts || []).map((p, i) => <Text key={i} className="text-zinc-400">{p.name} - {p.status || 'pending'}</Text>)}
        </Card>
        <Card>
          <Text className="text-white font-semibold mb-2">Notes</Text>
          <Text className="text-zinc-400">{ro.notes || 'No notes'}</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}
