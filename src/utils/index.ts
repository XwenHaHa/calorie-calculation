import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
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
  // English aliases
  'rice': '🍚', 'noodles': '🍜', 'egg': '🥚', 'apple': '🍎', 'banana': '🍌', 'orange': '🍊',
  'grape': '🍇', 'watermelon': '🍉', 'strawberry': '🍓', 'peach': '🍑', 'pear': '🍐',
  'mango': '🥭', 'cherry': '🍒', 'lemon': '🍋', 'kiwi': '🥝', 'pineapple': '🍍',
  'milk': '🥛', 'yogurt': '🥛', 'soy milk': '🥛',
  'bread': '🍞', 'toast': '🍞', 'cake': '🍰', 'cookie': '🍪',
  'chicken': '🍗', 'beef': '🥩', 'pork': '🥩', 'meat': '🥩', 'steak': '🥩',
  'fish': '🐟', 'salmon': '🐟', 'shrimp': '🦐', 'crab': '🦀', 'seafood': '🦐',
  'burger': '🍔', 'pizza': '🍕', 'fries': '🍟',
  'hot dog': '🌭', 'sandwich': '🥪', 'salad': '🥗', 'vegetables': '🥬',
  'hot pot': '🍲', 'soup': '🍲', 'porridge': '🍲',
  'dumpling': '🥟', 'steamed bun': '🥟', 'mantou': '🥟',
  'ice cream': '🍦', 'coffee': '☕', 'tea': '🍵', 'juice': '🧃', 'cola': '🥤',
  'milk tea': '🧋', 'beer': '🍺', 'wine': '🍷',
  'chocolate': '🍫', 'candy': '🍬', 'donut': '🍩',
  'corn': '🌽', 'carrot': '🥕', 'potato': '🥔', 'sweet potato': '🍠', 'tomato': '🍅',
  'cucumber': '🥒', 'mushroom': '🍄', 'chili': '🌶️', 'peanut': '🥜',
  'tofu': '🧈', 'fried chicken': '🍗', 'bbq': '🥩', 'barbecue': '🥩',
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
  // English aliases
  'running': '🏃', 'jogging': '🏃',
  'cycling': '🚴', 'biking': '🚴', 'bicycle': '🚴',
  'swimming': '🏊', 'breaststroke': '🏊', 'freestyle': '🏊',
  'walking': '🚶', 'hiking': '⛰️',
  'yoga': '🧘',
  'gym': '💪', 'weightlifting': '💪', 'strength': '💪',
  'jump rope': '🤸',
  'basketball': '🏀', 'football': '⚽', 'soccer': '⚽', 'badminton': '🏸',
  'table tennis': '🏓', 'tennis': '🎾', 'volleyball': '🏐',
  'dancing': '💃', 'dance': '💃',
  'tai chi': '☯️',
};

// Maps old Chinese record titles to translation keys
const TITLE_TO_KEY: Record<string, string> = {
  '米饭': 'food:rice', '饭': 'food:rice', '炒饭': 'food:rice',
  '面条': 'food:noodles', '面': 'food:noodles', '拉面': 'food:noodles', '米粉': 'food:noodles', '米线': 'food:noodles',
  '鸡蛋': 'food:egg', '蛋': 'food:egg',
  '苹果': 'food:apple', '香蕉': 'food:banana', '橘子': 'food:orange', '橙子': 'food:orange',
  '葡萄': 'food:grape', '西瓜': 'food:watermelon', '草莓': 'food:strawberry', '桃子': 'food:peach',
  '梨': 'food:pear', '芒果': 'food:mango', '樱桃': 'food:cherry', '柠檬': 'food:lemon',
  '猕猴桃': 'food:kiwi', '菠萝': 'food:pineapple',
  '牛奶': 'food:milk', '酸奶': 'food:yogurt', '豆浆': 'food:soy_milk',
  '面包': 'food:bread', '吐司': 'food:toast', '蛋糕': 'food:cake', '饼干': 'food:cookie',
  '鸡肉': 'food:chicken', '鸡腿': 'food:chicken', '鸡翅': 'food:chicken', '鸡': 'food:chicken',
  '牛肉': 'food:beef', '猪肉': 'food:pork', '排骨': 'food:beef', '牛排': 'food:beef',
  '鱼': 'food:fish', '三文鱼': 'food:fish', '虾': 'food:fish', '螃蟹': 'food:fish',
  '汉堡': 'food:burger', '汉堡包': 'food:burger',
  '披萨': 'food:pizza',
  '薯条': 'food:fries', '薯片': 'food:fries',
  '热狗': 'food:hotdog',
  '三明治': 'food:sandwich',
  '沙拉': 'food:salad', '蔬菜': 'food:vegetables',
  '火锅': 'food:hotpot', '汤': 'food:soup', '粥': 'food:porridge',
  '饺子': 'food:dumpling', '包子': 'food:steamed_bun', '馒头': 'food:mantou',
  '冰淇淋': 'food:icecream', '雪糕': 'food:icecream',
  '咖啡': 'food:coffee', '茶': 'food:tea', '果汁': 'food:juice', '可乐': 'food:cola',
  '奶茶': 'food:milktea', '啤酒': 'food:beer', '酒': 'food:wine',
  '巧克力': 'food:chocolate', '糖': 'food:candy', '甜甜圈': 'food:donut',
  '玉米': 'food:corn', '胡萝卜': 'food:carrot', '土豆': 'food:potato', '红薯': 'food:sweet_potato',
  '番茄': 'food:tomato', '黄瓜': 'food:cucumber', '蘑菇': 'food:mushroom', '辣椒': 'food:chili',
  '花生': 'food:peanut', '豆腐': 'food:tofu',
  '炸鸡': 'food:fried_chicken', '烤肉': 'food:bbq', '烧烤': 'food:bbq',
  // Exercise
  '跑步': 'exercise:running', '跑': 'exercise:running', '慢跑': 'exercise:running',
  '骑行': 'exercise:cycling', '骑车': 'exercise:cycling', '自行车': 'exercise:cycling',
  '游泳': 'exercise:swimming', '蛙泳': 'exercise:swimming', '自由泳': 'exercise:swimming',
  '散步': 'exercise:walking', '走路': 'exercise:walking', '步行': 'exercise:walking',
  '瑜伽': 'exercise:yoga',
  '健身': 'exercise:gym', '举铁': 'exercise:gym', '力量': 'exercise:gym',
  '跳绳': 'exercise:jump_rope',
  '篮球': 'exercise:basketball', '足球': 'exercise:football', '羽毛球': 'exercise:badminton',
  '乒乓球': 'exercise:table_tennis', '网球': 'exercise:tennis', '排球': 'exercise:volleyball',
  '爬山': 'exercise:hiking', '登山': 'exercise:hiking',
  '跳舞': 'exercise:dancing', '舞蹈': 'exercise:dancing',
  '太极': 'exercise:tai_chi',
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

export function useFormatDate() {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language === 'zh' ? zhCN : enUS;

  return (dateString: string): string => {
    const date = parseISO(dateString);
    if (isToday(date)) return t('today');
    if (isYesterday(date)) return t('yesterday');
    return format(date, 'MM/dd', { locale });
  };
}

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

export function useNetCalorieStatus() {
  const { t } = useTranslation('common');
  return (netCalories: number): { label: string; color: string } => {
    if (netCalories > 0) return { label: t('surplus'), color: 'text-orange-500' };
    if (netCalories < 0) return { label: t('deficit'), color: 'text-green-500' };
    return { label: t('balanced'), color: 'text-gray-500' };
  };
}

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

export function getDisplayTitle(title: string, t: TFunction): string {
  const key = TITLE_TO_KEY[title];
  if (key) return t(key);
  return title;
}

export { TITLE_TO_KEY };
