import { MapDisplayRef } from '@/components/map';
import * as Location from 'expo-location';
import { RefObject, useState } from 'react';
import { Alert } from 'react-native';

export const useMapCenter = (mapRef: RefObject<MapDisplayRef>) => {
  const [isCentering, setIsCentering] = useState(false);

  const centerMap = async () => {
    if (!mapRef.current) {
      console.warn("Map ref еще не доступен.");
      return;
    }

    setIsCentering(true);
    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      
      const command = {
        type: 'center',
        payload: location.coords,
      };

      mapRef.current.postMessage(JSON.stringify(command));

    } catch (e) {
      Alert.alert("Ошибка", "Не удалось определить вашу геолокацию.");
    } finally {
      setIsCentering(false);
    }
  };

  return { centerMap, isCentering };
};