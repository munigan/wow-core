import { Skeleton } from "@/components/ui/skeleton";

export default function RaidDetailLoading() {
	return (
		<div className="flex flex-col gap-8 p-8">
			{/* Header */}
			<div className="flex flex-col gap-1">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-4 w-96" />
			</div>

			{/* Metric Cards */}
			<div className="grid grid-cols-4 gap-3">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className="h-16 w-full" />
				))}
			</div>

			{/* Encounters Table */}
			<div className="flex flex-col gap-3">
				<Skeleton className="h-4 w-40" />
				<div className="flex flex-col border border-border">
					<Skeleton className="h-10 w-full" />
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-12 w-full border-t border-border" />
					))}
				</div>
			</div>

			{/* Per-Player Breakdown */}
			<div className="flex flex-col gap-3">
				<Skeleton className="h-4 w-48" />
				<div className="flex gap-2">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-8 w-28" />
					<Skeleton className="h-8 w-28" />
				</div>
				<div className="flex flex-col border border-border">
					<Skeleton className="h-10 w-full" />
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton key={i} className="h-10 w-full border-t border-border" />
					))}
				</div>
			</div>
		</div>
	);
}
