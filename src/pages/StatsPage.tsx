import { useApp } from '../store';
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
        return `${data.name}<br/>净热量: ${data.value} 千卡`;
      },
    },
    xAxis: {
      type: 'category' as const,
      data: monthlyStats.dailyTrend.map(d => format(new Date(d.date), 'dd')),
      axisLabel: { interval: 4, color: '#999' },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { color: '#999' },
      splitLine: { lineStyle: { color: '#eee' } },
    },
    series: [
      {
        data: monthlyStats.dailyTrend.map(d => d.netCalories),
        type: 'line',
        smooth: true,
        lineStyle: { color: '#22c55e', width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(34, 197, 94, 0.3)' },
              { offset: 1, color: 'rgba(34, 197, 94, 0.02)' },
            ],
          },
        },
        itemStyle: { color: '#22c55e' },
        symbol: 'circle',
        symbolSize: 6,
      },
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
  };

  const netCalories = monthlyStats.totalIntake - Math.abs(monthlyStats.totalBurn);

  return (
    <div className="pb-24 px-6 pt-16">
      <div className="text-sm text-gray-400">月度趋势</div>
      <div className="text-4xl font-semibold text-gray-900 mt-2">
        {formatCalories(netCalories)}
      </div>
      <div className="text-green-600 mt-2">
        {netCalories > 0 ? '本月盈余' : netCalories < 0 ? '本月缺口' : '本月稳定'}
      </div>

      <div className="glass rounded-[38px] p-6 mt-8">
        <h3 className="text-sm text-gray-400 mb-2">每日净热量</h3>
        {monthlyStats.dailyTrend.length > 0 ? (
          <ReactECharts option={chartOption} style={{ height: 280 }} />
        ) : (
          <div className="flex items-center justify-center h-52">
            <p className="text-gray-400">暂无数据</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="glass rounded-3xl p-5">
          <div className="text-sm text-gray-400">日均摄入</div>
          <div className="mt-2 text-2xl font-semibold text-gray-800">
            {formatCalories(monthlyStats.totalIntake > 0 ? Math.round(monthlyStats.totalIntake / Math.max(monthlyStats.dailyTrend.length, 1)) : 0)}
          </div>
        </div>
        <div className="glass rounded-3xl p-5">
          <div className="text-sm text-gray-400">日均消耗</div>
          <div className="mt-2 text-2xl font-semibold text-orange-500">
            -{formatCalories(monthlyStats.totalBurn !== 0 ? Math.round(Math.abs(monthlyStats.totalBurn) / Math.max(monthlyStats.dailyTrend.length, 1)) : 0)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="glass rounded-3xl p-5">
          <div className="text-sm text-gray-400">总摄入</div>
          <div className="mt-2 text-2xl font-semibold text-gray-800">
            {formatCalories(monthlyStats.totalIntake)}
          </div>
        </div>
        <div className="glass rounded-3xl p-5">
          <div className="text-sm text-gray-400">总消耗</div>
          <div className="mt-2 text-2xl font-semibold text-orange-500">
            -{formatCalories(Math.abs(monthlyStats.totalBurn))}
          </div>
        </div>
      </div>
    </div>
  );
}
