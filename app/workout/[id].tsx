import MapDisplay from '@/components/map';
import StatsPanel from '@/components/stats';
import { LocationObjectCoords } from 'expo-location';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function WorkoutDetailScreen() {
  const params = useLocalSearchParams();

  const date = params.date as string;
  const distance = parseFloat(params.distance as string);
  const duration = parseInt(params.duration as string, 10);
  // Маршрут передается как JSON-строка, ее нужно распарсить
  const route: LocationObjectCoords[] = JSON.parse(params.route as string);

  // Форматируем дату для заголовка
  const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: formattedDate,
        }}
      />
      
      <MapDisplay route={route} showLocationButton={false} fitToRoute={true} />
      <StatsPanel distance={distance} duration={duration} showButton={false}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingTop: 10,
    paddingBottom: 200,
  },
});

