import { useState } from 'react';
import { useApp } from '../store';
import { Card } from '../components/Card';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { formatCalories } from '../utils';

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
    <div className="pb-20">
      <header className="bg-white px-4 py-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">日历</h1>
      </header>

      <div className="p-4">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold">
              {format(currentMonth, 'yyyy年MM月', { locale: zhCN })}
            </h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
              <div key={day} className="text-center text-sm text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {days.map(day => {
              const isSelected = isSameDay(day, state.selectedDate);
              const isCurrentDay = isToday(day);

              return (
                <button
                  key={day.toString()}
                  onClick={() => selectDate(day)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-green-500 text-white'
                      : isCurrentDay
                      ? 'bg-green-50 text-green-600'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-sm">{format(day, 'd')}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 px-1">
            {format(state.selectedDate, 'MM月dd日', { locale: zhCN })} 记录
          </h3>
          {state.recentRecords.length === 0 ? (
            <Card>
              <p className="text-center text-gray-400 py-8">暂无记录</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {state.recentRecords.map(record => (
                <Card key={record.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{record.title}</p>
                    <p className="text-sm text-gray-500">{record.type === 'food' ? '食物' : '运动'}</p>
                  </div>
                  <span
                    className={`font-semibold ${
                      record.type === 'food' ? 'text-orange-500' : 'text-green-500'
                    }`}
                  >
                    {record.type === 'food' ? '+' : '-'}
                    {formatCalories(Math.abs(record.calories))}
                  </span>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}