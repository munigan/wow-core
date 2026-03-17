import type { Metadata } from "next";
import { HydrateClient, trpc } from "@/lib/trpc/server";
import { MembersList } from "./members-list";

export const metadata: Metadata = {
	title: "Members",
};

export default async function MembersPage() {
	void trpc.members.listWithStats.prefetch();

	return (
		<HydrateClient>
			<div className="flex flex-col gap-8 p-8">
				<div className="flex flex-col gap-1">
					<h1 className="font-heading text-4xl font-bold uppercase text-primary">
						Members
					</h1>
					<p className="font-body text-sm text-secondary">
						{"// Consumable usage & member analytics"}
					</p>
				</div>
				<MembersList />
			</div>
		</HydrateClient>
	);
}
