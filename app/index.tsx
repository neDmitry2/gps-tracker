import TrackerControls from '@/components/controls';
import MapDisplay from '@/components/map';
import { LocationObjectCoords } from 'expo-location';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Index() {
  const [isTracking, setIsTracking] = useState(false);
  const [route, setRoute] = useState<LocationObjectCoords[]>([]);

  const handleStart = () => {
    console.log("Start tracking...");
    setIsTracking(true);
  };

  const handleStop = () => {
    console.log("Stop tracking...");
    setIsTracking(false);
  };

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
});
