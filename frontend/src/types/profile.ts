export interface UserProfile {
  age: number;
  date_of_birth?: string;
  gender: string;
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  goal: string;
  dietary_preference: string,
  body_type?: string;
  bmi?: number;
  bmi_category?: string;
  bmr?: number;
  tdee?: number;
  target_calories?: number;
}