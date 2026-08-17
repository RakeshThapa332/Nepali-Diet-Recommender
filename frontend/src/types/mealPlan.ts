export interface MealPlanFood {
  food_id: number;
  food_name: string;
  portion_grams: number;
  calories: number;
  calories_per_100g: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface MealMacros {
  protein: number;
  fat: number;
  carbs: number;
}

export interface MealRecommendation {
  foods: MealPlanFood[];
  total_calories: number;
  total_macros: MealMacros;
}

export interface MealPlan {
  meal_plan_id: number;
  date: string;
  target_calories: number;

  daily_macros: MealMacros;

  meal_calories: {
    breakfast: number;
    lunch: number;
    dinner: number;
  };

  meal_macros: {
    breakfast: MealMacros;
    lunch: MealMacros;
    dinner: MealMacros;
  };

  meals: {
    breakfast: MealRecommendation;
    lunch: MealRecommendation;
    dinner: MealRecommendation;
  };
}

export interface MealPlanResponse {
  success: boolean;
  meal_plan: MealPlan;
  message?: string;
}

export interface MealPlansResponse {
  success: boolean;
  meal_plans: MealPlan[];
  message?: string;
}