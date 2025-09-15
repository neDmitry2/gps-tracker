import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type StatsPanelProps = {
  distance: number;
  duration: number;
};

// Функция для форматирования секунд в формат ММ:СС
const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function StatsPanel({ distance, duration }: StatsPanelProps) {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statBox}>
        <Text style={styles.statValue}>{distance.toFixed(2)}</Text>
        <Text style={styles.statLabel}>КМ</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statValue}>{formatTime(duration)}</Text>
        <Text style={styles.statLabel}>ВРЕМЯ</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    position: 'absolute',
    top: 80,
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
