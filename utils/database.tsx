import { LocationObjectCoords } from 'expo-location';
import * as SQLite from 'expo-sqlite';

export interface Workout {
  id: number;
  date: string;
  distance: number;
  duration: number;
  route: LocationObjectCoords[];
}

const db = SQLite.openDatabaseAsync('workouts');

export const initDatabase = async (): Promise<void> => {
  await (await db).execAsync(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY NOT NULL,
      date TEXT NOT NULL,
      distance REAL NOT NULL,
      duration INTEGER NOT NULL,
      route TEXT NOT NULL
    );`
    );
};

export const saveWorkout = async (workout: Omit<Workout, 'id'>): Promise<void> => {
  const { date, distance, duration, route } = workout;
  const routeString = JSON.stringify(route);

  const result = await (await db).runAsync(
    'INSERT INTO workouts (date, distance, duration, route) VALUES (?, ?, ?, ?);',
    [date, distance, duration, routeString]
  );
};

export const fetchWorkouts = async (): Promise<Workout[]> => {

  const allRows = await (await db).getAllAsync<Workout>('SELECT * FROM workouts ORDER BY date DESC;');
  
  return allRows.map(workout => ({
    ...workout,
    route: JSON.parse(workout.route as any),
  }));
};