"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn, MessageCircle, Sword } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const signInSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof signInSchema>;

export function SignInForm() {
	const router = useRouter();
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<SignInForm>({
		resolver: zodResolver(signInSchema),
	});

	const firstError =
		errors.root?.message ??
		errors.email?.message ??
		errors.password?.message ??
		"";
	const hasErrors = firstError !== "";

	async function onSubmitAction(data: SignInForm) {
		setIsLoading(true);

		const result = await authClient.signIn.email({
			email: data.email,
			password: data.password,
		});

		if (result.error) {
			setError("root", { message: result.error.message ?? "Sign in failed" });
			setIsLoading(false);
			return;
		}

		router.push("/");
		router.refresh();
	}

	async function handleDiscord() {
		await authClient.signIn.social({
			provider: "discord",
			callbackURL: "/",
		});
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmitAction)}
			className="flex w-[420px] flex-col gap-8 border border-border bg-surface p-10"
		>
			{/* Logo */}
			<div className="flex flex-col items-center gap-8">
				<div className="flex items-center justify-center gap-3">
					<Sword className="h-7 w-7 text-accent" />
					<span className="font-body text-base font-bold tracking-widest text-primary">
						WOW RAID TOOLS
					</span>
				</div>
				<span className="font-body text-xs font-semibold tracking-wide text-dimmed">
					SIGN IN TO YOUR ACCOUNT
				</span>
			</div>

			{/* Error Alert */}
			{hasErrors && <Alert message={firstError} />}

			{/* Form Fields */}
			<div className="flex flex-col gap-4">
				<Input
					label="EMAIL OR BATTLE.NET ID"
					type="email"
					placeholder="arthas@frostmourne.gg"
					{...register("email")}
				/>

				<div className="flex flex-col gap-1.5">
					<div className="flex items-center justify-between">
						<label
							htmlFor="password"
							className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed"
						>
							PASSWORD
						</label>
						<button
							type="button"
							className="font-body text-2xs font-semibold tracking-wide text-accent"
						>
							FORGOT?
						</button>
					</div>
					<div className="relative">
						<input
							id="password"
							type={isPasswordVisible ? "text" : "password"}
							placeholder="••••••••••••"
							className="h-10 w-full border border-border bg-elevated px-3.5 font-body text-sm font-medium text-primary outline-none placeholder:text-dimmed focus:border-border-light"
							{...register("password")}
						/>
						<button
							type="button"
							onClick={() => setIsPasswordVisible(!isPasswordVisible)}
							className="absolute top-1/2 right-3.5 -translate-y-1/2 text-dimmed"
						>
							{isPasswordVisible ? (
								<Eye className="h-3.5 w-3.5" />
							) : (
								<EyeOff className="h-3.5 w-3.5" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="flex flex-col items-center gap-3">
				<Button
					type="submit"
					variant="primary"
					size="lg"
					className="w-full"
					disabled={isLoading}
				>
					<LogIn className="h-3.5 w-3.5" />
					{isLoading ? "SIGNING IN..." : "SIGN IN"}
				</Button>

				<div className="flex w-full items-center gap-3">
					<div className="h-px flex-1 bg-border" />
					<span className="font-body text-2xs font-bold tracking-wide text-dimmed">
						OR
					</span>
					<div className="h-px flex-1 bg-border" />
				</div>

				<Button
					type="button"
					variant="secondary"
					size="lg"
					className="w-full"
					onClick={handleDiscord}
				>
					<MessageCircle className="h-4 w-4 text-discord" />
					SIGN IN WITH DISCORD
				</Button>
			</div>

			{/* Footer */}
			<div className="flex items-center justify-center gap-1.5">
				<span className="font-body text-2xs font-medium tracking-wide text-dimmed">
					DON&apos;T HAVE AN ACCOUNT?
				</span>
				<Link
					href="/sign-up"
					className="font-body text-2xs font-bold tracking-wide text-accent"
				>
					SIGN UP
				</Link>
			</div>
		</form>
	);
}
