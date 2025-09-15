import { saveWorkout } from '@/utils/database';
import * as Location from 'expo-location';
import haversine from 'haversine';
import { useEffect, useRef, useState } from 'react';

// Опции для отслеживания геолокации
const locationOptions: Location.LocationOptions = {
  accuracy: Location.Accuracy.BestForNavigation,
  timeInterval: 1000,
  distanceInterval: 10,
};

export const useLocationTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [route, setRoute] = useState<Location.LocationObjectCoords[]>([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  // useRef используется для хранения значений, которые не вызывают перерисовку
  const locationSubscriber = useRef<Location.LocationSubscription | null>(null);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);;
  
  // Функция для старта отслеживания
  const startTracking = async () => {
    setRoute([]);
    setDistance(0);
    setDuration(0);
    setIsTracking(true);

    // Таймер, который обновляет длительность каждую секунду
    timerInterval.current = setInterval(() => {
      setDuration((prevDuration) => prevDuration + 1);
    }, 1000);

    // Подписываемся на обновления геолокации
    try {
      locationSubscriber.current = await Location.watchPositionAsync(
        locationOptions,
        (location: Location.LocationObject) => {
          const newCoord = location.coords;
          setRoute((prevRoute) => {
            // Рассчитываем дистанцию при добавлении новой точки
            if (prevRoute.length > 0) {
              const lastCoord = prevRoute[prevRoute.length - 1];
              const newDistance = haversine(lastCoord, newCoord, { unit: 'km' });
              setDistance((prevDistance) => prevDistance + newDistance);
            }
            return [...prevRoute, newCoord];
          });
        }
      );
    } catch (error) {
      console.error("Failed to start location tracking", error);
      setIsTracking(false);
    }
  };

  // Функция для остановки отслеживания
  const stopTracking = () => {
    setIsTracking(false);

    // Отписываемся от обновлений геолокации
    if (locationSubscriber.current) {
      locationSubscriber.current.remove();
      locationSubscriber.current = null;
    }

    // Останавливаем таймер
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }

    // Сохраняем тренировку в БД, если есть что сохранять
    if (route.length > 1) {
      const workoutToSave = {
        date: new Date().toISOString(),
        distance: distance,
        duration: duration,
        route: route,
      };
      saveWorkout(workoutToSave)
        .then(() => alert('Тренировка сохранена!'))
        .catch(err => console.error("Failed to save workout", err));
    }
  };
  
  // useEffect для очистки при размонтировании компонента (важно!)
  useEffect(() => {
    return () => {
      if (locationSubscriber.current) {
        locationSubscriber.current.remove();
      }
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, []);

  return { isTracking, route, distance, duration, startTracking, stopTracking };
};
