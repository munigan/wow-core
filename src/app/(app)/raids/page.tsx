import type { Metadata } from "next";
import { HydrateClient, trpc } from "@/lib/trpc/server";
import { RaidsList } from "./raids-list";

export const metadata: Metadata = {
	title: "Raids",
};

export default async function RaidsPage() {
	void trpc.raids.list.prefetch();
	void trpc.raids.listInstances.prefetch();

	return (
		<HydrateClient>
			<div className="flex flex-col gap-8 p-8">
				<div className="flex flex-col gap-1">
					<h1 className="font-heading text-4xl font-bold uppercase text-primary">
						Raids
					</h1>
					<p className="font-body text-sm text-secondary">
						{"// Boss encounters and performance metrics"}
					</p>
				</div>
				<RaidsList />
			</div>
		</HydrateClient>
	);
}
