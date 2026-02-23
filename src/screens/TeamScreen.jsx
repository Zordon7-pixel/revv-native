import React, { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import api from '../lib/api';
import { Card, Screen, Title } from './ui';

export default function TeamScreen({ navigation }) {
  const [users, setUsers] = useState([]);

  const load = useCallback(async () => {
    const { data } = await api.get('/users');
    setUsers(Array.isArray(data) ? data : data.items || []);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  return (
    <Screen>
      <View className="flex-row justify-between items-center mb-3"><Title>Team</Title><Text onPress={() => navigation.navigate('TimeClockAdmin')} className="text-accent">Time Clock</Text></View>
      <FlatList
        data={users}
        keyExtractor={(item, idx) => String(item.id || idx)}
        renderItem={({ item }) => (
          <Card>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-white font-semibold">{item.name}</Text>
                <Text className="text-zinc-400 capitalize">{item.role}</Text>
              </View>
              <Text className={item.clockedIn ? 'text-green-400' : 'text-zinc-400'}>{item.clockedIn ? 'Clocked In' : 'Clocked Out'}</Text>
            </View>
          </Card>
        )}
      />
    </Screen>
  );
}
