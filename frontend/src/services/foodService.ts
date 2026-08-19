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

export interface FoodPagination {
  page: number;
  per_page: number;
  total: number;
  pages: number;
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
  meal?: string,
  page = 1,
  perPage = 24
): Promise<{ foods: FoodCardData[]; pagination: FoodPagination }> => {
  const response = await api.get<{
    success: boolean;
    foods: BackendFood[];
    pagination: FoodPagination;
  }>(
    "/food/",
    { params: { search, meal, page, per_page: perPage } }
  );

  return {
    foods: response.data.foods.map(toFoodCardData),
    pagination: response.data.pagination,
  };
};

export const getFoodById = async (id: number): Promise<FoodCardData> => {
  const response = await api.get<{ success: boolean; food: BackendFood }>(
    `/food/${id}`
  );

  return toFoodCardData(response.data.food);
};
