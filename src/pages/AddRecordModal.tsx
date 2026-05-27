import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../store';
import { parseQuickInput } from '../utils';
import { EXERCISE_TYPES, QUICK_FOOD_ITEMS } from '../constants';

interface AddRecordModalProps {
  onClose: () => void;
}

export function AddRecordModal({ onClose }: AddRecordModalProps) {
  const { addNewRecord } = useApp();
  const [mode, setMode] = useState<'food' | 'exercise'>('food');
  const [input, setInput] = useState('');
  const [title, setTitle] = useState('');
  const [calories, setCalories] = useState('');
  const { t } = useTranslation(['add', 'common']);

  const handleQuickInput = () => {
    const parsed = parseQuickInput(input);
    if (parsed) {
      addNewRecord({
        type: mode,
        title: parsed.title,
        calories:
          mode === 'food' ? parsed.calories : -Math.abs(parsed.calories),
        date: new Date().toISOString(),
      });
      onClose();
    }
  };

  const handleSubmit = () => {
    if (!title || !calories) return;
    addNewRecord({
      type: mode,
      title,
      calories:
        mode === 'food' ? parseInt(calories) : -Math.abs(parseInt(calories)),
      date: new Date().toISOString(),
    });
    onClose();
  };

  const handleQuickFood = (nameKey: string, _name: string, cal: number) => {
    addNewRecord({
      type: 'food',
      title: _name,
      calories: cal,
      date: new Date().toISOString(),
    });
    onClose();
  };

  const handleQuickExercise = (nameKey: string, _name: string, cal: number) => {
    addNewRecord({
      type: 'exercise',
      title: _name,
      calories: -cal,
      date: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end justify-center z-50"
      onClick={onClose}
    >
      <div
        className="glass-heavy rounded-t-[40px] w-full max-w-lg p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">
              {t('quickAdd')}
            </h2>
            <p className="text-gray-400 mt-1">{t('quickAddHint')}</p>
          </div>
          <button
            onClick={onClose}
            className="glass w-10 h-10 rounded-2xl flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('food')}
            className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-colors ${
              mode === 'food'
                ? 'bg-green-500 text-white'
                : 'bg-white/70 text-gray-600'
            }`}
          >
            🍽️ {t('food', { ns: 'common' })}
          </button>
          <button
            onClick={() => setMode('exercise')}
            className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-colors ${
              mode === 'exercise'
                ? 'bg-green-500 text-white'
                : 'bg-white/70 text-gray-600'
            }`}
          >
            🏃 {t('exercise', { ns: 'common' })}
          </button>
        </div>

        <div className="mb-4">
          <div className="bg-white/70 rounded-3xl px-5 py-4 flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'food'
                  ? t('foodPlaceholder')
                  : t('exercisePlaceholder')
              }
              className="bg-transparent outline-none flex-1 text-gray-800 placeholder-gray-400"
              onKeyDown={(e) => e.key === 'Enter' && handleQuickInput()}
            />
            <button
              onClick={handleQuickInput}
              className="text-green-600 font-semibold text-sm"
            >
              {t('add', { ns: 'common' })}
            </button>
          </div>
        </div>

        <div className="mb-4 space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('name', { ns: 'common' })}
            className="w-full px-5 py-4 bg-white/70 rounded-3xl outline-none text-gray-800 placeholder-gray-400"
          />
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder={t('calories', { ns: 'common' })}
            className="w-full px-5 py-4 bg-white/70 rounded-3xl outline-none text-gray-800 placeholder-gray-400"
          />
          <button
            onClick={handleSubmit}
            className="w-full h-14 rounded-3xl bg-green-500 text-white text-lg font-medium shadow-xl"
          >
            {t('saveRecord')}
          </button>
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-3">
            {t('quickSelect', {
              type:
                mode === 'food'
                  ? t('food', { ns: 'common' })
                  : t('exercise', { ns: 'common' }),
            })}
          </p>
          <div className="flex flex-wrap gap-2">
            {mode === 'food'
              ? QUICK_FOOD_ITEMS.map((item) => (
                  <button
                    key={item.nameKey}
                    onClick={() =>
                      handleQuickFood(item.nameKey, item.name, item.calories)
                    }
                    className="px-4 py-2 bg-white/70 text-gray-700 rounded-2xl text-sm"
                  >
                    {item.emoji} {t(item.nameKey)} {item.calories}
                  </button>
                ))
              : EXERCISE_TYPES.map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      handleQuickExercise(
                        item.nameKey,
                        item.name,
                        Math.round(item.caloriesPerHour / 2),
                      )
                    }
                    className="px-4 py-2 bg-white/70 text-gray-700 rounded-2xl text-sm"
                  >
                    {item.emoji} {t(item.nameKey)}{' '}
                    {t('minutes30', { ns: 'common' })}
                  </button>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
