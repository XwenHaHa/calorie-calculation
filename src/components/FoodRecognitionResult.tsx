import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../store';
import type { RecognitionResult } from '../services/food-recognition';

interface FoodRecognitionResultProps {
  result: RecognitionResult;
  imagePreview: string;
  onBack: () => void;
  onClose: () => void;
}

export function FoodRecognitionResult({ result, imagePreview, onBack, onClose }: FoodRecognitionResultProps) {
  const { addNewRecord } = useApp();
  const { t } = useTranslation(['add', 'common']);
  const [grams, setGrams] = useState<number[]>(result.foods.map(f => f.estimated_grams));

  const handleGramChange = (index: number, value: string) => {
    const num = parseFloat(value) || 0;
    setGrams(prev => {
      const next = [...prev];
      next[index] = num;
      return next;
    });
  };

  const totalCalories = result.foods.reduce(
    (sum, f, i) => sum + Math.round(f.calories_per_100g * (grams[i] || 0) / 100),
    0
  );

  const handleConfirm = () => {
    result.foods.forEach((food, i) => {
      const g = grams[i] || 0;
      if (g <= 0) return;
      addNewRecord({
        type: 'food',
        title: food.name,
        calories: Math.round(food.calories_per_100g * g / 100),
        date: new Date().toISOString(),
      });
    });
    onClose();
  };

  return (
    <div className="flex-1 overflow-y-auto mb-3 min-h-0">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('back')}
      </button>

      <div className="mb-4 rounded-2xl overflow-hidden">
        <img src={imagePreview} alt="food" className="w-full h-40 object-cover" />
      </div>

      <p className="text-sm text-gray-400 mb-3">{t('recognitionResult')}</p>

      {result.foods.length === 0 ? (
        <div className="flex flex-col items-center py-6">
          <span className="text-4xl mb-2">🍽️</span>
          <p className="text-gray-400">{t('noFoodDetected')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {result.foods.map((food, i) => (
            <div key={i} className="bg-white/60 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{food.emoji}</span>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{food.name}</p>
                  <p className="text-gray-400 text-xs">{food.calories_per_100g} {t('kcal')} / {t('per100g')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{t('adjustGrams')}:</span>
                <input
                  type="number"
                  value={grams[i] || ''}
                  onChange={e => handleGramChange(i, e.target.value)}
                  min="1"
                  step="10"
                  className="w-20 px-3 py-2 bg-white/70 rounded-xl outline-none text-gray-800 text-center text-sm font-medium"
                />
                <span className="text-gray-500 text-sm">{t('grams')}</span>
                <span className="ml-auto text-orange-500 font-medium text-sm">
                  {Math.round(food.calories_per_100g * (grams[i] || 0) / 100)} {t('kcal')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {result.foods.length > 0 && (
        <>
          <div className="text-center mt-4 mb-3">
            <p className="text-sm text-gray-400">
              {t('totalCalories', { calories: '' }).replace(/[0-9,]+/, '').trim() || 'Total'}
            </p>
            <p className="text-2xl font-semibold text-orange-500">
              {totalCalories} {t('kcal')}
            </p>
          </div>

          <button
            onClick={handleConfirm}
            disabled={totalCalories <= 0}
            className={`w-full py-4 rounded-3xl text-lg font-medium shadow-xl ${
              totalCalories > 0
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-400 cursor-not-allowed'
            }`}
          >
            {t('confirmAddFood')}
          </button>
        </>
      )}
    </div>
  );
}
