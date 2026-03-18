import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewLoading() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<div className="flex flex-col gap-1">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-4 w-96" />
			</div>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} className="h-24 w-full" />
				))}
			</div>
			<div className="flex flex-col gap-3">
				<Skeleton className="h-6 w-40" />
				<div className="flex flex-col border border-border">
					<Skeleton className="h-10 w-full" />
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton key={i} className="h-10 w-full border-t border-border" />
					))}
				</div>
			</div>
			<div className="flex flex-col gap-3">
				<Skeleton className="h-6 w-64" />
				<div className="grid grid-cols-2 gap-3">
					<Skeleton className="h-80 w-full" />
					<Skeleton className="h-80 w-full" />
				</div>
			</div>
			<div className="flex flex-col gap-3">
				<Skeleton className="h-6 w-56" />
				<div className="grid grid-cols-2 gap-3">
					<Skeleton className="h-80 w-full" />
					<Skeleton className="h-80 w-full" />
				</div>
			</div>
		</div>
	);
}
