import { Skeleton } from "@/components/ui/skeleton";

export default function MemberDetailLoading() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<div className="flex flex-col gap-1">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-4 w-64" />
			</div>
			<div className="border border-border">
				<Skeleton className="h-10 w-full" />
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton key={i} className="h-12 w-full border-t border-border" />
				))}
			</div>
		</div>
	);
}
