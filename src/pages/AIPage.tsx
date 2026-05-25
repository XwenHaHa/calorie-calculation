import { useState, useCallback } from 'react';
import { useApp } from '../store';
import { Card } from '../components/Card';
import { generateAIAdvice } from '../services/ai';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function AIPage() {
  const { state } = useApp();
  const [advice, setAdvice] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [adviceDate, setAdviceDate] = useState<Date | null>(null);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    try {
      const result = await generateAIAdvice(
        state.records,
        state.dailySummary,
        state.monthlyStats
      );
      setAdvice(result);
      setAdviceDate(state.selectedDate);
      setGenerated(true);
    } catch (error) {
      console.error('Failed to generate advice:', error);
      setAdvice(['生成建议失败，请稍后再试']);
    } finally {
      setLoading(false);
    }
  }, [state.records, state.dailySummary, state.monthlyStats, state.selectedDate]);

  return (
    <div className="pb-20">
      <header className="bg-white px-4 py-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">AI 建议</h1>
        <p className="text-sm text-gray-500 mt-1">基于你的饮食和运动数据</p>
      </header>

      <div className="p-4">
        <Card className="mb-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">当前日期</span>
            <span className="font-medium text-gray-800">
              {format(state.selectedDate, 'yyyy年MM月dd日', { locale: zhCN })}
            </span>
          </div>
        </Card>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 mb-4"
        >
          {loading ? 'AI 分析中...' : generated ? '重新生成建议' : '生成 AI 建议'}
        </button>

        {loading && (
          <Card>
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
              <p className="text-gray-500">AI 正在分析你的数据...</p>
            </div>
          </Card>
        )}

        {!loading && generated && (
          <div className="space-y-3">
            {adviceDate && (
              <p className="text-sm text-gray-500 px-1">
                以下建议基于 {format(adviceDate, 'MM月dd日', { locale: zhCN })} 的数据分析
              </p>
            )}
            {advice.map((item, index) => (
              <Card key={index} className="border border-green-100 bg-green-50">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="flex-1 text-gray-800">{item}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && !generated && (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">点击上方按钮</p>
              <p className="text-gray-400 text-sm">AI 将根据你的饮食和运动数据生成个性化建议</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}