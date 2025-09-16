import MapDisplay from '@/components/map';
import StatsPanel from '@/components/stats';
import { useAppSetup } from '@/hooks/useAppSetup';
import { useLocationTracker } from '@/hooks/useLocationTracker';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const { isLoading, error } = useAppSetup();

  const { 
    isTracking, 
    route, 
    distance, 
    duration, 
    startTracking, 
    stopTracking 
  } = useLocationTracker();

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorTextTitle}>Ошибка</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapDisplay route={route} />
      <StatsPanel distance={distance} duration={duration} showButton={true} onStart={startTracking} onStop={stopTracking} isTracking={isTracking} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  errorTextTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D9342B',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#D9342B',
    textAlign: 'center',
  },
});
