import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { QUICK_FOOD_ITEMS, EXERCISE_TYPES } from '../constants';

const FOOD_EMOJI_MAP: Record<string, string> = {
  '米饭': '🍚', '饭': '🍚', '炒饭': '🍚',
  '面条': '🍜', '面': '🍜', '拉面': '🍜', '米粉': '🍜', '米线': '🍜',
  '鸡蛋': '🥚', '蛋': '🥚',
  '苹果': '🍎', '香蕉': '🍌', '橘子': '🍊', '橙子': '🍊', '葡萄': '🍇', '西瓜': '🍉', '草莓': '🍓', '桃子': '🍑', '梨': '🍐', '芒果': '🥭', '樱桃': '🍒', '柠檬': '🍋', '猕猴桃': '🥝', '菠萝': '🍍',
  '牛奶': '🥛', '酸奶': '🥛', '豆浆': '🥛',
  '面包': '🍞', '吐司': '🍞', '蛋糕': '🍰', '饼干': '🍪',
  '鸡': '🍗', '鸡肉': '🍗', '鸡腿': '🍗', '鸡翅': '🍗',
  '牛肉': '🥩', '猪肉': '🥩', '肉': '🥩', '排骨': '🥩', '牛排': '🥩',
  '鱼': '🐟', '三文鱼': '🐟', '虾': '🦐', '螃蟹': '🦀', '海鲜': '🦐',
  '汉堡': '🍔', '汉堡包': '🍔',
  '披萨': '🍕',
  '薯条': '🍟', '薯片': '🍟',
  '热狗': '🌭',
  '三明治': '🥪',
  '沙拉': '🥗', '蔬菜': '🥬',
  '火锅': '🍲', '汤': '🍲', '粥': '🍲',
  '饺子': '🥟', '包子': '🥟', '馒头': '🥟',
  '冰淇淋': '🍦', '雪糕': '🍦',
  '咖啡': '☕', '茶': '🍵', '果汁': '🧃', '可乐': '🥤', '奶茶': '🧋', '啤酒': '🍺', '酒': '🍷',
  '巧克力': '🍫', '糖': '🍬', '甜甜圈': '🍩',
  '玉米': '🌽', '胡萝卜': '🥕', '土豆': '🥔', '红薯': '🍠', '番茄': '🍅', '黄瓜': '🥒', '蘑菇': '🍄', '辣椒': '🌶️', '花生': '🥜',
  '豆腐': '🧈',
  '炸鸡': '🍗', '烤肉': '🥩', '烧烤': '🥩',
};

const EXERCISE_EMOJI_MAP: Record<string, string> = {
  '跑步': '🏃', '跑': '🏃', '慢跑': '🏃',
  '骑行': '🚴', '骑车': '🚴', '自行车': '🚴',
  '游泳': '🏊', '蛙泳': '🏊', '自由泳': '🏊',
  '散步': '🚶', '走路': '🚶', '步行': '🚶',
  '瑜伽': '🧘',
  '健身': '💪', '举铁': '💪', '力量': '💪',
  '跳绳': '🤸',
  '篮球': '🏀', '足球': '⚽', '羽毛球': '🏸', '乒乓球': '🏓', '网球': '🎾', '排球': '🏐',
  '爬山': '⛰️', '登山': '⛰️',
  '跳舞': '💃', '舞蹈': '💃',
  '太极': '☯️',
};

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

export const getFoodEmoji = (name: string): string => {
  const direct = FOOD_EMOJI_MAP[name];
  if (direct) return direct;
  for (const [key, emoji] of Object.entries(FOOD_EMOJI_MAP)) {
    if (name.includes(key)) return emoji;
  }
  const preset = QUICK_FOOD_ITEMS.find(f => f.name === name);
  if (preset) return preset.emoji;
  return '🍽️';
};

export const getExerciseEmoji = (name: string): string => {
  const direct = EXERCISE_EMOJI_MAP[name];
  if (direct) return direct;
  for (const [key, emoji] of Object.entries(EXERCISE_EMOJI_MAP)) {
    if (name.includes(key)) return emoji;
  }
  const preset = EXERCISE_TYPES.find(e => e.name === name);
  if (preset) return preset.emoji;
  return '🏃';
};