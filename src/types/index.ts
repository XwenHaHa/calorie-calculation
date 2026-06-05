export interface Transaction {
  id: string;
  type: 'food' | 'exercise';
  title: string;
  calories: number;
  date: string;
  note?: string;
}

export interface DailySummary {
  date: string;
  totalIntake: number;
  totalBurn: number;
  netCalories: number;
  recordCount: number;
}

export interface MonthlyStats {
  month: string;
  totalIntake: number;
  totalBurn: number;
  avgNetCalories: number;
  dailyTrend: {
    date: string;
    netCalories: number;
  }[];
}

export interface AIAdvice {
  id: string;
  date: string;
  content: string;
  type: 'warning' | 'suggestion' | 'info';
}

export interface AIHistoryEntry {
  id: string;
  createdAt: string;
  analyzedDate: string;
  advice: string[];
  dailySummary: {
    totalIntake: number;
    totalBurn: number;
    netCalories: number;
    recordCount: number;
  };
}

export interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  targetWeight?: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
}

export interface FatLossPlan {
  id: string;
  createdAt: string;
  profile: UserProfile;
  bmr: number;
  tdee: number;
  dailyCalorieTarget: number;
  weeklyPlan: DayPlan[];
  tips: string[];
}

export interface DayPlan {
  day: string;
  meals: MealPlan[];
  exercise: ExercisePlan | null;
  totalCalories: number;
}

export interface MealPlan {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  suggestion: string;
  calories: number;
}

export interface ExercisePlan {
  suggestion: string;
  duration: number;
  burnCalories: number;
}