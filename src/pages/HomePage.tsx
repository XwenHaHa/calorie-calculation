import { useState } from 'react';
import { useApp } from '../store';
import { FloatingButton } from '../components/FloatingButton';
import { formatCalories, formatTime, getFoodEmoji, getExerciseEmoji } from '../utils';
import { AddRecordModal } from './AddRecordModal';

export function HomePage() {
  const { state, removeRecord } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const { dailySummary, recentRecords } = state;

  const today = new Date();
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  return (
    <div className="pb-24">
      <div className="px-6 pt-16">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400">今天</div>
            <div className="text-3xl font-semibold text-gray-800 mt-1">
              {monthNames[today.getMonth()]} {today.getDate()}日
            </div>
          </div>
          <div className="glass w-12 h-12 rounded-2xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        </div>

        <div className="glass rounded-[36px] p-7 mt-8">
          <div className="text-sm text-gray-400">净热量</div>
          <div className="mt-3 flex items-end gap-2">
            <div className="text-6xl font-bold tracking-tight text-gray-900">
              {formatCalories(Math.abs(dailySummary.netCalories))}
            </div>
            <div className="text-lg text-green-600 mb-2">千卡</div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white/60 rounded-3xl p-4">
              <div className="text-xs text-gray-400">摄入</div>
              <div className="mt-2 text-2xl font-semibold text-gray-800">
                {formatCalories(dailySummary.totalIntake)}
              </div>
            </div>
            <div className="bg-white/60 rounded-3xl p-4">
              <div className="text-xs text-gray-400">消耗</div>
              <div className="mt-2 text-2xl font-semibold text-orange-500">
                -{formatCalories(Math.abs(dailySummary.totalBurn))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-[30px] p-5 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-800">AI 洞察</div>
              <div className="text-sm text-gray-400">
                {dailySummary.netCalories > 0 ? '今日略有热量盈余' : dailySummary.netCalories < 0 ? '今日热量缺口良好' : '今日热量完美平衡'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-800">最近记录</div>
            <div className="text-sm text-green-600">查看全部</div>
          </div>
          <div className="space-y-4 mt-4">
            {recentRecords.length === 0 ? (
              <div className="glass rounded-3xl p-8 text-center">
                <div className="text-4xl mb-3">🌿</div>
                <p className="text-gray-400">暂无记录</p>
                <p className="text-gray-400 text-sm mt-1">点击下方按钮开始记录</p>
              </div>
            ) : (
              recentRecords.map(record => (
                <div
                  key={record.id}
                  className="glass rounded-3xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                        record.type === 'food' ? 'bg-orange-100' : 'bg-green-100'
                      }`}
                    >
                      {record.type === 'food' ? getFoodEmoji(record.title) : getExerciseEmoji(record.title)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{record.title}</div>
                      <div className="text-sm text-gray-400">
                        {record.type === 'food' ? '食物' : '运动'}  {formatTime(record.date)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`text-lg font-semibold ${
                        record.type === 'food' ? 'text-gray-800' : 'text-orange-500'
                      }`}
                    >
                      {record.type === 'food' ? '+' : '-'}
                      {formatCalories(Math.abs(record.calories))}
                    </div>
                    <button
                      onClick={() => removeRecord(record.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <FloatingButton onClick={() => setShowAddModal(true)} />
      {showAddModal && <AddRecordModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
