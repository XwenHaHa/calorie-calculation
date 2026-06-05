import i18next from 'i18next';
import type { UserProfile, FatLossPlan, DayPlan, Transaction, DailySummary, MonthlyStats, AIResult } from '../types';
import { calculateBMR, calculateTDEE, calculateDailyCalorieTarget } from '../utils';
import { generateId } from './storage';
import { subDays } from 'date-fns';
import { callAI } from './ai-client';
import { generateText } from './local-llm';

const AI_CONFIG = {
  baseUrl: import.meta.env.VITE_AI_BASE_URL || 'https://yxai.chat/v1',
  apiKey: import.meta.env.VITE_AI_API_KEY || '',
  model: import.meta.env.VITE_AI_MODEL || 'gpt-5.3-chat',
};

interface AIPlanResponse {
  weeklyPlan: DayPlan[];
  tips: string[];
}

export async function generateFatLossPlan(
  profile: UserProfile,
  records: Transaction[],
  dailySummary: DailySummary,
  _monthlyStats: MonthlyStats
): Promise<AIResult<FatLossPlan>> {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const dailyTarget = calculateDailyCalorieTarget(tdee);

  const t = i18next.getFixedT(null, 'plan');
  const selectedDate = new Date(dailySummary.date);
  const last7Days = subDays(selectedDate, 7);

  const recentRecords = records.filter(r => {
    const date = new Date(r.date);
    return date >= last7Days && date <= selectedDate;
  });

  const foodRecords = recentRecords.filter(r => r.type === 'food');
  const exerciseRecords = recentRecords.filter(r => r.type === 'exercise');

  const avgIntake = foodRecords.length > 0
    ? Math.round(foodRecords.reduce((s, r) => s + r.calories, 0) / 7)
    : 0;
  const avgBurn = exerciseRecords.length > 0
    ? Math.round(exerciseRecords.reduce((s, r) => s + Math.abs(r.calories), 0) / 7)
    : 0;

  const genderLabel = profile.gender === 'male' ? t('male') : t('female');
  const activityLabel = t(profile.activityLevel);

  const prompt = t('userPrompt', {
    gender: genderLabel,
    age: profile.age,
    height: profile.height,
    weight: profile.weight,
    activityLevel: activityLabel,
    bmr,
    tdee,
    dailyTarget,
    avgIntake,
    avgBurn,
  });

  const systemPrompt = t('systemPrompt');

  const result = await callAI({
    onlineFn: async () => {
      const response = await fetch(`${AI_CONFIG.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
        }),
      });

      if (!response.ok) throw new Error(`API request failed: ${response.status}`);

      const data = await response.json();
      const content: string = data.choices?.[0]?.message?.content || '';

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('无法解析计划结果');

      const parsed: AIPlanResponse = JSON.parse(jsonMatch[0]);
      if (!parsed.weeklyPlan || !Array.isArray(parsed.weeklyPlan)) throw new Error('计划结果格式错误');
      return parsed;
    },
    localFn: async () => {
      const content = await generateText(prompt, systemPrompt);
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('本地模型无法解析计划结果');

      const parsed: AIPlanResponse = JSON.parse(jsonMatch[0]);
      if (!parsed.weeklyPlan || !Array.isArray(parsed.weeklyPlan)) throw new Error('计划结果格式错误');
      return parsed;
    },
    fallbackFn: () => null,
  });

  if (result.data) {
    return {
      ...result,
      data: {
        id: generateId(),
        createdAt: new Date().toISOString(),
        profile,
        bmr,
        tdee,
        dailyCalorieTarget: dailyTarget,
        weeklyPlan: result.data.weeklyPlan,
        tips: result.data.tips || [],
      },
    };
  }

  return {
    ...result,
    data: getDefaultPlan(profile, bmr, tdee, dailyTarget),
  };
}

function getDefaultPlan(
  profile: UserProfile,
  bmr: number,
  tdee: number,
  dailyTarget: number
): FatLossPlan {
  const t = i18next.getFixedT(null, 'plan');
  const days = [t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday'), t('saturday'), t('sunday')];

  const defaultMeals = [
    { type: 'breakfast' as const, suggestion: '燕麦粥 + 水煮蛋 + 牛奶', calories: 350 },
    { type: 'lunch' as const, suggestion: '鸡胸肉沙拉 + 糙米饭', calories: 450 },
    { type: 'dinner' as const, suggestion: '清蒸鱼 + 蔬菜 + 少量主食', calories: 380 },
    { type: 'snack' as const, suggestion: '一个苹果 + 少量坚果', calories: 100 },
  ];

  const weeklyPlan: DayPlan[] = days.map(day => ({
    day,
    meals: defaultMeals,
    exercise: { suggestion: '快走 30 分钟', duration: 30, burnCalories: 150 },
    totalCalories: 1280,
  }));

  return {
    id: generateId(),
    createdAt: new Date().toISOString(),
    profile,
    bmr,
    tdee,
    dailyCalorieTarget: dailyTarget,
    weeklyPlan,
    tips: [
      '每天饮水 2000ml 以上',
      '晚餐尽量在 19 点前完成',
      '每周称重一次，关注趋势',
    ],
  };
}
