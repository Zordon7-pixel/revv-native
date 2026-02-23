import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, TextInput } from 'react-native';
import api from '../lib/api';
import { Card, Screen, Title } from './ui';

export default function CustomersScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');

  const load = useCallback(async () => {
    const { data } = await api.get('/customers');
    setItems(Array.isArray(data) ? data : data.items || []);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  return (
    <Screen>
      <Title>Customers</Title>
      <TextInput value={q} onChangeText={setQ} placeholder="Search customers" placeholderTextColor="#9CA3AF" className="bg-bg-card text-white p-3 rounded-xl mb-3 border border-zinc-800" />
      <FlatList
        data={items.filter((i) => `${i.name} ${i.email}`.toLowerCase().includes(q.toLowerCase()))}
        keyExtractor={(item, idx) => String(item.id || idx)}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('CustomerDetail', { id: item.id })}>
            <Card>
              <Text className="text-white font-semibold">{item.name}</Text>
              <Text className="text-zinc-400">{item.email}</Text>
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  );
}
