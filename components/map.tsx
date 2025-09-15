import { LocationObjectCoords } from 'expo-location';
import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

interface MapDisplayProps {
  route: LocationObjectCoords[];
}

export default function MapDisplay({ route }: MapDisplayProps) {
  return (
    <MapView
      style={styles.map}
      showsUserLocation
      followsUserLocation
      initialRegion={{
        latitude: 56.01839,
        longitude: 92.86717,
        latitudeDelta: 0.1,
        longitudeDelta: 0.05,
      }}
      mapPadding={{
        top: 20,
        right: 0,
        bottom: 0,
        left: 0,
      }}
    >
      {route.length > 1 && (
        <Polyline
          coordinates={route}
          strokeColor="#FF0000"
          strokeWidth={6}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});
