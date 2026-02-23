import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput } from 'react-native';
import api from '../lib/api';
import { Card, Screen, Title } from './ui';

export default function CreateROScreen({ navigation }) {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({ customer_id: '', make: '', model: '', year: '', vin: '', mileage: '', description: '' });

  React.useEffect(() => {
    api.get('/customers').then(({ data }) => setCustomers(Array.isArray(data) ? data : data.items || []));
  }, []);

  const list = useMemo(() => customers.filter((c) => c.name?.toLowerCase().includes(query.toLowerCase())), [customers, query]);

  const create = async () => {
    try {
      await api.post('/repair-orders', {
        customer_id: form.customer_id,
        vehicle: { make: form.make, model: form.model, year: form.year, vin: form.vin, mileage: form.mileage },
        description: form.description,
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Create failed', e?.response?.data?.message || 'Unable to create repair order.');
    }
  };

  return (
    <Screen>
      <ScrollView>
        <Title>Create Repair Order</Title>
        <Card>
          <TextInput value={query} onChangeText={setQuery} placeholder="Search customer" placeholderTextColor="#9CA3AF" className="bg-zinc-900 text-white p-3 rounded-lg border border-zinc-700" />
          {list.slice(0, 5).map((c) => (
            <Pressable key={c.id} onPress={() => setForm((f) => ({ ...f, customer_id: c.id }))} className="py-2 border-b border-zinc-800">
              <Text className={`text-sm ${String(form.customer_id) === String(c.id) ? 'text-accent' : 'text-white'}`}>{c.name}</Text>
            </Pressable>
          ))}
        </Card>
        {['make', 'model', 'year', 'vin', 'mileage', 'description'].map((f) => (
          <TextInput
            key={f}
            value={form[f]}
            onChangeText={(v) => setForm((s) => ({ ...s, [f]: v }))}
            placeholder={f.toUpperCase()}
            placeholderTextColor="#9CA3AF"
            className="bg-bg-card text-white p-3 rounded-xl mb-3 border border-zinc-800"
          />
        ))}
        <Pressable onPress={create} className="bg-accent rounded-xl py-4 items-center mb-6"><Text className="text-white font-semibold">Create</Text></Pressable>
      </ScrollView>
    </Screen>
  );
}
