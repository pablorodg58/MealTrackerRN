jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem:    jest.fn(),
  setItem:    jest.fn(),
  removeItem: jest.fn(),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addUser, findUserByUsername, findUserByEmail,
  getCurrentUserId, setCurrentUserId, clearSession,
  addMeal, getMealsByUser,
} from '../src/utils/storage';
import { User, Meal, MealItem } from '../src/types';

const mockGet    = AsyncStorage.getItem    as jest.Mock;
const mockSet    = AsyncStorage.setItem    as jest.Mock;
const mockRemove = AsyncStorage.removeItem as jest.Mock;

beforeEach(() => jest.clearAllMocks());


describe('User storage (TC4)', () => {
  const user: User = {
    id: '1', email: 'test@york.ac.uk', username: 'testuser', password: 'Pass123!',
  };

  test('addUser saves the new user', async () => {
    mockGet.mockResolvedValueOnce(null);
    mockSet.mockResolvedValueOnce(undefined);
    await addUser(user);
    expect(mockSet).toHaveBeenCalledWith('@mt/users', JSON.stringify([user]));
  });

  test('findUserByUsername returns the correct user', async () => {
    mockGet.mockResolvedValueOnce(JSON.stringify([user]));
    const found = await findUserByUsername('testuser');
    expect(found?.email).toBe('test@york.ac.uk');
  });

  test('findUserByEmail returns null for unknown email', async () => {
    mockGet.mockResolvedValueOnce(JSON.stringify([user]));
    const found = await findUserByEmail('other@york.ac.uk');
    expect(found).toBeNull();
  });
});


describe('Session management (TC12)', () => {
  test('setCurrentUserId stores the id', async () => {
    mockSet.mockResolvedValueOnce(undefined);
    await setCurrentUserId('user-1');
    expect(mockSet).toHaveBeenCalledWith('@mt/currentUser', 'user-1');
  });

  test('clearSession removes the session key', async () => {
    mockRemove.mockResolvedValueOnce(undefined);
    await clearSession();
    expect(mockRemove).toHaveBeenCalledWith('@mt/currentUser');
  });

  test('getCurrentUserId returns null when not logged in', async () => {
    mockGet.mockResolvedValueOnce(null);
    const id = await getCurrentUserId();
    expect(id).toBeNull();
  });
});


describe('Meal storage (TC10, TC11)', () => {
  const item: MealItem = { dishName: 'Calamari', flavorScore: 4, priceScore: 3 };
  const meal: Meal = {
    id: 'meal-1', restaurantId: '1', userId: 'user-1',
    date: '2025-06-01', items: [item], averageScore: 3.5,
  };

  test('addMeal saves the meal', async () => {
    mockGet.mockResolvedValueOnce(null);
    mockSet.mockResolvedValueOnce(undefined);
    await addMeal(meal);
    expect(mockSet).toHaveBeenCalledWith('@mt/meals', JSON.stringify([meal]));
  });

  test('getMealsByUser returns only the logged-in user meals', async () => {
    const other = { ...meal, id: 'meal-2', userId: 'other-user' };
    mockGet.mockResolvedValueOnce(JSON.stringify([meal, other]));
    const result = await getMealsByUser('user-1');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('meal-1');
  });

  test('getMealsByUser returns empty when no meals exist', async () => {
    mockGet.mockResolvedValueOnce(null);
    const result = await getMealsByUser('user-1');
    expect(result).toHaveLength(0);
  });
});
