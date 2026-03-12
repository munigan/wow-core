import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Raid Details",
};

export default function RaidsPage() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-4xl font-bold text-primary">
					Raid Details
				</h1>
				<p className="font-body text-sm text-secondary">
					{"// Boss encounters and performance metrics"}
				</p>
			</div>
		</div>
	);
}
