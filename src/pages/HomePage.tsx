import { useState } from 'react';
import { useApp } from '../store';
import { Card } from '../components/Card';
import { FloatingButton } from '../components/FloatingButton';
import { formatCalories, formatTime, getNetCalorieStatus } from '../utils';
import { AddRecordModal } from './AddRecordModal';

export function HomePage() {
  const { state, removeRecord } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const { dailySummary, recentRecords } = state;
  const netCalorieStatus = getNetCalorieStatus(dailySummary.netCalories);

  return (
    <div className="pb-20">
      <header className="bg-white px-4 py-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Calmorie</h1>
        <p className="text-sm text-gray-500 mt-1">卡路里记录</p>
      </header>

      <div className="p-4 space-y-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">今日净热量</p>
            <p className={`text-5xl font-bold ${netCalorieStatus.color}`}>
              {formatCalories(Math.abs(dailySummary.netCalories))}
            </p>
            <p className={`text-sm mt-1 ${netCalorieStatus.color}`}>
              {netCalorieStatus.label}
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <p className="text-sm text-gray-500">摄入</p>
            <p className="text-2xl font-semibold text-orange-500">
              {formatCalories(dailySummary.totalIntake)}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">消耗</p>
            <p className="text-2xl font-semibold text-green-500">
              {formatCalories(dailySummary.totalBurn)}
            </p>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3 px-1">今日记录</h2>
          {recentRecords.length === 0 ? (
            <Card>
              <p className="text-center text-gray-400 py-8">
                暂无记录，点击下方按钮添加
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {recentRecords.map(record => (
                <Card key={record.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{record.title}</p>
                    <p className="text-sm text-gray-500">
                      {formatTime(record.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-semibold ${
                        record.type === 'food' ? 'text-orange-500' : 'text-green-500'
                      }`}
                    >
                      {record.type === 'food' ? '+' : '-'}
                      {formatCalories(Math.abs(record.calories))}
                    </span>
                    <button
                      onClick={() => removeRecord(record.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <FloatingButton onClick={() => setShowAddModal(true)} />

      {showAddModal && <AddRecordModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}