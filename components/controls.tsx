import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface TrackerControlsProps {
  isTracking: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function TrackerControls({ isTracking, onStart, onStop }: TrackerControlsProps) {
  return (
    <TouchableOpacity onPress={isTracking ? onStop : onStart} style={styles.button}>
      <Ionicons
        name={isTracking ? 'stop-circle' : 'play-circle'}
        size={56}
        color={isTracking ? '#D9342B' : '#007AFF'}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 20,
  },
});
