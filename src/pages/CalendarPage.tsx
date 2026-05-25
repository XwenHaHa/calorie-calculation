import { useState } from 'react';
import { useApp } from '../store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { formatCalories, getFoodEmoji, getExerciseEmoji } from '../utils';

export function CalendarPage() {
  const { state, selectDate } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfMonth = monthStart.getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="pb-24 px-6 pt-16">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400">月度概览</div>
          <div className="text-3xl font-semibold text-gray-900 mt-1">
            {format(currentMonth, 'yyyy年 M月')}
          </div>
        </div>
        <div className="glass w-12 h-12 rounded-2xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <div className="glass rounded-[36px] p-5 mt-8">
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="glass w-10 h-10 rounded-2xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {format(currentMonth, 'yyyy年 M月', { locale: zhCN })}
          </h2>
          <button onClick={nextMonth} className="glass w-10 h-10 rounded-2xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-3 text-center text-sm text-gray-400 mb-3">
          {['一', '二', '三', '四', '五', '六', '日'].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3 text-center">
          {Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}
          {days.map(day => {
            const isSelected = isSameDay(day, state.selectedDate);
            const isCurrentDay = isToday(day);
            return (
              <button
                key={day.toString()}
                onClick={() => selectDate(day)}
                className={`h-10 rounded-2xl flex items-center justify-center text-sm transition-colors ${
                  isSelected
                    ? 'bg-green-500 text-white'
                    : isCurrentDay
                    ? 'bg-green-100 text-gray-800'
                    : 'hover:bg-white/60 text-gray-700'
                }`}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="glass rounded-3xl p-4 text-center">
          <div className="text-xs text-gray-400">摄入</div>
          <div className="mt-2 text-xl font-semibold text-gray-800">
            {formatCalories(state.monthlyStats.totalIntake)}
          </div>
        </div>
        <div className="glass rounded-3xl p-4 text-center">
          <div className="text-xs text-gray-400">消耗</div>
          <div className="mt-2 text-xl font-semibold text-orange-500">
            -{formatCalories(Math.abs(state.monthlyStats.totalBurn))}
          </div>
        </div>
        <div className="glass rounded-3xl p-4 text-center">
          <div className="text-xs text-gray-400">净热量</div>
          <div className="mt-2 text-xl font-semibold text-green-600">
            {formatCalories(state.monthlyStats.totalIntake - Math.abs(state.monthlyStats.totalBurn))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {format(state.selectedDate, 'M月dd日', { locale: zhCN })} 记录
        </h3>
        {state.recentRecords.length === 0 ? (
          <div className="glass rounded-3xl p-8 text-center">
            <p className="text-gray-400">暂无记录</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.recentRecords.map(record => (
              <div key={record.id} className="glass rounded-3xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${record.type === 'food' ? 'bg-orange-100' : 'bg-green-100'}`}>
                    {record.type === 'food' ? getFoodEmoji(record.title) : getExerciseEmoji(record.title)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{record.title}</div>
                    <div className="text-sm text-gray-400">{record.type === 'food' ? '食物' : '运动'}</div>
                  </div>
                </div>
                <span className={`font-semibold ${record.type === 'food' ? 'text-gray-800' : 'text-orange-500'}`}>
                  {record.type === 'food' ? '+' : '-'}
                  {formatCalories(Math.abs(record.calories))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
