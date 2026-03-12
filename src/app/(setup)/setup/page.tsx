import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SetupForm } from "./setup-form";

export const metadata: Metadata = {
	title: "Setup — WoW Raid Tools",
};

export default async function SetupPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	return <SetupForm />;
}
