import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { auth } from "@/lib/auth";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const requestHeaders = await headers();

	const session = await auth.api.getSession({
		headers: requestHeaders,
	});

	if (!session) {
		redirect("/sign-in");
	}

	const orgs = await auth.api.listOrganizations({
		headers: requestHeaders,
	});

	if (!orgs || orgs.length === 0) {
		const pendingInvitations = await auth.api.listUserInvitations({
			headers: requestHeaders,
		});
		if (pendingInvitations && pendingInvitations.length > 0) {
			redirect("/invitations");
		}
		redirect("/setup");
	}

	let activeCoreId = session.session.activeOrganizationId;

	if (!activeCoreId) {
		await auth.api.setActiveOrganization({
			headers: requestHeaders,
			body: { organizationId: orgs[0].id },
		});
		activeCoreId = orgs[0].id;
	}

	const cores = orgs.map((org) => ({
		id: org.id,
		name: org.name,
		slug: org.slug,
	}));

	return (
		<div className="flex h-screen bg-page">
			<Sidebar
				user={{ name: session.user.name, email: session.user.email }}
				cores={cores}
				activeCoreId={activeCoreId}
			/>
			<main className="flex-1 overflow-y-auto">{children}</main>
		</div>
	);
}
