"use client";

import { type ReactNode, useId } from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type AreaChartDataPoint<T = Record<string, unknown>> = {
  label: string;
  value: number;
  meta?: T;
};

type AreaChartProps<T = Record<string, unknown>> = {
  data: AreaChartDataPoint<T>[];
  color?: string;
  height?: number;
  tooltipFormatter?: (point: AreaChartDataPoint<T>) => ReactNode;
};

type CustomTooltipProps<T> = {
  active?: boolean;
  payload?: { payload: AreaChartDataPoint<T> }[];
  formatter?: (point: AreaChartDataPoint<T>) => ReactNode;
};

function ChartTooltip<T>({ active, payload, formatter }: CustomTooltipProps<T>) {
  if (!active || !payload?.length || !formatter) return null;
  return (
    <div className="border border-accent bg-sidebar px-3.5 py-2.5">
      {formatter(payload[0].payload)}
    </div>
  );
}

export function AreaChart<T = Record<string, unknown>>({
  data,
  color = "var(--color-accent)",
  height = 280,
  tooltipFormatter,
}: AreaChartProps<T>) {
  const gradientId = useId();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="4 4"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--color-secondary)", fontSize: 11, fontFamily: "var(--font-body)" }}
          dy={8}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--color-secondary)", fontSize: 11, fontFamily: "var(--font-body)" }}
          tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
          width={48}
        />
        <Tooltip
          content={<ChartTooltip formatter={tooltipFormatter} />}
          cursor={{ stroke: "var(--color-border)", strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={{ r: 3, fill: color, stroke: "var(--color-card)", strokeWidth: 2 }}
          activeDot={{ r: 5, fill: color, stroke: "var(--color-card)", strokeWidth: 2 }}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
