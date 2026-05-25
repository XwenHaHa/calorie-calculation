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
  const selectedDate = new Date(dailySummary.date);
  const last7Days = subDays(selectedDate, 7);

  const recentRecords = records.filter(r => {
    const date = new Date(r.date);
    return date >= last7Days && date <= selectedDate;
  });

  const foodRecords = recentRecords.filter(r => r.type === 'food');
  const exerciseRecords = recentRecords.filter(r => r.type === 'exercise');

  const prompt = `你是一个健康管理助手。请根据以下用户的饮食和运动数据，给出3条简短的健康建议。

分析日期：${dailySummary.date}

当日数据（${dailySummary.date}）：
- 摄入热量：${dailySummary.totalIntake} 卡
- 消耗热量：${dailySummary.totalBurn} 卡
- 净热量：${dailySummary.netCalories} 卡

本月数据：
- 总摄入：${monthlyStats.totalIntake} 卡
- 总消耗：${monthlyStats.totalBurn} 卡
- 日均净热量：${Math.round(monthlyStats.avgNetCalories)} 卡

最近7天记录：
- 饮食记录 ${foodRecords.length} 条
- 运动记录 ${exerciseRecords.length} 条

要求：
1. 每条建议不超过20字
2. 使用生活化表达，不要医疗术语
3. 根据数据实际情况给出针对性建议
4. 如果数据不足，给出通用健康建议
5. 直接返回3条建议，用换行分隔，不要添加序号或其他格式`;

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
            content: '你是一个健康管理助手，用简洁的生活化语言给出建议。',
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
  const advice: string[] = [];

  if (monthlyStats.avgNetCalories > 200) {
    advice.push('本月热量盈余较高，注意控制饮食');
  }

  if (dailySummary.totalBurn === 0) {
    advice.push('今天还没运动，建议适量活动');
  }

  if (advice.length === 0) {
    advice.push('继续保持良好的生活习惯');
    advice.push('均衡饮食，适量运动');
    advice.push('每天保持充足的水分摄入');
  }

  return advice;
}