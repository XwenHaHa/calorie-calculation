import i18next from 'i18next';
import type { Transaction, DailySummary, MonthlyStats } from '../types';
import { subDays } from 'date-fns';

const AI_CONFIG = {
  baseUrl: import.meta.env.VITE_AI_BASE_URL || 'https://yxai.chat/v1',
  apiKey: import.meta.env.VITE_AI_API_KEY || '',
  model: import.meta.env.VITE_AI_MODEL || 'gpt-5.3-chat',
};

interface AIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function generateAIAdvice(
  records: Transaction[],
  dailySummary: DailySummary,
  monthlyStats: MonthlyStats
): Promise<string[]> {
  const t = i18next.getFixedT(null, 'prompts');
  const selectedDate = new Date(dailySummary.date);
  const last7Days = subDays(selectedDate, 7);

  const recentRecords = records.filter(r => {
    const date = new Date(r.date);
    return date >= last7Days && date <= selectedDate;
  });

  const foodRecords = recentRecords.filter(r => r.type === 'food');
  const exerciseRecords = recentRecords.filter(r => r.type === 'exercise');

  const prompt = t('userPrompt', {
    date: dailySummary.date,
    dailyIntake: dailySummary.totalIntake,
    dailyBurn: dailySummary.totalBurn,
    dailyNet: dailySummary.netCalories,
    monthlyIntake: monthlyStats.totalIntake,
    monthlyBurn: monthlyStats.totalBurn,
    avgNet: Math.round(monthlyStats.avgNetCalories),
    foodCount: foodRecords.length,
    exerciseCount: exerciseRecords.length,
  });

  try {
    const response = await fetch(`${AI_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: t('systemPrompt'),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: AIResponse = await response.json();
    const content = data.choices[0]?.message?.content || '';

    const advice = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.length <= 50)
      .slice(0, 3);

    if (advice.length === 0) {
      return getDefaultAdvice(dailySummary, monthlyStats);
    }

    return advice;
  } catch (error) {
    console.error('AI advice generation failed:', error);
    return getDefaultAdvice(dailySummary, monthlyStats);
  }
}

function getDefaultAdvice(dailySummary: DailySummary, monthlyStats: MonthlyStats): string[] {
  const t = i18next.getFixedT(null, 'prompts');
  const advice: string[] = [];

  if (monthlyStats.avgNetCalories > 200) {
    advice.push(t('defaultAdvice_highSurplus'));
  }

  if (dailySummary.totalBurn === 0) {
    advice.push(t('defaultAdvice_noExercise'));
  }

  if (advice.length === 0) {
    advice.push(t('defaultAdvice_good1'));
    advice.push(t('defaultAdvice_good2'));
    advice.push(t('defaultAdvice_good3'));
  }

  return advice;
}
