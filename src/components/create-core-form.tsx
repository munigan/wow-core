"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	SelectItem,
	SelectPopup,
	SelectRoot,
	SelectTrigger,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";

const createCoreSchema = z.object({
	name: z.string().min(2, "Core name must be at least 2 characters"),
	realm: z.enum(["onyxia", "icecrown", "lordaeron"], {
		error: "Select a realm",
	}),
	raidSize: z.enum(["10", "25"], {
		error: "Select a raid size",
	}),
});

type CreateCoreForm = z.infer<typeof createCoreSchema>;

type CreateCoreFormProps = {
	onSuccessAction?: () => void;
};

export function CreateCoreForm({ onSuccessAction }: CreateCoreFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		setError,
		formState: { errors },
	} = useForm<CreateCoreForm>({
		resolver: zodResolver(createCoreSchema),
	});

	const firstError =
		errors.root?.message ??
		errors.name?.message ??
		errors.realm?.message ??
		errors.raidSize?.message ??
		"";
	const hasErrors = firstError !== "";

	function generateSlug(name: string): string {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");
	}

	async function onSubmitAction(data: CreateCoreForm) {
		setIsLoading(true);

		const slug = generateSlug(data.name);

		const result = await authClient.organization.create({
			name: data.name,
			slug,
			realm: data.realm,
			raidSize: data.raidSize,
		} as Parameters<typeof authClient.organization.create>[0]);

		if (result.error) {
			setError("root", {
				message: result.error.message ?? "Failed to create core",
			});
			setIsLoading(false);
			return;
		}

		await authClient.organization.setActive({
			organizationId: result.data.id,
		});

		if (onSuccessAction) {
			onSuccessAction();
		}

		router.push("/");
		router.refresh();
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmitAction)}
			className="flex flex-col gap-6"
		>
			{hasErrors && <Alert message={firstError} />}

			<div className="flex flex-col gap-4">
				<Input
					label="CORE NAME"
					placeholder="Frostmourne 25H"
					{...register("name")}
				/>

				<div className="flex flex-col gap-1.5">
					<span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
						REALM
					</span>
					<SelectRoot
						onValueChangeAction={(value) => {
							if (value) setValue("realm", value as CreateCoreForm["realm"]);
						}}
					>
						<SelectTrigger placeholder="Select a realm" className="w-full" />
						<SelectPopup>
							<SelectItem value="icecrown">Icecrown (Warmane)</SelectItem>
							<SelectItem value="lordaeron">Lordaeron (Warmane)</SelectItem>
							<SelectItem value="onyxia">Onyxia (Warmane)</SelectItem>
						</SelectPopup>
					</SelectRoot>
				</div>

				<div className="flex flex-col gap-1.5">
					<span className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed">
						RAID SIZE
					</span>
					<div className="flex gap-2">
						<label className="flex flex-1 cursor-pointer items-center justify-center gap-2 border border-border bg-elevated px-3 py-2.5 font-body text-xs font-semibold uppercase tracking-wide text-secondary transition-colors has-checked:border-accent has-checked:text-accent">
							<input
								type="radio"
								value="10"
								className="sr-only"
								{...register("raidSize")}
							/>
							10-MAN
						</label>
						<label className="flex flex-1 cursor-pointer items-center justify-center gap-2 border border-border bg-elevated px-3 py-2.5 font-body text-xs font-semibold uppercase tracking-wide text-secondary transition-colors has-checked:border-accent has-checked:text-accent">
							<input
								type="radio"
								value="25"
								className="sr-only"
								{...register("raidSize")}
							/>
							25-MAN
						</label>
					</div>
				</div>
			</div>

			<Button
				type="submit"
				variant="primary"
				className="w-full"
				disabled={isLoading}
			>
				<Plus className="size-3.5" />
				{isLoading ? "CREATING..." : "CREATE CORE"}
			</Button>
		</form>
	);
}
