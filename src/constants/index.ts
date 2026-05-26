export const STORAGE_KEYS = {
  RECORDS: 'calmorie_records',
  SETTINGS: 'calmorie_settings',
} as const;

export const EXERCISE_TYPES = [
  { id: 'running', name: '跑步', nameKey: 'exercise:running', caloriesPerHour: 600, emoji: '🏃' },
  { id: 'cycling', name: '骑行', nameKey: 'exercise:cycling', caloriesPerHour: 400, emoji: '🚴' },
  { id: 'swimming', name: '游泳', nameKey: 'exercise:swimming', caloriesPerHour: 500, emoji: '🏊' },
  { id: 'walking', name: '散步', nameKey: 'exercise:walking', caloriesPerHour: 200, emoji: '🚶' },
  { id: 'yoga', name: '瑜伽', nameKey: 'exercise:yoga', caloriesPerHour: 250, emoji: '🧘' },
  { id: 'gym', name: '健身', nameKey: 'exercise:gym', caloriesPerHour: 450, emoji: '💪' },
] as const;

export const QUICK_FOOD_ITEMS = [
  { name: '米饭', nameKey: 'food:rice', calories: 200, emoji: '🍚' },
  { name: '面条', nameKey: 'food:noodles', calories: 300, emoji: '🍜' },
  { name: '鸡蛋', nameKey: 'food:egg', calories: 80, emoji: '🥚' },
  { name: '苹果', nameKey: 'food:apple', calories: 100, emoji: '🍎' },
  { name: '牛奶', nameKey: 'food:milk', calories: 150, emoji: '🥛' },
  { name: '面包', nameKey: 'food:bread', calories: 250, emoji: '🍞' },
] as const;
