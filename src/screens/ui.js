import React from 'react';
import { Text, View } from 'react-native';

export const Screen = ({ children }) => <View className="flex-1 bg-bg-base px-4 pt-4">{children}</View>;

export const Card = ({ children, className = '' }) => (
  <View className={`bg-bg-card rounded-xl p-4 mb-3 border border-zinc-800 ${className}`}>{children}</View>
);

export const Title = ({ children }) => <Text className="text-white text-2xl font-semibold">{children}</Text>;

const statusStyle = {
  intake: 'bg-zinc-700',
  estimate: 'bg-blue-700',
  approval: 'bg-amber-700',
  parts: 'bg-violet-700',
  repair: 'bg-cyan-700',
  paint: 'bg-pink-700',
  qc: 'bg-emerald-700',
  delivery: 'bg-orange-700',
  closed: 'bg-green-700',
};

export const StatusBadge = ({ status }) => {
  const s = (status || '').toLowerCase();
  return (
    <View className={`px-2 py-1 rounded-full ${statusStyle[s] || 'bg-zinc-700'}`}>
      <Text className="text-white text-xs font-medium uppercase">{s || 'unknown'}</Text>
    </View>
  );
};
