import React, { useEffect, useState } from 'react';
import { FlatList, Text } from 'react-native';
import api from '../lib/api';
import { Card, Screen, StatusBadge, Title } from './ui';

export default function MyWorkScreen() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get('/repair-orders?status=open').then(({ data }) => {
      const list = Array.isArray(data) ? data : data.items || [];
      setRows(list.filter((x) => x.assignedToMe || x.assignee?.me));
    });
  }, []);

  return (
    <Screen>
      <Title>My Work</Title>
      <FlatList
        data={rows}
        keyExtractor={(item, idx) => String(item.id || idx)}
        renderItem={({ item }) => (
          <Card>
            <Text className="text-white font-semibold">RO #{item.roNumber || item.id}</Text>
            <Text className="text-zinc-400">{item.vehicle?.year} {item.vehicle?.make} {item.vehicle?.model}</Text>
            <StatusBadge status={item.status} />
          </Card>
        )}
      />
    </Screen>
  );
}
