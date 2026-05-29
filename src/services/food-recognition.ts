const AI_CONFIG = {
  baseUrl: import.meta.env.VITE_AI_BASE_URL || 'https://yxai.chat/v1',
  apiKey: import.meta.env.VITE_AI_API_KEY || '',
  model: import.meta.env.VITE_AI_MODEL || 'gpt-5.3-chat',
};

export interface RecognizedFood {
  name: string;
  emoji: string;
  calories_per_100g: number;
  estimated_grams: number;
}

export interface RecognitionResult {
  foods: RecognizedFood[];
  total_calories: number;
}

const SYSTEM_PROMPT = `你是一个专业的营养师和食物识别助手。用户会给你发送食物照片，你需要：
1. 识别照片中的所有食物
2. 估算每种食物的重量（克）
3. 估算每种食物每100克的热量（千卡）
4. 为每种食物选择一个合适的 emoji

请严格以 JSON 格式回复，不要包含任何其他文字：
{
  "foods": [
    {
      "name": "食物名称",
      "emoji": "🍎",
      "calories_per_100g": 52,
      "estimated_grams": 150
    }
  ],
  "total_calories": 78
}

如果照片中没有食物或无法识别，返回：
{
  "foods": [],
  "total_calories": 0
}`;

export async function recognizeFood(imageBase64: string): Promise<RecognitionResult> {
  const response = await fetch(`${AI_CONFIG.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: '请识别这张照片中的食物并估算热量' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();
  const content: string = data.choices?.[0]?.message?.content || '';

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('无法解析识别结果');
  }

  const result: RecognitionResult = JSON.parse(jsonMatch[0]);

  if (!result.foods || !Array.isArray(result.foods)) {
    throw new Error('识别结果格式错误');
  }

  result.total_calories = result.foods.reduce(
    (sum, f) => sum + Math.round(f.calories_per_100g * f.estimated_grams / 100),
    0
  );

  return result;
}
