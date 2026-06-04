/**
 * Unit tests for storage utilities (AsyncStorage mocked).
 * Covers TC4 (restaurant data), TC10 (meal list), TC11 (meal detail), TC12 (logout/session).
 */

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem:    jest.fn(),
  setItem:    jest.fn(),
  removeItem: jest.fn(),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getUsers, saveUsers, addUser, findUserByUsername, findUserByEmail,
  getCurrentUserId, setCurrentUserId, clearSession,
  getMeals, addMeal, getMealsByUser, getMealsByRestaurant, getMealById,
  calculateAverageScore,
} from '../src/utils/storage';
import { User, Meal } from '../src/types';

const mockGet = AsyncStorage.getItem as jest.Mock;
const mockSet = AsyncStorage.setItem as jest.Mock;
const mockRem = AsyncStorage.removeItem as jest.Mock;

beforeEach(() => jest.clearAllMocks());

// ─── Users ────────────────────────────────────────────────────────────────

const user: User = { id: '1', email: 'a@b.com', username: 'alice', passwordHash: 'hash1' };

test('getUsers returns empty array when storage is empty', async () => {
  mockGet.mockResolvedValueOnce(null);
  const result = await getUsers();
  expect(result).toEqual([]);
});

test('getUsers parses stored JSON array', async () => {
  mockGet.mockResolvedValueOnce(JSON.stringify([user]));
  const result = await getUsers();
  expect(result).toHaveLength(1);
  expect(result[0].username).toBe('alice');
});

test('addUser appends user and saves', async () => {
  mockGet.mockResolvedValueOnce(null); // empty list
  mockSet.mockResolvedValueOnce(undefined);
  await addUser(user);
  expect(mockSet).toHaveBeenCalledWith('@mt/users', JSON.stringify([user]));
});

test('findUserByUsername returns matching user (case-insensitive)', async () => {
  mockGet.mockResolvedValueOnce(JSON.stringify([user]));
  const found = await findUserByUsername('ALICE');
  expect(found?.id).toBe('1');
});

test('findUserByUsername returns null when not found', async () => {
  mockGet.mockResolvedValueOnce(JSON.stringify([user]));
  const found = await findUserByUsername('bob');
  expect(found).toBeNull();
});

test('findUserByEmail returns matching user', async () => {
  mockGet.mockResolvedValueOnce(JSON.stringify([user]));
  expect(await findUserByEmail('a@b.com')).not.toBeNull();
});

// ─── Session (TC12) ───────────────────────────────────────────────────────

test('TC12: clearSession calls removeItem on current user key', async () => {
  mockRem.mockResolvedValueOnce(undefined);
  await clearSession();
  expect(mockRem).toHaveBeenCalledWith('@mt/currentUser');
});

test('setCurrentUserId stores the id', async () => {
  mockSet.mockResolvedValueOnce(undefined);
  await setCurrentUserId('42');
  expect(mockSet).toHaveBeenCalledWith('@mt/currentUser', '42');
});

test('getCurrentUserId returns stored id', async () => {
  mockGet.mockResolvedValueOnce('42');
  expect(await getCurrentUserId()).toBe('42');
});

// ─── Meals (TC10, TC11) ───────────────────────────────────────────────────

const meal: Meal = {
  id: 'm1', restaurantId: '1', userId: '1', date: '2026-06-01',
  items: [{ dishName: 'Calamari', flavorScore: 4.2, priceScore: 4.5 }],
  averageScore: 4.4,
};

test('getMeals returns empty array when storage is empty', async () => {
  mockGet.mockResolvedValueOnce(null);
  expect(await getMeals()).toEqual([]);
});

test('TC10: getMealsByUser returns meals for that user sorted by date desc', async () => {
  const older: Meal = { ...meal, id: 'm0', date: '2026-05-01', userId: '1' };
  mockGet.mockResolvedValueOnce(JSON.stringify([meal, older]));
  const result = await getMealsByUser('1');
  expect(result[0].date).toBe('2026-06-01'); // most recent first
  expect(result[1].date).toBe('2026-05-01');
});

test('TC10: getMealsByUser excludes other users\' meals', async () => {
  const otherMeal: Meal = { ...meal, id: 'm2', userId: '999' };
  mockGet.mockResolvedValueOnce(JSON.stringify([meal, otherMeal]));
  const result = await getMealsByUser('1');
  expect(result).toHaveLength(1);
});

test('TC11: getMealById returns correct meal', async () => {
  mockGet.mockResolvedValueOnce(JSON.stringify([meal]));
  const found = await getMealById('m1');
  expect(found?.id).toBe('m1');
  expect(found?.items[0].dishName).toBe('Calamari');
});

test('TC11: getMealById returns null when not found', async () => {
  mockGet.mockResolvedValueOnce(JSON.stringify([meal]));
  expect(await getMealById('nonexistent')).toBeNull();
});

test('TC4: getMealsByRestaurant returns last 5 meals for that restaurant', async () => {
  const meals: Meal[] = Array.from({ length: 7 }, (_, i) => ({
    ...meal, id: `m${i}`, date: `2026-0${i + 1}-01`, restaurantId: '1', userId: '1',
  }));
  mockGet.mockResolvedValueOnce(JSON.stringify(meals));
  const result = await getMealsByRestaurant('1', '1');
  expect(result).toHaveLength(5); // max 5 returned
});
