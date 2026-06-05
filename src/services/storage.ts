import type { Transaction, DailySummary, MonthlyStats, AIHistoryEntry, UserProfile, FatLossPlan } from '../types';
import { STORAGE_KEYS } from '../constants';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

export const getRecords = (): Transaction[] => {
  const records = localStorage.getItem(STORAGE_KEYS.RECORDS);
  return records ? JSON.parse(records) : [];
};

export const addRecord = (record: Transaction): void => {
  const records = getRecords();
  records.push(record);
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
};

export const deleteRecord = (id: string): void => {
  const records = getRecords();
  const filtered = records.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(filtered));
};

export const getDailySummary = (date: Date): DailySummary => {
  const records = getRecords();
  const dayRecords = records.filter(r => isSameDay(parseISO(r.date), date));

  const totalIntake = dayRecords
    .filter(r => r.type === 'food')
    .reduce((sum, r) => sum + r.calories, 0);

  const totalBurn = dayRecords
    .filter(r => r.type === 'exercise')
    .reduce((sum, r) => sum + Math.abs(r.calories), 0);

  return {
    date: format(date, 'yyyy-MM-dd'),
    totalIntake,
    totalBurn,
    netCalories: totalIntake - totalBurn,
    recordCount: dayRecords.length,
  };
};

export const getMonthlyStats = (date: Date): MonthlyStats => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const dailyTrend = days.map(day => {
    const summary = getDailySummary(day);
    return {
      date: summary.date,
      netCalories: summary.netCalories,
    };
  });

  const totalIntake = dailyTrend.reduce((sum, d) => {
    const summary = getDailySummary(parseISO(d.date));
    return sum + summary.totalIntake;
  }, 0);

  const totalBurn = dailyTrend.reduce((sum, d) => {
    const summary = getDailySummary(parseISO(d.date));
    return sum + summary.totalBurn;
  }, 0);

  const daysWithRecords = dailyTrend.filter(d => {
    const summary = getDailySummary(parseISO(d.date));
    return summary.recordCount > 0;
  }).length;

  return {
    month: format(date, 'yyyy-MM'),
    totalIntake,
    totalBurn,
    avgNetCalories: daysWithRecords > 0 ? (totalIntake - totalBurn) / daysWithRecords : 0,
    dailyTrend,
  };
};

export const getRecordsByDate = (date: Date): Transaction[] => {
  const records = getRecords();
  return records.filter(r => isSameDay(parseISO(r.date), date));
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getAIHistory = (): AIHistoryEntry[] => {
  const data = localStorage.getItem(STORAGE_KEYS.AI_HISTORY);
  return data ? JSON.parse(data) : [];
};

export const addAIHistory = (entry: AIHistoryEntry): void => {
  const history = getAIHistory();
  history.unshift(entry);
  // Keep only last 20 entries
  if (history.length > 20) history.length = 20;
  localStorage.setItem(STORAGE_KEYS.AI_HISTORY, JSON.stringify(history));
};

export const clearAIHistory = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AI_HISTORY);
};

export const getUserProfile = (): UserProfile | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : null;
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
};

export const hasCompletedOnboarding = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE) === 'true';
};

export const completeOnboarding = (): void => {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true');
};

export const getFatLossPlan = (): FatLossPlan | null => {
  const data = localStorage.getItem(STORAGE_KEYS.FAT_LOSS_PLAN);
  return data ? JSON.parse(data) : null;
};

export const saveFatLossPlan = (plan: FatLossPlan): void => {
  localStorage.setItem(STORAGE_KEYS.FAT_LOSS_PLAN, JSON.stringify(plan));
};