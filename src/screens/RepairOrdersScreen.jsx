import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import api from '../lib/api';
import { Card, Screen, StatusBadge, Title } from './ui';

export default function RepairOrdersScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');

  const load = useCallback(async () => {
    const { data } = await api.get('/repair-orders?status=open');
    setItems(Array.isArray(data) ? data : data.items || []);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const filtered = items.filter((i) => `${i.roNumber || ''} ${i.customer?.name || ''} ${i.vehicle?.vin || ''}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <Screen>
      <View className="flex-row items-center justify-between mb-3">
        <Title>Repair Orders</Title>
        <Pressable onPress={() => navigation.navigate('CreateRO')} className="bg-accent px-3 py-2 rounded-lg"><Text className="text-white">New</Text></Pressable>
      </View>
      <TextInput value={q} onChangeText={setQ} placeholder="Search" placeholderTextColor="#9CA3AF" className="bg-bg-card text-white p-3 rounded-xl mb-3 border border-zinc-800" />
      <FlatList
        data={filtered}
        keyExtractor={(item, idx) => String(item.id || idx)}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('RepairOrderDetail', { id: item.id })}>
            <Card>
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white font-semibold">RO #{item.roNumber || item.id}</Text>
                  <Text className="text-zinc-400">{item.customer?.name || 'Customer'} - {item.vehicle?.make} {item.vehicle?.model}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  );
}
