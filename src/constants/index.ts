export const STORAGE_KEYS = {
  RECORDS: 'calmorie_records',
  SETTINGS: 'calmorie_settings',
} as const;

export const EXERCISE_TYPES = [
  { id: 'running', name: '跑步', caloriesPerHour: 600 },
  { id: 'cycling', name: '骑行', caloriesPerHour: 400 },
  { id: 'swimming', name: '游泳', caloriesPerHour: 500 },
  { id: 'walking', name: '散步', caloriesPerHour: 200 },
  { id: 'yoga', name: '瑜伽', caloriesPerHour: 250 },
  { id: 'gym', name: '健身', caloriesPerHour: 450 },
] as const;

export const QUICK_FOOD_ITEMS = [
  { name: '米饭', calories: 200 },
  { name: '面条', calories: 300 },
  { name: '鸡蛋', calories: 80 },
  { name: '苹果', calories: 100 },
  { name: '牛奶', calories: 150 },
  { name: '面包', calories: 250 },
] as const;