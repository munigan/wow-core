"use client";

import { type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type StackedBarConfig = {
  dataKey: string;
  color: string;
  name: string;
};

type StackedBarChartProps<T = Record<string, unknown>> = {
  data: T[];
  bars: StackedBarConfig[];
  categoryKey: string;
  height?: number;
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

export const StackedBarChart = <T = Record<string, unknown>,>({
  data,
  bars,
  categoryKey,
  height = 300,
  tooltipFormatterAction,
}: StackedBarChartProps<T>) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data as Record<string, unknown>[]}
        layout="horizontal"
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
      >
        <CartesianGrid
          strokeDasharray="4 4"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--color-secondary)", fontSize: 11, fontFamily: "var(--font-body)" }}
          dy={8}
        />
        <YAxis
          type="category"
          dataKey={categoryKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--color-secondary)", fontSize: 11, fontFamily: "var(--font-body)" }}
          width={80}
        />
        <Tooltip
          content={<ChartTooltip formatter={tooltipFormatterAction} />}
          cursor={{ fill: "var(--color-border)", opacity: 0.3 }}
        />
        {bars.map((bar, index) => {
          const isLast = index === bars.length - 1;
          return (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color}
              stackId="stack"
              radius={isLast ? [0, 4, 4, 0] : [0, 0, 0, 0]}
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
};
