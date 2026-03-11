import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-page">
			<div className="flex flex-col items-center gap-4">
				<h1 className="font-heading text-2xl font-bold text-primary">
					Welcome, {session.user.name}
				</h1>
				<p className="font-body text-sm text-secondary">
					You are signed in as {session.user.email}
				</p>
			</div>
		</main>
	);
}
