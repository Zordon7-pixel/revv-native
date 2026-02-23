import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import api from '../lib/api';
import { Card, Screen, Title } from './ui';

export default function ScheduleScreen() {
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    api.get('/schedule/my').then(({ data }) => setShifts(data?.shifts || []));
  }, []);

  return (
    <Screen>
      <ScrollView>
        <Title>Schedule</Title>
        {shifts.map((s, i) => (
          <Card key={i}>
            <Text className="text-white font-semibold">{s.day || s.date}</Text>
            <Text className="text-zinc-400 mt-1">{s.start} - {s.end}</Text>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}
