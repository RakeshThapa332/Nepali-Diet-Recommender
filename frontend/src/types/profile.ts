export interface UserProfile {
  age: number;
  gender: string;
  height: number;
  weight: number;
  activity_level: string;
  goal: string;

  bmi?: number;
  bmr?: number;
  tdee?: number;
  target_calories?: number;
}