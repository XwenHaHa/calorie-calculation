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