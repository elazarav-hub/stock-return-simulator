import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import type { RiskTimePoint } from '../types/simulation';
import type { ChartTheme } from '../hooks/useChartTheme';

interface Props {
  data: RiskTimePoint[];
  currentPeriod: number;
  chartTheme: ChartTheme;
}

export function RiskOverTimeChart({ data, currentPeriod, chartTheme }: Props) {
  if (data.length === 0) return null;

  const chartData = data.map((d) => ({
    months: `${d.months}m`,
    monthsRaw: d.months,
    risk: parseFloat((d.liquidationRisk * 100).toFixed(1)),
  }));

  const currentPoint = chartData.find((d) => d.monthsRaw === currentPeriod);

  const showInsight =
    data.length >= 2 &&
    data[data.length - 1].liquidationRisk < data[0].liquidationRisk;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-etoro-xs font-medium text-neutral-600 dark:text-neutral-400">
          Risk over time
        </span>
        <span className="text-[10px] text-neutral-500">
          Liquidation risk %
        </span>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 4, right: 8, bottom: 0, left: -20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartTheme.gridStroke}
              vertical={false}
            />
            <XAxis
              dataKey="months"
              tick={{ fontSize: 10, fill: chartTheme.tickFill }}
              axisLine={{ stroke: chartTheme.axisStroke }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: chartTheme.tickFill }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
              domain={[0, 'auto']}
            />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                fontFamily: '"eToro", -apple-system, sans-serif',
                background: chartTheme.tooltipBg,
                border: `1px solid ${chartTheme.tooltipBorder}`,
                borderRadius: 6,
                boxShadow: chartTheme.tooltipShadow,
                color: chartTheme.tickFill,
              }}
              formatter={(value: number) => [`${value}%`, 'Liquidation risk']}
            />
            <Line
              type="monotone"
              dataKey="risk"
              stroke={chartTheme.lineStroke}
              strokeWidth={2}
              dot={{ r: 3, fill: chartTheme.dotFill, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: chartTheme.dotFill }}
            />
            {currentPoint && (
              <ReferenceDot
                x={currentPoint.months}
                y={currentPoint.risk}
                r={6}
                fill={chartTheme.dotFill}
                stroke={chartTheme.refDotStroke}
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {showInsight && (
        <p className="text-[10px] text-neutral-500 mt-2">
          Historically, longer holding periods have reduced liquidation risk for
          this configuration.
        </p>
      )}
    </div>
  );
}
