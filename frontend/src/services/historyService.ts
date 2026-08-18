import api from "../api/axios";

export interface RecommendationFood {
  food_id: number;
  food_name: string;
  meal_type: string;
  portion_grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface RecommendationLog {
  id: number;
  meal_plan_id?: number;
  target_calories: number;
  goal: string;
  cluster_id: number | null;
  generated_at: string | null;
  foods?: RecommendationFood[];
}

export interface FoodIntakeLog {
  id: number;
  food_id: number;
  food_name: string | null;
  quantity_g: number;
  meal_type: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  consumed_at: string | null;
}

export async function getRecommendationHistory(): Promise<
  RecommendationLog[]
> {
  const response = await api.get("/history/recommendations");

  return response.data.recommendations;
}

export async function getFoodIntakeHistory(): Promise<
  FoodIntakeLog[]
> {
  const response = await api.get("/history/intake");

  return response.data.intake_logs;
}

export async function addFoodIntake(data: {
  food_id: number;
  quantity_g: number;
  meal_type: string;
}) {
  const response = await api.post("/history/intake", data);

  return response.data;
}