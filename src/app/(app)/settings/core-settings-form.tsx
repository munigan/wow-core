"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const coreSettingsSchema = z.object({
	name: z.string().min(2, "Core name must be at least 2 characters"),
});

type CoreSettingsData = z.infer<typeof coreSettingsSchema>;

export type CoreSettingsFormProps = {
	organizationId: string;
	name: string;
	realm: string;
	raidSize: string;
	isOwner: boolean;
};

const REALM_LABELS: Record<string, string> = {
	icecrown: "Icecrown (Warmane)",
	lordaeron: "Lordaeron (Warmane)",
	onyxia: "Onyxia (Warmane)",
};

export function CoreSettingsForm({
	organizationId,
	name,
	realm,
	raidSize,
	isOwner,
}: CoreSettingsFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<CoreSettingsData>({
		resolver: zodResolver(coreSettingsSchema),
		defaultValues: { name },
	});

	const firstError = errors.root?.message ?? errors.name?.message ?? "";
	const hasErrors = firstError !== "";

	async function onSubmitAction(data: CoreSettingsData) {
		setIsLoading(true);
		const result = await authClient.organization.update({
			data: { name: data.name },
			organizationId,
		});
		if (result.error) {
			setError("root", {
				message: result.error.message ?? "Failed to update core",
			});
			setIsLoading(false);
			return;
		}
		setIsLoading(false);
		router.refresh();
	}

	return (
		<section className="flex flex-col gap-4">
			<h2 className="font-heading text-lg font-bold uppercase text-primary">
				Core Settings
			</h2>
			<div className="flex flex-col gap-4 border border-border bg-card p-6">
				{hasErrors && <Alert message={firstError} />}

				{isOwner ? (
					<form
						onSubmit={handleSubmit(onSubmitAction)}
						className="flex flex-col gap-4"
					>
						<Input label="NAME" {...register("name")} />
						<div className="flex items-center gap-6">
							<div className="flex flex-col gap-1">
								<span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
									Realm
								</span>
								<span className="font-body text-sm text-secondary">
									{REALM_LABELS[realm] ?? realm}
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
									Raid Size
								</span>
								<span className="font-body text-sm text-secondary">
									{raidSize}-man
								</span>
							</div>
						</div>
						<div>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "SAVING..." : "SAVE"}
							</Button>
						</div>
					</form>
				) : (
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
								Name
							</span>
							<span className="font-body text-sm text-primary">{name}</span>
						</div>
						<div className="flex items-center gap-6">
							<div className="flex flex-col gap-1">
								<span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
									Realm
								</span>
								<span className="font-body text-sm text-secondary">
									{REALM_LABELS[realm] ?? realm}
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
									Raid Size
								</span>
								<span className="font-body text-sm text-secondary">
									{raidSize}-man
								</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
