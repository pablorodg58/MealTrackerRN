jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem:    jest.fn(),
  setItem:    jest.fn(),
  removeItem: jest.fn(),
}));

import { calculateAverageScore } from '../src/utils/storage';
import { MealItem } from '../src/types';


describe('calculateAverageScore (TC7)', () => {
  test('single dish returns correct average', () => {
    const items: MealItem[] = [{ dishName: 'Calamari', flavorScore: 4, priceScore: 4 }];
    expect(calculateAverageScore(items)).toBe(4.0);
  });

  test('multiple dishes returns correct overall average', () => {
    const items: MealItem[] = [
      { dishName: 'Calamari', flavorScore: 4, priceScore: 4 },
      { dishName: 'Sea Bass', flavorScore: 2, priceScore: 2 },
    ];
    expect(calculateAverageScore(items)).toBe(3.0);
  });

  test('empty list returns 0', () => {
    expect(calculateAverageScore([])).toBe(0);
  });
});


describe('Dish selection filter (TC6)', () => {
  const dishes = [
    { name: 'Calamari', checked: true,  flavor: '4', price: '4' },
    { name: 'Sea Bass', checked: false, flavor: '',  price: ''  },
  ];

  test('only checked dishes are included', () => {
    const selected = dishes.filter(d => d.checked);
    expect(selected).toHaveLength(1);
    expect(selected[0].name).toBe('Calamari');
  });

  test('unchecked dishes are excluded', () => {
    const selected = dishes.filter(d => d.checked);
    expect(selected.find(d => d.name === 'Sea Bass')).toBeUndefined();
  });
});
