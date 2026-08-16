export interface UserProfile {
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  goal: string;
  dietary_preference: string,
  bmi?: number;
  bmr?: number;
  tdee?: number;
  target_calories?: number;
}