import TrackerControls from '@/components/controls';
import MapDisplay from '@/components/map';
import { useAppSetup } from '@/hooks/useAppSetup';
import { LocationObjectCoords } from 'expo-location';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const { isLoading, error } = useAppSetup();
  const [isTracking, setIsTracking] = useState(false);
  const [route, setRoute] = useState<LocationObjectCoords[]>([]);

  const handleStart = () => {
    setIsTracking(true);
  };

  const handleStop = () => {
    setIsTracking(false);
  };

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
      <TrackerControls 
        isTracking={isTracking}
        onStart={handleStart}
        onStop={handleStop}
      />
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
