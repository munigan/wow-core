import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MemberDetailLoading() {
	return (
		<div className="flex flex-col gap-8 p-8">
			{/* Header */}
			<div className="flex flex-col gap-1">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-4 w-64" />
			</div>
			{/* Stat cards */}
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<Skeleton className="h-8 w-24" />
						<Skeleton className="h-3 w-16" />
					</Card>
				))}
			</div>
			{/* Chart */}
			<div className="flex flex-col gap-3">
				<Skeleton className="h-3 w-48" />
				<Skeleton className="h-70" />
			</div>
			{/* Heatmap */}
			<div className="flex flex-col gap-3">
				<Skeleton className="h-3 w-40" />
				<Skeleton className="h-48" />
			</div>
		</div>
	);
}
