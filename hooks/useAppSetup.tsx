import { initDatabase } from '@/utils/database';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const useAppSetup = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const initializeApp = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Разрешение на доступ к местоположению было отклонено. Приложение не может работать без него.');
          setIsLoading(false);
        }

        const gpsEnabled = await Location.hasServicesEnabledAsync();
        if (!gpsEnabled) {
          Alert.alert(
            "GPS выключен",
            "Пожалуйста, включите геолокацию в настройках вашего устройства для корректной работы приложения.",
            [{ text: "OK" }]
          );
          setError('Сервисы геолокации (GPS) отключены.');
          setIsLoading(false);
          return;
        }

        await initDatabase();

        setError(null);

      } catch (err: any) {
        setError(`Произошла ошибка: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

  }, []);

  return { isLoading, error };
};
