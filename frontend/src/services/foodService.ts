import api from "../api/axios";
import type { FoodCardData } from "../components/food/FoodCard";

interface BackendFood {
  id: number;
  food_name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber?: number;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

function getMealTypes(food: BackendFood): string[] {
  const mealTypes: string[] = [];

  if (food.breakfast) mealTypes.push("Breakfast");
  if (food.lunch) mealTypes.push("Lunch");
  if (food.dinner) mealTypes.push("Dinner");

  return mealTypes.length > 0 ? mealTypes : ["Other"];
}

function toFoodCardData(food: BackendFood): FoodCardData {
  const mealTypes = getMealTypes(food);

  return {
    id: food.id,
    name: food.food_name,
    category: mealTypes.join(", "),
    mealTypes,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
  };
}

export const getFoods = async (
  search?: string,
  meal?: string
): Promise<FoodCardData[]> => {
  const response = await api.get<{ success: boolean; foods: BackendFood[] }>(
    "/food/",
    { params: { search, meal } }
  );

  return response.data.foods.map(toFoodCardData);
};

export const getFoodById = async (id: number): Promise<FoodCardData> => {
  const response = await api.get<{ success: boolean; food: BackendFood }>(
    `/food/${id}`
  );

  return toFoodCardData(response.data.food);
};
