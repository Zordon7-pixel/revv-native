import React, { useCallback, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import api from '../lib/api';
import { Card, Screen, Title } from './ui';

export default function CustomerDetailScreen({ route }) {
  const { id } = route.params;
  const [customer, setCustomer] = useState(null);

  const load = useCallback(async () => {
    const { data } = await api.get(`/customers/${id}`);
    setCustomer(data);
  }, [id]);

  React.useEffect(() => { load(); }, [load]);

  if (!customer) return <Screen><Text className="text-zinc-400">Loading...</Text></Screen>;

  return (
    <Screen>
      <ScrollView>
        <Title>{customer.name}</Title>
        <Card>
          <Text className="text-zinc-400">{customer.email}</Text>
          <Text className="text-zinc-400">{customer.phone || 'No phone listed'}</Text>
        </Card>
        <Card>
          <Text className="text-white font-semibold mb-2">Vehicles</Text>
          {(customer.vehicles || []).map((v, i) => <Text key={i} className="text-zinc-400">{v.year} {v.make} {v.model} - {v.vin}</Text>)}
        </Card>
        <Card>
          <Text className="text-white font-semibold mb-2">Repair Order History</Text>
          {(customer.repairOrders || []).map((ro, i) => (
            <Text key={i} className="text-zinc-400">RO #{ro.roNumber || ro.id} - {(ro.status || 'unknown').toUpperCase()}</Text>
          ))}
        </Card>
      </ScrollView>
    </Screen>
  );
}
