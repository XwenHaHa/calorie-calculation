export const STORAGE_KEYS = {
  RECORDS: 'calmorie_records',
  SETTINGS: 'calmorie_settings',
} as const;

export const EXERCISE_TYPES = [
  { id: 'running', name: '跑步', caloriesPerHour: 600, emoji: '🏃' },
  { id: 'cycling', name: '骑行', caloriesPerHour: 400, emoji: '🚴' },
  { id: 'swimming', name: '游泳', caloriesPerHour: 500, emoji: '🏊' },
  { id: 'walking', name: '散步', caloriesPerHour: 200, emoji: '🚶' },
  { id: 'yoga', name: '瑜伽', caloriesPerHour: 250, emoji: '🧘' },
  { id: 'gym', name: '健身', caloriesPerHour: 450, emoji: '💪' },
] as const;

export const QUICK_FOOD_ITEMS = [
  { name: '米饭', calories: 200, emoji: '🍚' },
  { name: '面条', calories: 300, emoji: '🍜' },
  { name: '鸡蛋', calories: 80, emoji: '🥚' },
  { name: '苹果', calories: 100, emoji: '🍎' },
  { name: '牛奶', calories: 150, emoji: '🥛' },
  { name: '面包', calories: 250, emoji: '🍞' },
] as const;