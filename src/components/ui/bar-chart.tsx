"use client";

import { type ReactNode } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type BarChartDataPoint<T = Record<string, unknown>> = {
  label: string;
  value: number;
  color?: string;
  meta?: T;
};

type BarChartProps<T = Record<string, unknown>> = {
  data: BarChartDataPoint<T>[];
  color?: string;
  height?: number;
  layout?: "horizontal" | "vertical";
  tooltipFormatterAction?: (point: BarChartDataPoint<T>) => ReactNode;
};

type CustomTooltipProps<T> = {
  active?: boolean;
  payload?: { payload: BarChartDataPoint<T> }[];
  formatter?: (point: BarChartDataPoint<T>) => ReactNode;
};

function ChartTooltip<T,>({ active, payload, formatter }: CustomTooltipProps<T>) {
  if (!active || !payload?.length || !formatter) return null;
  return (
    <div className="border border-accent bg-sidebar px-3.5 py-2.5">
      {formatter(payload[0].payload)}
    </div>
  );
}

export const BarChart = <T = Record<string, unknown>,>({
  data,
  color = "var(--color-accent)",
  height = 300,
  layout = "horizontal",
  tooltipFormatterAction,
}: BarChartProps<T>) => {
  const isHorizontal = layout === "horizontal";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
      >
        <CartesianGrid
          strokeDasharray="4 4"
          stroke="var(--color-border)"
          vertical={false}
        />
        {isHorizontal ? (
          <>
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-secondary)", fontSize: 11, fontFamily: "var(--font-body)" }}
              dy={8}
            />
            <YAxis
              type="category"
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-secondary)", fontSize: 11, fontFamily: "var(--font-body)" }}
              width={80}
            />
          </>
        ) : (
          <>
            <XAxis
              type="category"
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-secondary)", fontSize: 11, fontFamily: "var(--font-body)" }}
              dy={8}
            />
            <YAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-secondary)", fontSize: 11, fontFamily: "var(--font-body)" }}
              width={48}
            />
          </>
        )}
        <Tooltip
          content={<ChartTooltip formatter={tooltipFormatterAction} />}
          cursor={{ fill: "var(--color-border)", opacity: 0.3 }}
        />
        <Bar
          dataKey="value"
          radius={isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color ?? color} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
