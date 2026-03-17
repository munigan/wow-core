import { Skeleton } from "@/components/ui/skeleton";

export default function RaidsLoading() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<div className="flex flex-col gap-1">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-4 w-80" />
			</div>
			<div className="flex flex-col gap-1">
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} className="h-14 w-full" />
				))}
			</div>
		</div>
	);
}
