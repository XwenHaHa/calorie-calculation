import { useApp } from '../store';
import { Card } from '../components/Card';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { formatCalories } from '../utils';
import ReactECharts from 'echarts-for-react';

export function StatsPage() {
  const { state } = useApp();
  const { monthlyStats } = state;

  const chartOption = {
    tooltip: {
      trigger: 'axis' as const,
      formatter: (params: { name: string; value: number }[]) => {
        const data = params[0];
        return `${data.name}<br/>净热量: ${data.value} 卡`;
      },
    },
    xAxis: {
      type: 'category' as const,
      data: monthlyStats.dailyTrend.map(d => {
        const date = new Date(d.date);
        return format(date, 'dd', { locale: zhCN });
      }),
      axisLabel: {
        interval: 4,
      },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: {
        formatter: '{value}',
      },
    },
    series: [
      {
        data: monthlyStats.dailyTrend.map(d => d.netCalories),
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#22c55e',
          width: 3,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(34, 197, 94, 0.3)' },
              { offset: 1, color: 'rgba(34, 197, 94, 0.05)' },
            ],
          },
        },
        itemStyle: {
          color: '#22c55e',
        },
      },
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
  };

  return (
    <div className="pb-20">
      <header className="bg-white px-4 py-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">月度统计</h1>
        <p className="text-sm text-gray-500 mt-1">
          {format(state.selectedDate, 'yyyy年MM月', { locale: zhCN })}
        </p>
      </header>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <p className="text-sm text-gray-500">总摄入</p>
            <p className="text-2xl font-semibold text-orange-500">
              {formatCalories(monthlyStats.totalIntake)}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">总消耗</p>
            <p className="text-2xl font-semibold text-green-500">
              {formatCalories(monthlyStats.totalBurn)}
            </p>
          </Card>
        </div>

        <Card>
          <p className="text-sm text-gray-500 mb-1">日均净热量</p>
          <p className="text-2xl font-semibold text-gray-800">
            {formatCalories(Math.round(monthlyStats.avgNetCalories))}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {monthlyStats.avgNetCalories > 0 ? '盈余' : monthlyStats.avgNetCalories < 0 ? '缺口' : '平衡'}
          </p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">热量趋势</h3>
          {monthlyStats.dailyTrend.length > 0 ? (
            <ReactECharts option={chartOption} style={{ height: 300 }} />
          ) : (
            <p className="text-center text-gray-400 py-12">暂无数据</p>
          )}
        </Card>
      </div>
    </div>
  );
}