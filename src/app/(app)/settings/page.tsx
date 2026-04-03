import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { CoreSettingsForm } from "./core-settings-form";
import { MembersSection } from "./members-section";

export const metadata: Metadata = {
	title: "Settings",
};

export default async function SettingsPage() {
	const requestHeaders = await headers();

	const session = await auth.api.getSession({
		headers: requestHeaders,
	});

	const fullOrg = await auth.api.getFullOrganization({
		headers: requestHeaders,
	});

	if (!fullOrg || !session) {
		return null;
	}

	const activeMember = fullOrg.members.find(
		(m) => m.userId === session.user.id,
	);
	const isOwner = activeMember?.role === "owner";

	return (
		<div className="flex flex-col gap-8 p-8">
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-4xl font-bold uppercase text-primary">
					Settings
				</h1>
				<p className="font-body text-sm text-secondary">
					{"// Core configuration and member management"}
				</p>
			</div>

			<div className="flex flex-col gap-10">
				<CoreSettingsForm
					organizationId={fullOrg.id}
					name={fullOrg.name}
					realm={(fullOrg as unknown as Record<string, string>).realm ?? ""}
					raidSize={
						(fullOrg as unknown as Record<string, string>).raidSize ?? ""
					}
					isOwner={isOwner}
				/>
				<MembersSection
					organizationId={fullOrg.id}
					members={fullOrg.members.map((m) => ({
						id: m.id,
						userId: m.userId,
						role: m.role,
						name: m.user.name,
						email: m.user.email,
					}))}
					invitations={(fullOrg.invitations ?? [])
						.filter((inv) => inv.status === "pending")
						.map((inv) => ({
							id: inv.id,
							email: inv.email,
							status: inv.status,
						}))}
					isOwner={isOwner}
					currentUserId={session.user.id}
				/>
			</div>
		</div>
	);
}
