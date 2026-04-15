import { useMemo } from 'react';

export interface ChartTheme {
  gridStroke: string;
  axisStroke: string;
  tickFill: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipShadow: string;
  lineStroke: string;
  dotFill: string;
  refDotStroke: string;
  positiveBar: string;
  negativeBar: string;
  cursorOpacity: number;
  tooltipLabelColor: string;
}

export function useChartTheme(isDark: boolean): ChartTheme {
  return useMemo(() => {
    if (isDark) {
      return {
        gridStroke: '#35393E',
        axisStroke: '#35393E',
        tickFill: '#5A5F66',
        tooltipBg: '#1B1D21',
        tooltipBorder: '#35393E',
        tooltipShadow: '0 4px 6px -1px rgba(0,0,0,.4)',
        lineStroke: '#0EB12E',
        dotFill: '#0EB12E',
        refDotStroke: '#1B1D21',
        positiveBar: '#1CCE3F',
        negativeBar: '#FF665E',
        cursorOpacity: 0.25,
        tooltipLabelColor: '#CCCCCC',
      };
    }
    return {
      gridStroke: '#F2F2F2',
      axisStroke: '#E0E0E0',
      tickFill: '#999999',
      tooltipBg: '#FFFFFF',
      tooltipBorder: '#E0E0E0',
      tooltipShadow: '0 1px 3px rgba(0,0,0,0.08)',
      lineStroke: '#0EB12E',
      dotFill: '#0EB12E',
      refDotStroke: '#FFFFFF',
      positiveBar: '#0EB12E',
      negativeBar: '#D12514',
      cursorOpacity: 0.1,
      tooltipLabelColor: '#666666',
    };
  }, [isDark]);
}
