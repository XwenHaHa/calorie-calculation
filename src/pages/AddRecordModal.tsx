import { useState } from 'react';
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

  const handleQuickInput = () => {
    const parsed = parseQuickInput(input);
    if (parsed) {
      addNewRecord({
        type: mode,
        title: parsed.title,
        calories: mode === 'food' ? parsed.calories : -Math.abs(parsed.calories),
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
      calories: mode === 'food' ? parseInt(calories) : -Math.abs(parseInt(calories)),
      date: new Date().toISOString(),
    });
    onClose();
  };

  const handleQuickFood = (name: string, cal: number) => {
    addNewRecord({
      type: 'food',
      title: name,
      calories: cal,
      date: new Date().toISOString(),
    });
    onClose();
  };

  const handleQuickExercise = (name: string, cal: number) => {
    addNewRecord({
      type: 'exercise',
      title: name,
      calories: -cal,
      date: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">添加记录</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
              mode === 'food'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            食物摄入
          </button>
          <button
            onClick={() => setMode('exercise')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
              mode === 'exercise'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            运动消耗
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">快速输入（如：炸鸡 500）</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={mode === 'food' ? '炸鸡 500' : '跑步 -300'}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyDown={e => e.key === 'Enter' && handleQuickInput()}
            />
            <button
              onClick={handleQuickInput}
              className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            >
              添加
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">详细输入</p>
          <div className="space-y-2">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="名称"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              value={calories}
              onChange={e => setCalories(e.target.value)}
              placeholder="热量（卡路里）"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            >
              保存
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">
            快速选择{mode === 'food' ? '食物' : '运动'}
          </p>
          <div className="flex flex-wrap gap-2">
            {mode === 'food'
              ? QUICK_FOOD_ITEMS.map(item => (
                  <button
                    key={item.name}
                    onClick={() => handleQuickFood(item.name, item.calories)}
                    className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm hover:bg-orange-100 transition-colors"
                  >
                    {item.name} {item.calories}
                  </button>
                ))
              : EXERCISE_TYPES.map(item => (
                  <button
                    key={item.id}
                    onClick={() =>
                      handleQuickExercise(
                        item.name,
                        Math.round(item.caloriesPerHour / 2)
                      )
                    }
                    className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm hover:bg-green-100 transition-colors"
                  >
                    {item.name} 30分钟
                  </button>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}