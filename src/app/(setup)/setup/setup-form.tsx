"use client";

import { Sword } from "lucide-react";
import { CreateCoreForm } from "@/components/create-core-form";

export function SetupForm() {
	return (
		<div className="flex w-[420px] flex-col gap-8 border border-border bg-sidebar p-10">
			{/* Logo */}
			<div className="flex flex-col items-center gap-6">
				<div className="flex items-center justify-center gap-3">
					<Sword className="size-5 text-accent" />
					<span className="font-body text-base font-semibold tracking-wide text-primary">
						WOW RAID TOOLS
					</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<h1 className="font-heading text-lg font-semibold text-primary">
						Create Your First Core
					</h1>
					<p className="text-center font-body text-sm text-secondary">
						A core is your raid group workspace. Set up your first one to get
						started.
					</p>
				</div>
			</div>

			<CreateCoreForm />
		</div>
	);
}
