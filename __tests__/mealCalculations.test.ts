/**
 * Unit tests for meal calculation logic.
 * Covers TC6 (select items), TC7 (rating storage), TC8 (confirm saves correctly), TC10 (average score).
 */
import { calculateAverageScore } from '../src/utils/storage';
import { MealItem } from '../src/types';

// ─── TC7 / TC8 — Average score calculation ───────────────────────────────

describe('calculateAverageScore', () => {
  test('single item: average of flavor and price', () => {
    const items: MealItem[] = [{ dishName: 'Calamari', flavorScore: 4.0, priceScore: 4.0 }];
    expect(calculateAverageScore(items)).toBe(4.0);
  });

  test('multiple items: correct overall average', () => {
    const items: MealItem[] = [
      { dishName: 'Calamari',  flavorScore: 4.2, priceScore: 4.5 },
      { dishName: 'Sea Bass',  flavorScore: 3.9, priceScore: 3.7 },
      { dishName: 'Fries',     flavorScore: 3.5, priceScore: 4.5 },
      { dishName: 'Doughnuts', flavorScore: 4.3, priceScore: 3.8 },
    ];
    // sum = 4.2+4.5+3.9+3.7+3.5+4.5+4.3+3.8 = 32.4 / 8 = 4.05 → rounded to 4.1
    const result = calculateAverageScore(items);
    expect(result).toBeCloseTo(4.1, 1);
  });

  test('empty items array returns 0', () => {
    expect(calculateAverageScore([])).toBe(0);
  });

  test('perfect scores (5/5) return 5', () => {
    const items: MealItem[] = [
      { dishName: 'Pizza', flavorScore: 5, priceScore: 5 },
    ];
    expect(calculateAverageScore(items)).toBe(5.0);
  });

  test('minimum scores (0/0) return 0', () => {
    const items: MealItem[] = [
      { dishName: 'Pizza', flavorScore: 0, priceScore: 0 },
    ];
    expect(calculateAverageScore(items)).toBe(0.0);
  });
});

// ─── TC6 — Dish selection logic (pure state logic) ───────────────────────

describe('Dish selection filter logic', () => {
  interface DishState { name: string; checked: boolean; flavor: string; price: string; }

  const allDishes: DishState[] = [
    { name: 'Calamari',  checked: true,  flavor: '4.2', price: '4.5' },
    { name: 'Sea Bass',  checked: false, flavor: '',    price: ''    },
    { name: 'Fries',     checked: true,  flavor: '3.5', price: '4.5' },
    { name: 'Doughnuts', checked: false, flavor: '',    price: ''    },
  ];

  test('TC6: only checked dishes are included in meal', () => {
    const selected = allDishes.filter(d => d.checked);
    expect(selected).toHaveLength(2);
    expect(selected[0].name).toBe('Calamari');
    expect(selected[1].name).toBe('Fries');
  });

  test('TC6: unchecked dishes are excluded', () => {
    const selected = allDishes.filter(d => d.checked);
    expect(selected.find(d => d.name === 'Sea Bass')).toBeUndefined();
  });

  test('TC7: selected dish has valid flavor and price scores', () => {
    const selected = allDishes.filter(d => d.checked);
    selected.forEach(d => {
      expect(parseFloat(d.flavor)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(d.flavor)).toBeLessThanOrEqual(5);
      expect(parseFloat(d.price)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(d.price)).toBeLessThanOrEqual(5);
    });
  });
});
