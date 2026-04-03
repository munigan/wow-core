import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { InvitationsForm } from "./invitations-form";

export const metadata: Metadata = {
	title: "Pending Invitations",
};

export default async function InvitationsPage() {
	const requestHeaders = await headers();

	const session = await auth.api.getSession({
		headers: requestHeaders,
	});

	if (!session) {
		redirect("/sign-in");
	}

	const invitations = await auth.api.listUserInvitations({
		headers: requestHeaders,
	});

	if (!invitations || invitations.length === 0) {
		redirect("/");
	}

	return (
		<div className="flex w-[420px] flex-col gap-8 border border-border bg-sidebar p-10">
			<div className="flex flex-col items-center gap-2">
				<h1 className="font-heading text-lg font-semibold text-primary">
					Pending Invitations
				</h1>
				<p className="text-center font-body text-sm text-secondary">
					You have been invited to join the following cores.
				</p>
			</div>
			<InvitationsForm
				invitations={invitations.map((inv) => ({
					id: inv.id,
					organizationName:
						((inv as Record<string, unknown>).organizationName as string) ??
						"Unknown Core",
					organizationId: inv.organizationId,
				}))}
			/>
		</div>
	);
}
