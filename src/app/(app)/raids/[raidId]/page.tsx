import type { Metadata } from "next";
import { HydrateClient, trpc } from "@/lib/trpc/server";
import { RaidDetails } from "./raid-details";

type RaidDetailPageProps = {
	params: Promise<{ raidId: string }>;
};

export const metadata: Metadata = {
	title: "Raid Details",
};

export default async function RaidDetailPage({ params }: RaidDetailPageProps) {
	const { raidId } = await params;
	void trpc.raids.getById.prefetch({ raidId });

	return (
		<HydrateClient>
			<RaidDetails raidId={raidId} />
		</HydrateClient>
	);
}
