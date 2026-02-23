import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Text } from 'react-native';
import api from '../lib/api';
import { Card, Screen, StatusBadge, Title } from './ui';

export default function CustomerPortalScreen({ navigation }) {
  const [me, setMe] = useState(null);

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => setMe(data));
  }, []);

  const ros = me?.repairOrders || [];

  return (
    <Screen>
      <Title>Customer Portal</Title>
      <Text className="text-zinc-400 mb-2 mt-1">Vehicles</Text>
      {(me?.vehicles || []).map((v, i) => (
        <Card key={i}><Text className="text-white">{v.year} {v.make} {v.model}</Text><Text className="text-zinc-400">{v.vin}</Text></Card>
      ))}
      <Text className="text-zinc-400 mb-2 mt-2">Active Repair Orders</Text>
      <FlatList
        data={ros}
        keyExtractor={(item, idx) => String(item.id || idx)}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('ROStatus', { id: item.id })}>
            <Card>
              <Text className="text-white font-semibold">RO #{item.roNumber || item.id}</Text>
              <StatusBadge status={item.status} />
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  );
}
