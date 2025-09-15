import { deleteWorkout, fetchWorkouts, Workout } from '@/utils/database';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

  const handleDelete = (id: number) => {
    Alert.alert(
      "Подтверждение",
      "Вы уверены, что хотите удалить эту тренировку?",
      [
        { text: "Отмена", style: "cancel" },
        { 
          text: "Удалить", 
          onPress: async () => {
            try {
              await deleteWorkout(id);
              //Фильтр чтобы быстро скрыть удалённый элемент
              setWorkouts(prevWorkouts => prevWorkouts.filter(w => w.id !== id));
            } catch (error) {
              console.error("Failed to delete workout:", error);
              Alert.alert("Ошибка", "Не удалось удалить тренировку.");
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

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
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <FontAwesome name="trash-o" size={24} color="#D9342B" />
      </TouchableOpacity>
      
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
    paddingRight: 30, 
  },
  itemDetails: {
    fontSize: 14,
    color: '#333',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
});