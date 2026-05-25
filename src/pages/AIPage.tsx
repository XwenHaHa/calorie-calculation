import { useState, useCallback } from 'react';
import { useApp } from '../store';
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
      setAdvice(['生成建议失败，请重试']);
    } finally {
      setLoading(false);
    }
  }, [state.records, state.dailySummary, state.monthlyStats, state.selectedDate]);

  return (
    <div className="pb-24 px-6 pt-16">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-200 to-green-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div>
          <div className="text-3xl font-semibold text-gray-900">AI 教练</div>
          <div className="text-gray-400 mt-1">基于生活方式的建议</div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full h-16 rounded-[30px] bg-green-500 text-white text-lg font-semibold shadow-xl mt-8 disabled:opacity-50 transition-opacity"
      >
        {loading ? '分析中...' : generated ? '重新生成建议' : '生成 AI 建议'}
      </button>

      {loading && (
        <div className="glass rounded-[38px] p-8 mt-6 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4" />
          <p className="text-gray-500">AI 正在分析您的数据...</p>
        </div>
      )}

      {!loading && generated && (
        <div className="space-y-4 mt-6">
          {adviceDate && (
            <p className="text-sm text-gray-400 px-1">
              基于 {format(adviceDate, 'M月dd日', { locale: zhCN })} 的数据
            </p>
          )}
          {advice.map((item, index) => (
            <div key={index} className="glass rounded-[34px] p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  index === 0 ? 'bg-green-100' : index === 1 ? 'bg-orange-100' : 'bg-blue-100'
                }`}>
                  {index === 0 ? '🌿' : index === 1 ? '🍔' : '🏃'}
                </div>
                <p className="text-gray-700 leading-7">{item}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !generated && (
        <div className="glass rounded-[38px] p-8 mt-6 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-2">点击上方按钮</p>
          <p className="text-gray-400 text-sm">AI 将分析您的饮食和运动数据，提供个性化建议</p>
        </div>
      )}
    </div>
  );
}
