export const STORAGE_KEYS = {
  RECORDS: 'calmorie_records',
  SETTINGS: 'calmorie_settings',
  AI_HISTORY: 'calmorie_ai_history',
  USER_PROFILE: 'calmorie_user_profile',
  ONBOARDING_DONE: 'calmorie_onboarding_done',
  FAT_LOSS_PLAN: 'calmorie_fat_loss_plan',
  MODEL_PREFERENCE: 'calmorie_model_preference',
  LOCAL_MODEL_PATH: 'calmorie_local_model_path',
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
  { name: '米饭', nameKey: 'food:rice', calories: 116, unit: '克', emoji: '🍚' },
  { name: '面条', nameKey: 'food:noodles', calories: 110, unit: '克', emoji: '🍜' },
  { name: '鸡蛋', nameKey: 'food:egg', calories: 144, unit: '克', emoji: '🥚' },
  { name: '苹果', nameKey: 'food:apple', calories: 53, unit: '克', emoji: '🍎' },
  { name: '牛奶', nameKey: 'food:milk', calories: 65, unit: '克', emoji: '🥛' },
  { name: '面包', nameKey: 'food:bread', calories: 265, unit: '克', emoji: '🍞' },
] as const;

export interface FoodItem {
  name: string;
  nameKey: string;
  calories: number;
  unit: string;
  emoji: string;
  aliases: string[];
}

export interface ExerciseItem {
  name: string;
  nameKey: string;
  caloriesPerHour: number;
  emoji: string;
  aliases: string[];
}

export const FOOD_DATABASE: FoodItem[] = [
  // 主食
  { name: '米饭', nameKey: 'food:rice', calories: 116, unit: '克', emoji: '🍚', aliases: ['饭', '米饭', 'rice', '白饭', '白米饭'] },
  { name: '面条', nameKey: 'food:noodles', calories: 110, unit: '克', emoji: '🍜', aliases: ['面', '拉面', '米粉', '米线', 'noodles', '拌面', '汤面'] },
  { name: '面包', nameKey: 'food:bread', calories: 265, unit: '克', emoji: '🍞', aliases: ['吐司', 'bread', 'toast', '全麦面包'] },
  { name: '馒头', nameKey: 'food:mantou', calories: 223, unit: '克', emoji: '🥟', aliases: ['mantou', 'steamed bun'] },
  { name: '饺子', nameKey: 'food:dumpling', calories: 185, unit: '克', emoji: '🥟', aliases: ['dumpling', '水饺', '蒸饺'] },
  { name: '包子', nameKey: 'food:steamed_bun', calories: 200, unit: '克', emoji: '🥟', aliases: ['steamed bun', '肉包', '菜包'] },
  { name: '粥', nameKey: 'food:porridge', calories: 46, unit: '克', emoji: '🍲', aliases: ['porridge', '白粥', '小米粥'] },
  { name: '炒饭', nameKey: 'food:rice', calories: 180, unit: '克', emoji: '🍚', aliases: ['fried rice', '蛋炒饭'] },
  // 肉类
  { name: '鸡肉', nameKey: 'food:chicken', calories: 165, unit: '克', emoji: '🍗', aliases: ['鸡', '鸡腿', '鸡翅', 'chicken', '鸡胸肉'] },
  { name: '牛肉', nameKey: 'food:beef', calories: 250, unit: '克', emoji: '🥩', aliases: ['牛排', 'beef', 'steak', '牛腩'] },
  { name: '猪肉', nameKey: 'food:pork', calories: 242, unit: '克', emoji: '🥩', aliases: ['pork', '排骨', '五花肉', '里脊'] },
  { name: '鱼', nameKey: 'food:fish', calories: 96, unit: '克', emoji: '🐟', aliases: ['三文鱼', 'fish', 'salmon', '鲈鱼', '鳕鱼'] },
  { name: '虾', nameKey: 'food:fish', calories: 85, unit: '克', emoji: '🦐', aliases: ['shrimp', '虾仁', '大虾'] },
  { name: '炸鸡', nameKey: 'food:fried_chicken', calories: 280, unit: '克', emoji: '🍗', aliases: ['fried chicken', '炸鸡腿', '炸鸡翅'] },
  { name: '烤肉', nameKey: 'food:bbq', calories: 250, unit: '克', emoji: '🥩', aliases: ['bbq', 'barbecue', '烧烤', '烤串'] },
  // 蛋奶
  { name: '鸡蛋', nameKey: 'food:egg', calories: 144, unit: '克', emoji: '🥚', aliases: ['蛋', 'egg', '煮鸡蛋', '煎蛋', '荷包蛋'] },
  { name: '牛奶', nameKey: 'food:milk', calories: 65, unit: '克', emoji: '🥛', aliases: ['milk', '纯牛奶', '鲜奶'] },
  { name: '酸奶', nameKey: 'food:yogurt', calories: 72, unit: '克', emoji: '🥛', aliases: ['yogurt', '酸牛奶'] },
  { name: '豆浆', nameKey: 'food:soy_milk', calories: 39, unit: '克', emoji: '🥛', aliases: ['soy milk', '豆奶'] },
  // 水果
  { name: '苹果', nameKey: 'food:apple', calories: 53, unit: '克', emoji: '🍎', aliases: ['apple'] },
  { name: '香蕉', nameKey: 'food:banana', calories: 93, unit: '克', emoji: '🍌', aliases: ['banana'] },
  { name: '橘子', nameKey: 'food:orange', calories: 47, unit: '克', emoji: '🍊', aliases: ['orange', '橙子', '桔子'] },
  { name: '葡萄', nameKey: 'food:grape', calories: 45, unit: '克', emoji: '🍇', aliases: ['grape'] },
  { name: '西瓜', nameKey: 'food:watermelon', calories: 31, unit: '克', emoji: '🍉', aliases: ['watermelon'] },
  { name: '草莓', nameKey: 'food:strawberry', calories: 32, unit: '克', emoji: '🍓', aliases: ['strawberry'] },
  { name: '芒果', nameKey: 'food:mango', calories: 60, unit: '克', emoji: '🥭', aliases: ['mango'] },
  { name: '猕猴桃', nameKey: 'food:kiwi', calories: 57, unit: '克', emoji: '🥝', aliases: ['kiwi', '奇异果'] },
  { name: '菠萝', nameKey: 'food:pineapple', calories: 50, unit: '克', emoji: '🍍', aliases: ['pineapple', '凤梨'] },
  // 蔬菜
  { name: '沙拉', nameKey: 'food:salad', calories: 20, unit: '克', emoji: '🥗', aliases: ['salad', '蔬菜沙拉', '水果沙拉'] },
  { name: '玉米', nameKey: 'food:corn', calories: 112, unit: '克', emoji: '🌽', aliases: ['corn', '玉米棒'] },
  { name: '土豆', nameKey: 'food:potato', calories: 77, unit: '克', emoji: '🥔', aliases: ['potato', '马铃薯', '土豆泥'] },
  { name: '红薯', nameKey: 'food:sweet_potato', calories: 99, unit: '克', emoji: '🍠', aliases: ['sweet potato', '地瓜', '番薯'] },
  { name: '番茄', nameKey: 'food:tomato', calories: 18, unit: '克', emoji: '🍅', aliases: ['tomato', '西红柿'] },
  { name: '胡萝卜', nameKey: 'food:carrot', calories: 33, unit: '克', emoji: '🥕', aliases: ['carrot'] },
  { name: '黄瓜', nameKey: 'food:cucumber', calories: 16, unit: '克', emoji: '🥒', aliases: ['cucumber'] },
  { name: '豆腐', nameKey: 'food:tofu', calories: 73, unit: '克', emoji: '🧈', aliases: ['tofu', '豆腐干'] },
  // 快餐
  { name: '汉堡', nameKey: 'food:burger', calories: 260, unit: '克', emoji: '🍔', aliases: ['burger', '汉堡包', '鸡肉汉堡', '牛肉汉堡'] },
  { name: '披萨', nameKey: 'food:pizza', calories: 270, unit: '克', emoji: '🍕', aliases: ['pizza', '披萨饼'] },
  { name: '薯条', nameKey: 'food:fries', calories: 312, unit: '克', emoji: '🍟', aliases: ['fries', '薯片', '炸薯条'] },
  { name: '热狗', nameKey: 'food:hotdog', calories: 290, unit: '克', emoji: '🌭', aliases: ['hot dog', '热狗面包'] },
  { name: '三明治', nameKey: 'food:sandwich', calories: 200, unit: '克', emoji: '🥪', aliases: ['sandwich'] },
  // 中式
  { name: '火锅', nameKey: 'food:hotpot', calories: 120, unit: '克', emoji: '🍲', aliases: ['hot pot', '麻辣火锅', '涮火锅'] },
  { name: '汤', nameKey: 'food:soup', calories: 35, unit: '克', emoji: '🍲', aliases: ['soup', '鸡汤', '番茄汤', '紫菜汤'] },
  { name: '蔬菜', nameKey: 'food:vegetables', calories: 25, unit: '克', emoji: '🥬', aliases: ['vegetables', '青菜', '白菜', '生菜'] },
  // 甜点饮品
  { name: '蛋糕', nameKey: 'food:cake', calories: 350, unit: '克', emoji: '🍰', aliases: ['cake', '奶油蛋糕', '芝士蛋糕'] },
  { name: '饼干', nameKey: 'food:cookie', calories: 450, unit: '克', emoji: '🍪', aliases: ['cookie', '曲奇', '饼干'] },
  { name: '冰淇淋', nameKey: 'food:icecream', calories: 210, unit: '克', emoji: '🍦', aliases: ['ice cream', '雪糕'] },
  { name: '巧克力', nameKey: 'food:chocolate', calories: 546, unit: '克', emoji: '🍫', aliases: ['chocolate', '巧克力棒'] },
  { name: '甜甜圈', nameKey: 'food:donut', calories: 420, unit: '克', emoji: '🍩', aliases: ['donut', '面包圈'] },
  { name: '咖啡', nameKey: 'food:coffee', calories: 2, unit: '克', emoji: '☕', aliases: ['coffee', '美式', '拿铁', '卡布奇诺'] },
  { name: '奶茶', nameKey: 'food:milktea', calories: 100, unit: '克', emoji: '🧋', aliases: ['milk tea', '珍珠奶茶', '波霸奶茶'] },
  { name: '果汁', nameKey: 'food:juice', calories: 45, unit: '克', emoji: '🧃', aliases: ['juice', '橙汁', '苹果汁'] },
  { name: '可乐', nameKey: 'food:cola', calories: 42, unit: '克', emoji: '🥤', aliases: ['cola', '雪碧', '汽水'] },
  { name: '啤酒', nameKey: 'food:beer', calories: 43, unit: '克', emoji: '🍺', aliases: ['beer'] },
];

export const EXERCISE_DATABASE: ExerciseItem[] = [
  { name: '跑步', nameKey: 'exercise:running', caloriesPerHour: 600, emoji: '🏃', aliases: ['跑', '慢跑', 'running', 'jogging', '跑步机'] },
  { name: '骑行', nameKey: 'exercise:cycling', caloriesPerHour: 400, emoji: '🚴', aliases: ['骑车', '自行车', 'cycling', 'biking', '骑自行车'] },
  { name: '游泳', nameKey: 'exercise:swimming', caloriesPerHour: 500, emoji: '🏊', aliases: ['蛙泳', '自由泳', 'swimming', 'breaststroke', 'freestyle'] },
  { name: '散步', nameKey: 'exercise:walking', caloriesPerHour: 200, emoji: '🚶', aliases: ['走路', '步行', 'walking', '快走'] },
  { name: '瑜伽', nameKey: 'exercise:yoga', caloriesPerHour: 250, emoji: '🧘', aliases: ['yoga', '普拉提'] },
  { name: '健身', nameKey: 'exercise:gym', caloriesPerHour: 450, emoji: '💪', aliases: ['举铁', '力量', 'gym', 'weightlifting', 'strength', '器械'] },
  { name: '跳绳', nameKey: 'exercise:jump_rope', caloriesPerHour: 700, emoji: '🤸', aliases: ['jump rope', '跳绳'] },
  { name: '篮球', nameKey: 'exercise:basketball', caloriesPerHour: 500, emoji: '🏀', aliases: ['basketball', '打篮球'] },
  { name: '足球', nameKey: 'exercise:football', caloriesPerHour: 500, emoji: '⚽', aliases: ['football', 'soccer', '踢足球'] },
  { name: '羽毛球', nameKey: 'exercise:badminton', caloriesPerHour: 400, emoji: '🏸', aliases: ['badminton', '打羽毛球'] },
  { name: '乒乓球', nameKey: 'exercise:table_tennis', caloriesPerHour: 300, emoji: '🏓', aliases: ['table tennis', 'ping pong', '打乒乓球'] },
  { name: '网球', nameKey: 'exercise:tennis', caloriesPerHour: 500, emoji: '🎾', aliases: ['tennis', '打网球'] },
  { name: '爬山', nameKey: 'exercise:hiking', caloriesPerHour: 450, emoji: '⛰️', aliases: ['hiking', '登山', '徒步'] },
  { name: '跳舞', nameKey: 'exercise:dancing', caloriesPerHour: 350, emoji: '💃', aliases: ['dancing', 'dance', '舞蹈', '广场舞'] },
  { name: '太极', nameKey: 'exercise:tai_chi', caloriesPerHour: 200, emoji: '☯️', aliases: ['tai chi', '太极拳'] },
  { name: '排球', nameKey: 'exercise:volleyball', caloriesPerHour: 350, emoji: '🏐', aliases: ['volleyball', '打排球'] },
];
