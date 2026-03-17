import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GearLoading() {
	return (
		<div className="flex flex-col gap-8 p-8">
			{/* Header */}
			<div className="flex flex-col gap-1">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-4 w-80" />
			</div>
			{/* Filter row */}
			<div className="flex gap-3">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-10 w-32" />
			</div>
			{/* Table */}
			<div className="flex flex-col gap-3">
				<Skeleton className="h-3 w-32" />
				<div className="border border-border bg-card">
					<Skeleton className="h-9 w-full" />
					{Array.from({ length: 16 }).map((_, i) => (
						<Skeleton key={i} className="h-11 w-full border-t border-border" />
					))}
				</div>
			</div>
			{/* Notes + Professions */}
			<div className="flex gap-3">
				<Card className="flex-1">
					<Skeleton className="h-3 w-40" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</Card>
				<Card className="w-80 shrink-0">
					<Skeleton className="h-3 w-28" />
					<Skeleton className="h-4 w-48" />
					<Skeleton className="h-4 w-40" />
				</Card>
			</div>
		</div>
	);
}
