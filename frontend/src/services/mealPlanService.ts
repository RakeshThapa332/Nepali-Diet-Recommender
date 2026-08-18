import api from "../api/axios";

import type {
  MealPlan,
  MealPlanResponse,
  MealPlansResponse,
} from "../types/mealPlan";

export const getTodayMealPlan = async (): Promise<MealPlan | null> => {
  try {
    const response = await api.get<MealPlanResponse>(
      "/meal-plans/today"
    );

    if (!response.data.success) {
      return null;
    }

    return response.data.meal_plan;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }

    throw error;
  }
};

export const getMealPlans = async (): Promise<MealPlan[]> => {
  const response = await api.get<MealPlansResponse>(
    "/meal-plans"
  );

  return response.data.meal_plans;
};

export const getMealPlanById = async (
  mealPlanId: number
): Promise<MealPlan> => {
  const response = await api.get<MealPlanResponse>(
    `/meal-plans/${mealPlanId}`
  );

  return response.data.meal_plan;
};

export const generateDailyRecommendation =
  async (): Promise<MealPlan> => {
    const response = await api.get<{
      success: boolean;
      meal_plan_id?: number;
      recommendation?: any;
    }>("/recommendation/daily");

    if (!response.data.success) {
      throw new Error(
        "Failed to generate recommendation."
      );
    }

    if (response.data.meal_plan_id) {
      return getMealPlanById(
        response.data.meal_plan_id
      );
    }

    throw new Error(
      "Generated recommendation has no meal plan ID."
    );
  };

export const regenerateMealPlan =
  async (): Promise<MealPlan> => {
    const response = await api.post<{
      success: boolean;
      recommendation?: MealPlan;
      message?: string;
    }>("/recommendation/regenerate");

    if (!response.data.success || !response.data.recommendation) {
      throw new Error(
        response.data.message ||
          "Failed to regenerate your diet plan."
      );
    }

    return response.data.recommendation;
  };