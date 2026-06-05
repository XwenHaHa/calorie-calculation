import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../store';
import { generateAIAdvice } from '../services/ai';
import { getAIHistory, addAIHistory, clearAIHistory, generateId } from '../services/storage';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import type { AIHistoryEntry } from '../types';

export function AIPage() {
  const { state } = useApp();
  const [advice, setAdvice] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [adviceDate, setAdviceDate] = useState<Date | null>(null);
  const [history, setHistory] = useState<AIHistoryEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { t, i18n } = useTranslation('ai');

  const dateLocale = i18n.language === 'zh' ? zhCN : enUS;
  const dateFormat = i18n.language === 'zh' ? 'M月dd日 HH:mm' : 'MMM dd, HH:mm';
  const dayFormat = i18n.language === 'zh' ? 'M月dd日' : 'MMM dd';

  useEffect(() => {
    setHistory(getAIHistory());
  }, []);

  const [onlineFailed, setOnlineFailed] = useState(false);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setOnlineFailed(false);
    try {
      const result = await generateAIAdvice(
        state.records,
        state.dailySummary,
        state.monthlyStats
      );
      setAdvice(result.data);
      setAdviceDate(state.selectedDate);
      setGenerated(true);
      setOnlineFailed(!!result.onlineFailed);

      // Save to history
      const entry: AIHistoryEntry = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        analyzedDate: state.dailySummary.date,
        advice: result.data,
        dailySummary: {
          totalIntake: state.dailySummary.totalIntake,
          totalBurn: state.dailySummary.totalBurn,
          netCalories: state.dailySummary.netCalories,
          recordCount: state.dailySummary.recordCount,
        },
      };
      addAIHistory(entry);
      setHistory(getAIHistory());
    } catch (error) {
      console.error('Failed to generate advice:', error);
      setAdvice([t('generateFailed')]);
    } finally {
      setLoading(false);
    }
  }, [state.records, state.dailySummary, state.monthlyStats, state.selectedDate, t]);

  const handleClearHistory = () => {
    clearAIHistory();
    setHistory([]);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="pb-40 px-6 pt-16">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-200 to-green-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div>
          <div className="text-3xl font-semibold text-gray-900">{t('aiCoach')}</div>
          <div className="text-gray-400 mt-1">{t('lifestyleAdvice')}</div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full h-16 rounded-[30px] bg-green-500 text-white text-lg font-semibold shadow-xl mt-8 disabled:opacity-50 transition-opacity"
      >
        {loading ? t('analyzing') : generated ? t('regenerate') : t('generate')}
      </button>

      {onlineFailed && (
        <div className="mt-3 px-4 py-2.5 bg-orange-50 rounded-2xl flex items-center gap-2">
          <span className="text-sm">⚠️</span>
          <p className="text-xs text-orange-600">{t('onlineFailedHint', { ns: 'plan' })}</p>
        </div>
      )}

      {loading && (
        <div className="glass rounded-[38px] p-8 mt-6 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4" />
          <p className="text-gray-500">{t('aiAnalyzing')}</p>
        </div>
      )}

      {!loading && generated && (
        <div className="space-y-4 mt-6">
          {adviceDate && (
            <p className="text-sm text-gray-400 px-1">
              {t('basedOnDate', { date: format(adviceDate, dayFormat, { locale: dateLocale }) })}
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
          <p className="text-gray-500 mb-2">{t('tapAbove')}</p>
          <p className="text-gray-400 text-sm">{t('aiDescription')}</p>
        </div>
      )}

      {/* History section */}
      {history.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{t('history')}</h3>
            <button
              onClick={handleClearHistory}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              {t('clearHistory')}
            </button>
          </div>

          <div className="space-y-3">
            {history.map(entry => (
              <div key={entry.id} className="glass rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleExpand(entry.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                >
                  <div>
                    <p className="text-sm text-gray-500">
                      {t('analysisTime', { date: format(new Date(entry.createdAt), dateFormat, { locale: dateLocale }) })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {t('dataSummary')}: {t('intake')} {entry.dailySummary.totalIntake}{t('burn') === '消耗' ? '千卡' : 'kcal'} / {t('burn')} {entry.dailySummary.totalBurn}{t('burn') === '消耗' ? '千卡' : 'kcal'} / {t('records')} {entry.dailySummary.recordCount}
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-gray-400 transition-transform ${expandedId === entry.id ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedId === entry.id && (
                  <div className="px-5 pb-4 space-y-2">
                    {entry.advice.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 bg-white/50 rounded-xl p-3">
                        <span className="text-sm flex-shrink-0">
                          {index === 0 ? '🌿' : index === 1 ? '🍔' : '🏃'}
                        </span>
                        <p className="text-sm text-gray-600 leading-6">{item}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length === 0 && !loading && !generated && (
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">{t('historyEmpty')}</p>
        </div>
      )}
    </div>
  );
}
