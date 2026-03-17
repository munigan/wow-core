import type { Metadata } from "next";
import { db } from "@/lib/db";
import { cores } from "@/lib/db/schema/cores";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HydrateClient, trpc } from "@/lib/trpc/server";
import { GearInspector } from "./gear-inspector";

export const metadata: Metadata = {
	title: "Gear & Enchants",
};

export default async function GearPage() {
	const session = await auth.api.getSession({ headers: await headers() });
	const coreId = session?.session?.activeOrganizationId;
	if (!coreId) redirect("/setup");

	const core = await db
		.select({ realm: cores.realm })
		.from(cores)
		.where(eq(cores.id, coreId))
		.then((rows) => rows[0]);

	if (!core) redirect("/setup");

	void trpc.members.list.prefetch();

	return (
		<HydrateClient>
			<div className="flex flex-col gap-8 p-8">
				<div className="flex flex-col gap-1">
					<h1 className="font-heading text-4xl font-bold uppercase text-primary">
						Gear & Enchants
					</h1>
					<p className="font-body text-sm text-secondary">
						{"// Equipment audit and enchant compliance"}
					</p>
				</div>
				<GearInspector realm={core.realm} />
			</div>
		</HydrateClient>
	);
}
