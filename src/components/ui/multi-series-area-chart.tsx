"use client";

import { type ReactNode, useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type MultiSeriesConfig = {
  dataKey: string;
  color: string;
  name: string;
  yAxisId?: string;
  type?: "area" | "line";
};

type MultiSeriesAreaChartProps<T = Record<string, unknown>> = {
  data: T[];
  series: MultiSeriesConfig[];
  xAxisKey: string;
  height?: number;
  dualAxis?: boolean;
  yAxisFormatter?: (value: number) => string;
  yAxisRightFormatter?: (value: number) => string;
  tooltipFormatterAction?: (payload: T) => ReactNode;
};

type CustomTooltipProps<T> = {
  active?: boolean;
  payload?: { payload: T }[];
  formatter?: (payload: T) => ReactNode;
};

function ChartTooltip<T,>({ active, payload, formatter }: CustomTooltipProps<T>) {
  if (!active || !payload?.length || !formatter) return null;
  return (
    <div className="border border-accent bg-sidebar px-3.5 py-2.5">
      {formatter(payload[0].payload)}
    </div>
  );
}

const defaultYAxisFormatter = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);

export const MultiSeriesAreaChart = <T = Record<string, unknown>,>({
  data,
  series,
  xAxisKey,
  height = 300,
  dualAxis = false,
  yAxisFormatter = defaultYAxisFormatter,
  yAxisRightFormatter = defaultYAxisFormatter,
  tooltipFormatterAction,
}: MultiSeriesAreaChartProps<T>) => {
  const baseId = useId();

  const hasAreaSeries = series.some((s) => (s.type ?? "area") === "area");
  const hasLineSeries = series.some((s) => s.type === "line");

  // When all series are lines, use LineChart; otherwise use AreaChart
  const ChartComponent = hasAreaSeries ? AreaChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ChartComponent
        data={data as Record<string, unknown>[]}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
      >
        <defs>
          {series
            .filter((s) => (s.type ?? "area") === "area")
            .map((s) => (
              <linearGradient
                key={s.dataKey}
                id={`${baseId}-${s.dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
        </defs>
        <CartesianGrid
          strokeDasharray="4 4"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis
          dataKey={xAxisKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--color-secondary)", fontSize: 11, fontFamily: "var(--font-body)" }}
          dy={8}
        />
        <YAxis
          yAxisId="left"
          orientation="left"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--color-secondary)", fontSize: 11, fontFamily: "var(--font-body)" }}
          tickFormatter={yAxisFormatter}
          width={48}
        />
        {dualAxis && (
          <YAxis
            yAxisId="right"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-secondary)", fontSize: 11, fontFamily: "var(--font-body)" }}
            tickFormatter={yAxisRightFormatter}
            width={48}
          />
        )}
        <Tooltip
          content={<ChartTooltip formatter={tooltipFormatterAction} />}
          cursor={{ stroke: "var(--color-border)", strokeDasharray: "4 4" }}
        />
        {series.map((s) => {
          const seriesType = s.type ?? "area";
          const yAxisId = s.yAxisId ?? "left";

          if (seriesType === "line") {
            return (
              <Line
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                yAxisId={yAxisId}
                dot={{ r: 3, fill: s.color, stroke: "var(--color-card)", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: s.color, stroke: "var(--color-card)", strokeWidth: 2 }}
              />
            );
          }

          return (
            <Area
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#${baseId}-${s.dataKey})`}
              yAxisId={yAxisId}
              dot={{ r: 3, fill: s.color, stroke: "var(--color-card)", strokeWidth: 2 }}
              activeDot={{ r: 5, fill: s.color, stroke: "var(--color-card)", strokeWidth: 2 }}
            />
          );
        })}
      </ChartComponent>
    </ResponsiveContainer>
  );
};
