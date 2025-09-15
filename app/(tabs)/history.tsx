import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { fetchWorkouts, Workout } from '../../utils/database';

export default function HistoryScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const loadWorkouts = async () => {
        try {
          setIsLoading(true);
          const data = await fetchWorkouts();
          setWorkouts(data);
        } catch (error) {
          console.error("Failed to fetch workouts:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadWorkouts();

      return () => {};
    }, [])
  );

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (workouts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>История тренировок пуста.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Workout }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemDate}>
        {new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}
      </Text>
      <Text style={styles.itemDetails}>
        Дистанция: {item.distance.toFixed(2)} км
      </Text>
      <Text style={styles.itemDetails}>
        Время: {Math.floor(item.duration / 60)} мин {item.duration % 60} сек
      </Text>
    </View>
  );

  return (
    <FlatList
      data={workouts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 14,
    color: '#333',
  },
});
