import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { DistributionBucket } from '../types/simulation';
import type { ChartTheme } from '../hooks/useChartTheme';

interface Props {
  data: DistributionBucket[];
  chartTheme: ChartTheme;
}

export function ReturnDistributionChart({ data, chartTheme }: Props) {
  if (data.length === 0) return null;

  const chartData = data
    .filter((d) => d.count > 0 || (d.rangeStart >= -1 && d.rangeEnd <= 2))
    .map((d) => ({
      label: d.label,
      frequency: parseFloat((d.frequency * 100).toFixed(1)),
      isNegative: d.isNegative,
    }));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-etoro-xs font-medium text-neutral-400">
          Return distribution
        </span>
        <span className="text-[10px] text-neutral-500">
          % of historical windows
        </span>
      </div>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 4, bottom: 0, left: -20 }}
            barCategoryGap="15%"
          >
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: chartTheme.tickFill }}
              axisLine={{ stroke: chartTheme.axisStroke }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: chartTheme.tickFill }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              cursor={{ fill: chartTheme.tickFill, opacity: chartTheme.cursorOpacity }}
              contentStyle={{
                fontSize: 11,
                fontFamily: '"eToro", -apple-system, sans-serif',
                background: chartTheme.tooltipBg,
                border: `1px solid ${chartTheme.tooltipBorder}`,
                borderRadius: 6,
                boxShadow: chartTheme.tooltipShadow,
                color: chartTheme.tickFill,
              }}
              itemStyle={{ color: chartTheme.tooltipLabelColor }}
              formatter={(value: number) => [`${value}%`, 'Frequency']}
            />
            <Bar dataKey="frequency" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.isNegative ? chartTheme.negativeBar : chartTheme.positiveBar}
                  opacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
