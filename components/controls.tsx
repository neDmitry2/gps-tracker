import { Colors } from '@/constants/theme';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

interface TrackerControlsProps {
  isTracking: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function TrackerControls({ isTracking, onStart, onStop }: TrackerControlsProps) {
  return (
    <View style={styles.container}>
      {isTracking ? (
        <Button title="Stop Tracking" onPress={onStop} color={Colors.danger} />
      ) : (
        <Button title="Start Tracking" onPress={onStart} color={Colors.primary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
});
