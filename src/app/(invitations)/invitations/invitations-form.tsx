"use client";

import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type InvitationsFormProps = {
	invitations: {
		id: string;
		organizationName: string;
		organizationId: string;
	}[];
};

export function InvitationsForm({ invitations }: InvitationsFormProps) {
	const router = useRouter();
	const [loadingId, setLoadingId] = useState<string | null>(null);
	const [handled, setHandled] = useState<Set<string>>(new Set());

	async function handleAccept(invitationId: string, organizationId: string) {
		setLoadingId(invitationId);
		await authClient.organization.acceptInvitation({
			invitationId,
		});
		await authClient.organization.setActive({
			organizationId,
		});
		setHandled((prev) => new Set(prev).add(invitationId));
		setLoadingId(null);

		const remaining = invitations.filter(
			(inv) => !handled.has(inv.id) && inv.id !== invitationId,
		);
		if (remaining.length === 0) {
			router.push("/");
			router.refresh();
		}
	}

	async function handleReject(invitationId: string) {
		setLoadingId(invitationId);
		await authClient.organization.rejectInvitation({
			invitationId,
		});
		setHandled((prev) => new Set(prev).add(invitationId));
		setLoadingId(null);

		const remaining = invitations.filter(
			(inv) => !handled.has(inv.id) && inv.id !== invitationId,
		);
		if (remaining.length === 0) {
			router.push("/");
			router.refresh();
		}
	}

	const pending = invitations.filter((inv) => !handled.has(inv.id));

	return (
		<div className="flex flex-col gap-3">
			{pending.map((inv) => (
				<div
					key={inv.id}
					className="flex items-center justify-between border border-border bg-elevated px-4 py-3"
				>
					<span className="font-body text-sm font-semibold text-primary">
						{inv.organizationName}
					</span>
					<div className="flex items-center gap-1">
						<button
							type="button"
							onClick={() => handleAccept(inv.id, inv.organizationId)}
							disabled={loadingId !== null}
							className="p-1.5 text-accent transition-colors hover:text-accent/80 disabled:opacity-40"
						>
							<Check className="size-4" />
						</button>
						<button
							type="button"
							onClick={() => handleReject(inv.id)}
							disabled={loadingId !== null}
							className="p-1.5 text-dimmed transition-colors hover:text-danger disabled:opacity-40"
						>
							<X className="size-4" />
						</button>
					</div>
				</div>
			))}
		</div>
	);
}
