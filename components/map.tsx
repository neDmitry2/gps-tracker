import { LocationObjectCoords } from 'expo-location';
import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

interface MapDisplayProps {
  route: LocationObjectCoords[];
  showLocationButton?: boolean;
  fitToRoute?: boolean;
}

export default function MapDisplay({ route, showLocationButton = true, fitToRoute = false, }: MapDisplayProps) {

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!mapRef.current || route.length == 0) {
      return;
    }

    if (fitToRoute) {
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.fitToCoordinates(route, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      }, 500);
    }
    else {
      const lastCoord = route[route.length - 1];

      mapRef.current.animateToRegion(
        {
          latitude: lastCoord.latitude,
          longitude: lastCoord.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.005,
        },
        1000
      );
    }
  }, [route, fitToRoute]);
  
  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      showsUserLocation = {showLocationButton}
      showsMyLocationButton={showLocationButton}
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
          strokeColor="#ff9100ff"
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
