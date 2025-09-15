import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarStyle: {
            backgroundColor: '#fff',
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Запись',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="map" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Маршруты',
          headerTitle: 'История тренировок',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="history" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
