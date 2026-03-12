"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export const SignOutButton = () => {
	const router = useRouter();

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/sign-in");
				},
			},
		});
	};

	return (
		<button
			type="button"
			className="text-dimmed transition-colors hover:text-primary"
			aria-label="Sign out"
			onClick={handleSignOut}
		>
			<LogOut className="size-3.5" />
		</button>
	);
};
