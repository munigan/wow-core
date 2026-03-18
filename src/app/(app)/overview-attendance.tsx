"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { CLASS_COLORS } from "@/lib/wow/class-colors";
import { trpc } from "@/lib/trpc/client";

const formatDate = (iso: string | Date): string => {
	return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const OverviewAttendance = () => {
	const { data, isLoading } = trpc.overview.getAttendance.useQuery();

	if (isLoading || !data) {
		return (
			<div className="flex flex-col gap-3">
				<div className="flex flex-col gap-1">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-4 w-64" />
				</div>
				<div className="overflow-hidden border border-border bg-card">
					<table className="w-full font-body">
						<thead>
							<tr className="border-b border-border">
								<th className="px-4 py-2 text-left text-2xs font-semibold uppercase tracking-wider text-dimmed">
									#
								</th>
								<th className="px-4 py-2 text-left text-2xs font-semibold uppercase tracking-wider text-dimmed">
									Player
								</th>
								<th className="px-4 py-2 text-left text-2xs font-semibold uppercase tracking-wider text-dimmed">
									Class
								</th>
								<th className="px-4 py-2 text-right text-2xs font-semibold uppercase tracking-wider text-dimmed">
									Raids
								</th>
								<th className="px-4 py-2 text-right text-2xs font-semibold uppercase tracking-wider text-dimmed">
									Attendance
								</th>
								<th className="px-4 py-2 text-right text-2xs font-semibold uppercase tracking-wider text-dimmed">
									Last Seen
								</th>
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: 8 }).map((_, i) => (
								<tr key={i} className="border-t border-border">
									<td className="px-4 py-2">
										<Skeleton className="h-4 w-4" />
									</td>
									<td className="px-4 py-2">
										<Skeleton className="h-4 w-24" />
									</td>
									<td className="px-4 py-2">
										<Skeleton className="h-4 w-32" />
									</td>
									<td className="px-4 py-2">
										<Skeleton className="ml-auto h-4 w-12" />
									</td>
									<td className="px-4 py-2">
										<Skeleton className="ml-auto h-4 w-10" />
									</td>
									<td className="px-4 py-2">
										<Skeleton className="ml-auto h-4 w-16" />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1">
				<h2 className="font-heading text-2xl font-bold uppercase text-primary">Attendance</h2>
				<p className="font-body text-xs uppercase tracking-wider text-secondary">
					{"// Last 8 weeks — "}{formatDate(data.startDate)} to {formatDate(data.endDate)}
				</p>
			</div>
			<div className="overflow-hidden border border-border bg-card">
				<table className="w-full font-body">
					<thead>
						<tr className="border-b border-border">
							<th className="px-4 py-2 text-left text-2xs font-semibold uppercase tracking-wider text-dimmed">
								#
							</th>
							<th className="px-4 py-2 text-left text-2xs font-semibold uppercase tracking-wider text-dimmed">
								Player
							</th>
							<th className="px-4 py-2 text-left text-2xs font-semibold uppercase tracking-wider text-dimmed">
								Class
							</th>
							<th className="px-4 py-2 text-right text-2xs font-semibold uppercase tracking-wider text-dimmed">
								Raids
							</th>
							<th className="px-4 py-2 text-right text-2xs font-semibold uppercase tracking-wider text-dimmed">
								Attendance
							</th>
							<th className="px-4 py-2 text-right text-2xs font-semibold uppercase tracking-wider text-dimmed">
								Last Seen
							</th>
						</tr>
					</thead>
					<tbody>
						{data.members.map((member, idx) => (
							<tr key={member.memberId} className="border-t border-border">
								<td className="px-4 py-2 text-sm text-dimmed">{idx + 1}</td>
								<td className="px-4 py-2 text-sm text-primary">{member.name}</td>
								<td
									className="px-4 py-2 text-sm"
									style={{
										color:
											CLASS_COLORS[member.class ?? ""] ?? "var(--color-primary)",
									}}
								>
									{member.class}
									{member.spec ? ` (${member.spec})` : ""}
								</td>
								<td className="px-4 py-2 text-right text-sm text-secondary">
									{member.raidsAttended} / {data.totalRaids}
								</td>
								<td
									data-high={member.attendanceRate >= 80 || undefined}
									data-mid={
										(member.attendanceRate >= 50 &&
											member.attendanceRate < 80) ||
										undefined
									}
									className="px-4 py-2 text-right text-sm font-semibold text-danger data-high:text-accent data-mid:text-warning"
								>
									{member.attendanceRate.toFixed(0)}%
								</td>
								<td className="px-4 py-2 text-right text-sm text-dimmed">
									{member.lastSeenDate ? formatDate(member.lastSeenDate) : "—"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
