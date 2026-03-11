"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, MessageCircle, Sword, UserPlus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSignUp(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		const result = await authClient.signUp.email({
			email,
			password,
			name,
		});

		if (result.error) {
			setError(result.error.message ?? "Sign up failed");
			setLoading(false);
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
			onSubmit={handleSignUp}
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
					CREATE YOUR ACCOUNT
				</span>
			</div>

			{/* Form Fields */}
			<div className="flex flex-col gap-4">
				<Input
					label="EMAIL OR BATTLE.NET ID"
					type="email"
					placeholder="arthas@frostmourne.gg"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>

				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="password"
						className="font-body text-2xs font-bold uppercase tracking-wide text-dimmed"
					>
						PASSWORD
					</label>
					<div className="relative">
						<input
							id="password"
							type={showPassword ? "text" : "password"}
							placeholder="••••••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="h-10 w-full border border-border bg-elevated px-3.5 font-body text-sm font-medium text-primary outline-none placeholder:text-dimmed focus:border-border-light"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute top-1/2 right-3.5 -translate-y-1/2 text-dimmed"
						>
							{showPassword ? (
								<Eye className="h-3.5 w-3.5" />
							) : (
								<EyeOff className="h-3.5 w-3.5" />
							)}
						</button>
					</div>
				</div>

				<Input
					label="CHARACTER NAME"
					type="text"
					placeholder="e.g. Arthás"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
			</div>

			{/* Error */}
			{error && (
				<p className="font-body text-xs font-medium text-red-500">{error}</p>
			)}

			{/* Actions */}
			<div className="flex flex-col items-center gap-3">
				<Button
					type="submit"
					variant="primary"
					size="lg"
					className="w-full"
					disabled={loading}
				>
					<UserPlus className="h-3.5 w-3.5" />
					{loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
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
					SIGN UP WITH DISCORD
				</Button>
			</div>

			{/* Footer */}
			<div className="flex items-center justify-center gap-1.5">
				<span className="font-body text-2xs font-medium tracking-wide text-dimmed">
					ALREADY HAVE AN ACCOUNT?
				</span>
				<Link
					href="/sign-in"
					className="font-body text-2xs font-bold tracking-wide text-accent"
				>
					SIGN IN
				</Link>
			</div>
		</form>
	);
}
