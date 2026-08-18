export interface RecommendationLog {
  id: number;
  target_calories: number;
  goal: string;
  cluster_id?: number;
  generated_at: string;
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

export interface ProgressSummary {
  target_calories: number;
  calories_consumed: number;
  calories_remaining: number;

  protein_target?: number;
  protein_consumed?: number;

  carbs_target?: number;
  carbs_consumed?: number;

  fat_target?: number;
  fat_consumed?: number;
}