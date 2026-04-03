"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const inviteSchema = z.object({
	email: z.email("Enter a valid email address"),
});

type InviteData = z.infer<typeof inviteSchema>;

export type MembersSectionProps = {
	organizationId: string;
	members: {
		id: string;
		userId: string;
		role: string;
		name: string;
		email: string;
	}[];
	invitations: {
		id: string;
		email: string;
		status: string;
	}[];
	isOwner: boolean;
	currentUserId: string;
};

export function MembersSection({
	organizationId,
	members,
	invitations,
	isOwner,
	currentUserId,
}: MembersSectionProps) {
	const router = useRouter();
	const [isInviting, setIsInviting] = useState(false);
	const [removingId, setRemovingId] = useState<string | null>(null);
	const [cancellingId, setCancellingId] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		setError,
		reset,
		formState: { errors },
	} = useForm<InviteData>({
		resolver: zodResolver(inviteSchema),
	});

	const firstError = errors.root?.message ?? errors.email?.message ?? "";
	const hasErrors = firstError !== "";

	async function onInviteAction(data: InviteData) {
		setIsInviting(true);
		const result = await authClient.organization.inviteMember({
			email: data.email,
			role: "member",
			organizationId,
		});
		if (result.error) {
			setError("root", {
				message: result.error.message ?? "Failed to send invitation",
			});
			setIsInviting(false);
			return;
		}
		reset();
		setIsInviting(false);
		router.refresh();
	}

	async function handleCancelInvitation(invitationId: string) {
		if (!confirm("Cancel this invitation?")) return;
		setCancellingId(invitationId);
		await authClient.organization.cancelInvitation({
			invitationId,
		});
		setCancellingId(null);
		router.refresh();
	}

	async function handleRemoveMember(memberIdToRemove: string) {
		if (!confirm("Remove this member from the core?")) return;
		setRemovingId(memberIdToRemove);
		await authClient.organization.removeMember({
			memberIdOrEmail: memberIdToRemove,
			organizationId,
		});
		setRemovingId(null);
		router.refresh();
	}

	return (
		<section className="flex flex-col gap-4">
			<h2 className="font-heading text-lg font-bold uppercase text-primary">
				Members
			</h2>
			<div className="flex flex-col gap-6 border border-border bg-card p-6">
				{/* Invite form (owner only) */}
				{isOwner && (
					<form
						onSubmit={handleSubmit(onInviteAction)}
						className="flex flex-col gap-3"
					>
						{hasErrors && <Alert message={firstError} />}
						<div className="flex items-end gap-2">
							<div className="flex-1">
								<Input
									label="INVITE BY EMAIL"
									placeholder="player@example.com"
									{...register("email")}
								/>
							</div>
							<Button type="submit" disabled={isInviting}>
								{isInviting ? "INVITING..." : "INVITE"}
							</Button>
						</div>
					</form>
				)}

				{/* Pending invitations (owner only) */}
				{isOwner && invitations.length > 0 && (
					<div className="flex flex-col gap-2">
						<span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
							Pending Invitations
						</span>
						<div className="flex flex-col">
							{invitations.map((inv) => (
								<div
									key={inv.id}
									className="flex items-center justify-between border-b border-elevated py-2.5 last:border-b-0"
								>
									<div className="flex items-center gap-2">
										<span className="font-body text-sm text-primary">
											{inv.email}
										</span>
										<Badge variant="warning">Pending</Badge>
									</div>
									<button
										type="button"
										onClick={() => handleCancelInvitation(inv.id)}
										disabled={cancellingId === inv.id}
										className="p-1 text-dimmed transition-colors hover:text-danger disabled:opacity-40"
									>
										<X className="size-4" />
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Members list */}
				<div className="flex flex-col gap-2">
					<span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
						Members
					</span>
					<div className="flex flex-col">
						{members.map((member) => {
							const isCurrentUser = member.userId === currentUserId;
							const isMemberOwner = member.role === "owner";

							return (
								<div
									key={member.id}
									className="flex items-center justify-between border-b border-elevated py-2.5 last:border-b-0"
								>
									<div className="flex flex-col">
										<span className="font-body text-sm text-primary">
											{member.name}
											{isCurrentUser && (
												<span className="text-dimmed"> (you)</span>
											)}
										</span>
										<span className="font-body text-2xs text-dimmed">
											{member.email}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Badge variant={isMemberOwner ? "success" : undefined}>
											{member.role}
										</Badge>
										{isOwner && !isCurrentUser && (
											<button
												type="button"
												onClick={() => handleRemoveMember(member.id)}
												disabled={removingId === member.id}
												className="p-1 text-dimmed transition-colors hover:text-danger disabled:opacity-40"
											>
												<X className="size-4" />
											</button>
										)}
									</div>
								</div>
							);
						})}
					</div>

					{/* Empty state */}
					{members.length === 1 && invitations.length === 0 && isOwner && (
						<p className="pt-2 font-body text-xs text-dimmed">
							You're the only member. Invite others to share access to
							this core.
						</p>
					)}
				</div>
			</div>
		</section>
	);
}
