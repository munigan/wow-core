import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { auth } from "@/lib/auth";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	return (
		<div className="flex h-screen bg-page">
			<Sidebar user={{ name: session.user.name, email: session.user.email }} />
			<main className="flex-1 overflow-y-auto">{children}</main>
		</div>
	);
}
