import type { Food } from "./food";

export type MealType = "breakfast" | "lunch" | "dinner";

export interface MealItem {
  food: Food;
  quantity: number;
  calories: number;
}

export interface Meal {
  meal_type: MealType;
  items: MealItem[];
  total_calories: number;
}