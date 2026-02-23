import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import api from '../lib/api';
import { Card, Screen, Title } from './ui';

export default function SettingsScreen() {
  const [data, setData] = useState({});

  useEffect(() => {
    api.get('/auth/me').then(({ data: me }) => setData(me.shop || me));
  }, []);

  return (
    <Screen>
      <ScrollView>
        <Title>Settings</Title>
        <Card>
          <Text className="text-zinc-400">Shop Name</Text>
          <Text className="text-white">{data.name || 'REVV Shop'}</Text>
        </Card>
        <Card>
          <Text className="text-zinc-400">Email</Text>
          <Text className="text-white">{data.email || 'Not available'}</Text>
        </Card>
        <Card>
          <Text className="text-zinc-400">Address</Text>
          <Text className="text-white">{data.address || 'Not available'}</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}
