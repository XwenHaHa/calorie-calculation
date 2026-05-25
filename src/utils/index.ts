import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const formatCalories = (calories: number): string => {
  return calories.toLocaleString();
};

export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  if (isToday(date)) return '今天';
  if (isYesterday(date)) return '昨天';
  return format(date, 'MM/dd', { locale: zhCN });
};

export const formatTime = (dateString: string): string => {
  return format(parseISO(dateString), 'HH:mm');
};

export const parseQuickInput = (input: string): { title: string; calories: number } | null => {
  const match = input.match(/^(.+?)\s+(-?\d+)$/);
  if (!match) return null;
  return {
    title: match[1].trim(),
    calories: parseInt(match[2], 10),
  };
};

export const getCalorieColor = (calories: number): string => {
  if (calories > 0) return 'text-orange-500';
  if (calories < 0) return 'text-green-500';
  return 'text-gray-500';
};

export const getNetCalorieStatus = (netCalories: number): { label: string; color: string } => {
  if (netCalories > 0) return { label: '盈余', color: 'text-orange-500' };
  if (netCalories < 0) return { label: '缺口', color: 'text-green-500' };
  return { label: '平衡', color: 'text-gray-500' };
};