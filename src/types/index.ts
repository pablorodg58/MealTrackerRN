export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  dishes: string[];
}

export interface MealItem {
  dishName: string;
  flavorScore: number;
  priceScore: number;
}

export interface Meal {
  id: string;
  restaurantId: string;
  userId: string;
  date: string;
  items: MealItem[];
  averageScore: number;
}
