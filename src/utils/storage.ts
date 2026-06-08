import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Meal, MealItem } from '../types';

const K = {
  USERS:        '@mt/users',
  CURRENT_USER: '@mt/currentUser',
  MEALS:        '@mt/meals',
};

async function getJSON<T>(key: string): Promise<T[]> {
  const json = await AsyncStorage.getItem(key);
  return json ? (JSON.parse(json) as T[]) : [];
}
async function setJSON<T>(key: string, data: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

export const getUsers = () => getJSON<User>(K.USERS);
export const saveUsers = (users: User[]) => setJSON<User>(K.USERS, users);

export async function findUserByUsername(username: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.username.toLowerCase() === username.toLowerCase()) ?? null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function addUser(user: User): Promise<void> {
  const users = await getUsers();
  users.push(user);
  await saveUsers(users);
}

export const getCurrentUserId = (): Promise<string | null> =>
  AsyncStorage.getItem(K.CURRENT_USER);

export const setCurrentUserId = (id: string): Promise<void> =>
  AsyncStorage.setItem(K.CURRENT_USER, id);

export const clearSession = (): Promise<void> =>
  AsyncStorage.removeItem(K.CURRENT_USER);

export const getMeals = () => getJSON<Meal>(K.MEALS);
export const saveMeals = (meals: Meal[]) => setJSON<Meal>(K.MEALS, meals);

export async function addMeal(meal: Meal): Promise<void> {
  const meals = await getMeals();
  meals.push(meal);
  await saveMeals(meals);
}

export async function getAllMeals(): Promise<Meal[]> {
  const meals = await getMeals();
  return meals.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getMealsByUser(userId: string): Promise<Meal[]> {
  const meals = await getMeals();
  return meals
    .filter((m) => m.userId === userId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getMealsByRestaurant(restaurantId: string): Promise<Meal[]> {
  const meals = await getMeals();
  return meals
    .filter((m) => m.restaurantId === restaurantId)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
}

export async function getMealById(id: string): Promise<Meal | null> {
  const meals = await getMeals();
  return meals.find((m) => m.id === id) ?? null;
}

export function calculateAverageScore(items: MealItem[]): number {
  if (items.length === 0) return 0;
  const total = items.reduce((sum, i) => sum + i.flavorScore + i.priceScore, 0);
  return Math.round((total / (items.length * 2)) * 10) / 10;
}
