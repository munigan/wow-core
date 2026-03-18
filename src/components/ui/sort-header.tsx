"use client";

import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

type SortDirection = "asc" | "desc";

type SortHeaderProps = {
	label: string;
	column: string;
	currentSort: string;
	currentDirection: SortDirection;
	onSortAction: (column: string, direction: SortDirection) => void;
	className?: string;
};

export function SortHeader({
	label,
	column,
	currentSort,
	currentDirection,
	onSortAction,
	className = "",
}: SortHeaderProps) {
	const isActive = currentSort === column;

	function handleClick() {
		if (isActive) {
			onSortAction(column, currentDirection === "asc" ? "desc" : "asc");
		} else {
			onSortAction(column, "desc");
		}
	}

	return (
		<th className={`py-2.5 text-left font-normal ${className}`}>
			<button
				type="button"
				onClick={handleClick}
				data-active={isActive || undefined}
				className="group inline-flex cursor-pointer items-center gap-1 text-2xs uppercase tracking-wider text-dimmed transition-colors hover:text-secondary data-active:text-accent"
			>
				{label}
				{isActive ? (
					currentDirection === "asc" ? (
						<ChevronUp className="size-3" />
					) : (
						<ChevronDown className="size-3" />
					)
				) : (
					<ArrowUpDown className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
				)}
			</button>
		</th>
	);
}
