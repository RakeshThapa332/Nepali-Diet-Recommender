export interface Food {
  id: number;
  food_name: string;
  protein: number;
  fat: number;
  carbs: number;
  fiber?: number;
  calories?: number;
  cluster_id?: number;
}