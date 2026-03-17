"use client";

import type { ReactNode } from "react";
import {
	TooltipContent,
	TooltipRoot,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export type HeatmapCellStatus = "full" | "partial" | "empty";

export type HeatmapCell = {
	value?: number;
	display?: string;
	status: HeatmapCellStatus;
};

export type HeatmapRow = {
	label: string;
	badge?: string;
	cells: HeatmapCell[];
};

type HeatmapGridProps = {
	rows: HeatmapRow[];
	columns: string[];
	tooltipFormatter?: (
		row: HeatmapRow,
		colIndex: number,
		cell: HeatmapCell,
	) => ReactNode;
};

function formatCellValue(cell: HeatmapCell): string {
	if (cell.display) return cell.display;
	if (cell.value !== undefined) return String(Math.round(cell.value));
	return "—";
}

export function HeatmapGrid({
	rows,
	columns,
	tooltipFormatter,
}: HeatmapGridProps) {
	if (rows.length === 0) return null;

	return (
		<div className="border border-border bg-card">
			{/* Header */}
			<div
				className="grid items-center border-b border-border px-4 py-2.5 font-body text-2xs uppercase tracking-wider text-dimmed"
				style={{
					gridTemplateColumns: `1fr auto repeat(${columns.length}, 80px)`,
				}}
			>
				<span>Date</span>
				<span className="w-28 text-center">Encounters</span>
				{columns.map((col) => (
					<span key={col} className="text-center">
						{col}
					</span>
				))}
			</div>

			{/* Rows */}
			{rows.map((row) => (
				<div
					key={row.label}
					className="grid items-center border-b border-elevated px-4 py-2.5 font-body text-sm"
					style={{
						gridTemplateColumns: `1fr auto repeat(${columns.length}, 80px)`,
					}}
				>
					<span className="text-primary">{row.label}</span>
					<span className="w-28 text-center text-2xs text-dimmed">
						{row.badge}
					</span>
					{row.cells.map((cell, colIndex) => (
						<div key={colIndex} className="flex justify-center">
							{tooltipFormatter ? (
								<TooltipRoot>
									<TooltipTrigger render={<span />}>
										<span
											data-full={cell.status === "full" || undefined}
											data-partial={cell.status === "partial" || undefined}
											className="cursor-default text-center text-danger data-full:text-accent data-partial:text-warning"
										>
											{formatCellValue(cell)}
										</span>
									</TooltipTrigger>
									<TooltipContent side="top">
										{tooltipFormatter(row, colIndex, cell)}
									</TooltipContent>
								</TooltipRoot>
							) : (
								<span
									data-full={cell.status === "full" || undefined}
									data-partial={cell.status === "partial" || undefined}
									className="text-center text-danger data-full:text-accent data-partial:text-warning"
								>
									{formatCellValue(cell)}
								</span>
							)}
						</div>
					))}
				</div>
			))}
		</div>
	);
}
