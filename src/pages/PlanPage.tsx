import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../store';
import { getUserProfile, getFatLossPlan, saveFatLossPlan } from '../services/storage';
import { generateFatLossPlan } from '../services/fat-loss-plan';
import { calculateBMR, calculateTDEE, calculateDailyCalorieTarget } from '../utils';
import { SettingsPage } from './SettingsPage';
import type { UserProfile, FatLossPlan } from '../types';

const MEAL_EMOJI = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };

export function PlanPage() {
  const { t } = useTranslation(['plan', 'common']);
  const { state } = useApp();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<FatLossPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);

  useEffect(() => {
    setProfile(getUserProfile());
    setPlan(getFatLossPlan());
  }, []);

  const handleGenerate = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const result = await generateFatLossPlan(
        profile,
        state.records,
        state.dailySummary,
        state.monthlyStats
      );
      saveFatLossPlan(result);
      setPlan(result);
    } catch {
      // error handled in service
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
    setProfile(getUserProfile());
  };

  if (!profile) {
    return (
      <div className="px-5 pt-14 pb-28 flex flex-col items-center justify-center min-h-[60vh]">
        <span className="text-5xl mb-4">🎯</span>
        <p className="text-gray-400">{t('noPlanDesc')}</p>
      </div>
    );
  }

  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const dailyTarget = calculateDailyCalorieTarget(tdee);
  const bmi = (profile.weight / ((profile.height / 100) ** 2)).toFixed(1);
  const weeklyLoss = ((tdee - dailyTarget) * 7 / 7700).toFixed(1);

  return (
    <div className="px-5 pt-14 pb-28">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">{t('plan', { ns: 'common' })}</h1>
          <p className="text-gray-400 mt-1">{t('weeklyPlan')}</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="glass w-10 h-10 rounded-2xl flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Body data card */}
      <div className="glass rounded-3xl p-5 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">📊</span>
          <h3 className="text-gray-800 font-medium">{t('bodyData')}</h3>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-xl font-semibold text-gray-800">{profile.weight}</p>
            <p className="text-xs text-gray-400">{t('kg')}</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-800">{profile.height}</p>
            <p className="text-xs text-gray-400">{t('cm')}</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-800">{bmi}</p>
            <p className="text-xs text-gray-400">{t('bmi')}</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-800">{profile.age}</p>
            <p className="text-xs text-gray-400">{t('years')}</p>
          </div>
        </div>
      </div>

      {/* Calorie targets card */}
      <div className="glass rounded-3xl p-5 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🔥</span>
          <h3 className="text-gray-800 font-medium">{t('dailyTarget')}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/60 rounded-2xl p-3 text-center">
            <p className="text-lg font-semibold text-gray-800">{bmr}</p>
            <p className="text-xs text-gray-400">{t('bmr')} (kcal)</p>
          </div>
          <div className="bg-white/60 rounded-2xl p-3 text-center">
            <p className="text-lg font-semibold text-gray-800">{tdee}</p>
            <p className="text-xs text-gray-400">{t('tdee')} (kcal)</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-3 text-center">
            <p className="text-lg font-semibold text-green-600">{dailyTarget}</p>
            <p className="text-xs text-gray-400">{t('dailyTarget')} (kcal)</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-3 text-center">
            <p className="text-lg font-semibold text-orange-500">{weeklyLoss} kg</p>
            <p className="text-xs text-gray-400">{t('weeklyLoss')}</p>
          </div>
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`w-full py-4 rounded-3xl text-lg font-medium shadow-xl mb-4 ${
          loading ? 'bg-gray-300 text-gray-400' : 'bg-green-500 text-white'
        }`}
      >
        {loading ? t('generating') : plan ? t('regeneratePlan') : t('generatePlan')}
      </button>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center py-8">
          <div className="w-10 h-10 border-3 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-400">{t('generating')}</p>
        </div>
      )}

      {/* Plan content */}
      {plan && !loading && (
        <>
          {/* Weekly plan */}
          <div className="mb-4">
            <h3 className="text-gray-800 font-medium mb-3">{t('weeklyPlan')}</h3>
            <div className="space-y-2">
              {plan.weeklyPlan.map((day, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      <span className="text-gray-800 font-medium text-sm">{day.day}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500 text-sm font-medium">{day.totalCalories} kcal</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 text-gray-400 transition-transform ${expandedDay === i ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {expandedDay === i && (
                    <div className="px-4 pb-4 space-y-2">
                      {day.meals.map((meal, j) => (
                        <div key={j} className="flex items-center gap-2 bg-white/60 rounded-xl px-3 py-2">
                          <span className="text-base">{MEAL_EMOJI[meal.type]}</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-400">{t(meal.type)}</p>
                            <p className="text-sm text-gray-800">{meal.suggestion}</p>
                          </div>
                          <span className="text-orange-500 text-sm font-medium">{meal.calories}</span>
                        </div>
                      ))}
                      {day.exercise && (
                        <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2">
                          <span className="text-base">🏃</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-400">{t('exercise')}</p>
                            <p className="text-sm text-gray-800">{day.exercise.suggestion}</p>
                          </div>
                          <span className="text-green-500 text-sm font-medium">-{day.exercise.burnCalories}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          {plan.tips.length > 0 && (
            <div>
              <h3 className="text-gray-800 font-medium mb-3">{t('tips')}</h3>
              <div className="space-y-2">
                {plan.tips.map((tip, i) => (
                  <div key={i} className="glass rounded-2xl px-4 py-3 flex items-start gap-3">
                    <span className="text-lg">{['💡', '✨', '🎯'][i] || '💡'}</span>
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!plan && !loading && (
        <div className="flex flex-col items-center py-12">
          <span className="text-5xl mb-4">📋</span>
          <p className="text-gray-800 font-medium mb-1">{t('noPlan')}</p>
          <p className="text-gray-400 text-sm text-center">{t('noPlanDesc')}</p>
        </div>
      )}

      {/* Settings modal */}
      {showSettings && <SettingsPage onClose={handleSettingsClose} />}
    </div>
  );
}
