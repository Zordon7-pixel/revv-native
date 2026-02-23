import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import api from '../lib/api';
import { Card, Screen, Title } from './ui';

const timeline = ['intake', 'estimate', 'approval', 'parts', 'repair', 'paint', 'qc', 'delivery'];

export default function ROStatusScreen({ route }) {
  const { id } = route.params;
  const [ro, setRo] = useState(null);

  useEffect(() => {
    api.get(`/repair-orders/${id}`).then(({ data }) => setRo(data));
  }, [id]);

  if (!ro) return <Screen><Text className="text-zinc-400">Loading...</Text></Screen>;

  const currentIndex = timeline.indexOf((ro.status || '').toLowerCase());

  return (
    <Screen>
      <ScrollView>
        <Title>RO Status</Title>
        <Card>
          <Text className="text-white font-semibold mb-3">Repair Timeline</Text>
          {timeline.map((step, idx) => (
            <View key={step} className="flex-row items-center mb-2">
              <View className={`w-2 h-2 rounded-full mr-2 ${idx <= currentIndex ? 'bg-accent' : 'bg-zinc-700'}`} />
              <Text className={idx <= currentIndex ? 'text-white uppercase' : 'text-zinc-500 uppercase'}>{step}</Text>
            </View>
          ))}
        </Card>
        <Card>
          <Text className="text-white font-semibold mb-2">Parts</Text>
          {(ro.parts || []).map((p, i) => (
            <Text key={i} className="text-zinc-400">{p.name} - Expected: {p.expectedDate || 'TBD'}</Text>
          ))}
        </Card>
      </ScrollView>
    </Screen>
  );
}
