"use client";

import { useMemo } from "react";
import { BarChart } from "@/components/ui/bar-chart";
import { MultiSeriesAreaChart } from "@/components/ui/multi-series-area-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/client";
import { CLASS_COLORS } from "@/lib/wow/class-colors";

const formatNumber = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.round(n).toString();
};

const formatDate = (iso: string | Date): string => {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const OverviewDeathsPerformance = () => {
  const { data, isLoading } = trpc.overview.getDeathsAndPerformance.useQuery();

  const deathBarData = useMemo(() => {
    if (!data) return [];
    const avg =
      data.deathsByPlayer.length > 0
        ? data.deathsByPlayer.reduce((s, p) => s + p.totalDeaths, 0) /
          data.deathsByPlayer.length
        : 0;
    return data.deathsByPlayer.map((p) => ({
      label: p.playerName,
      value: p.totalDeaths,
      color:
        p.totalDeaths <= avg * 0.5
          ? "var(--color-accent)"
          : p.totalDeaths <= avg * 1.5
            ? "var(--color-warning)"
            : "var(--color-danger)",
      meta: { deathsPerRaid: p.deathsPerRaid, topKillingSource: p.topKillingSource },
    }));
  }, [data]);

  const trendData = useMemo(() => {
    if (!data) return [];
    return data.performanceTrend.map((r) => ({
      date: r.date ? formatDate(r.date) : "",
      dps: r.avgDps,
      deaths: r.totalDeaths,
    }));
  }, [data]);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-border bg-card p-4">
            <Skeleton className="mb-3 h-3 w-28" />
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="border border-border bg-card p-4">
            <Skeleton className="mb-3 h-3 w-40" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-36" />
        </div>
      </div>
    );
  }

  const deathChartHeight = Math.max(300, deathBarData.length * 32);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl font-bold uppercase text-primary">
          Deaths & Performance
        </h2>
        <p className="font-body text-xs uppercase tracking-wider text-secondary">
          {"// Outliers and trends — last 8 weeks"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-border bg-card p-4">
          <span className="mb-3 block font-body text-2xs uppercase tracking-wider text-dimmed">
            Deaths per Player
          </span>
          <BarChart
            data={deathBarData}
            height={deathChartHeight}
            layout="horizontal"
            tooltipFormatterAction={(point) => (
              <div className="flex flex-col gap-1">
                <span className="font-body text-xs font-semibold text-primary">
                  {point.label}
                </span>
                <span className="font-body text-2xs text-dimmed">
                  Total Deaths:{" "}
                  <span className="font-semibold text-primary">{point.value}</span>
                </span>
                <span className="font-body text-2xs text-dimmed">
                  Per Raid:{" "}
                  <span className="font-semibold text-primary">
                    {(point.meta as { deathsPerRaid: number; topKillingSource: string | null }).deathsPerRaid.toFixed(1)}
                  </span>
                </span>
                {(point.meta as { deathsPerRaid: number; topKillingSource: string | null }).topKillingSource && (
                  <span className="font-body text-2xs text-dimmed">
                    Top Source:{" "}
                    <span className="font-semibold text-primary">
                      {(point.meta as { deathsPerRaid: number; topKillingSource: string | null }).topKillingSource}
                    </span>
                  </span>
                )}
              </div>
            )}
          />
        </div>

        <div className="border border-border bg-card p-4">
          <span className="mb-3 block font-body text-2xs uppercase tracking-wider text-dimmed">
            Raid Performance Trend
          </span>
          <MultiSeriesAreaChart
            data={trendData}
            xAxisKey="date"
            height={300}
            series={[
              {
                dataKey: "dps",
                color: "var(--color-accent)",
                name: "Raid DPS",
                yAxisId: "left",
              },
              {
                dataKey: "deaths",
                color: "var(--color-danger)",
                name: "Deaths",
                yAxisId: "right",
                type: "line",
              },
            ]}
            dualAxis={true}
            yAxisFormatter={(v) => formatNumber(v)}
            yAxisRightFormatter={(v) => String(v)}
            tooltipFormatterAction={(payload) => {
              const p = payload as { date: string; dps: number; deaths: number };
              return (
                <div className="flex flex-col gap-1">
                  <span className="font-body text-xs font-semibold text-primary">{p.date}</span>
                  <span className="font-body text-2xs text-dimmed">
                    Raid DPS:{" "}
                    <span className="font-semibold text-accent">{formatNumber(p.dps)}</span>
                  </span>
                  <span className="font-body text-2xs text-dimmed">
                    Deaths:{" "}
                    <span className="font-semibold text-danger">{p.deaths}</span>
                  </span>
                </div>
              );
            }}
          />
        </div>
      </div>

      {data.attentionNeeded.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="font-body text-2xs uppercase tracking-wider text-dimmed">
            Attention Needed
          </span>
          <div className="flex flex-wrap gap-2">
            {data.attentionNeeded.map((player) => (
              <div
                key={player.memberId}
                data-severe={player.pctDiff <= -30 || undefined}
                className="flex items-center gap-2 border border-warning bg-card px-3 py-2 data-severe:border-danger"
              >
                <span
                  className="font-body text-xs font-semibold"
                  style={{
                    color:
                      CLASS_COLORS[player.class ?? ""] ?? "var(--color-primary)",
                  }}
                >
                  {player.name}
                </span>
                <span className="font-body text-2xs text-dimmed">{player.class}</span>
                <span className="font-body text-2xs text-dimmed">
                  {formatNumber(player.avgDps)} avg DPS
                </span>
                <span className="font-body text-2xs font-semibold text-danger">
                  {player.pctDiff.toFixed(0)}% vs role avg
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
