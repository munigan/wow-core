import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Trends",
};

export default function TrendsPage() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-4xl font-bold uppercase text-primary">
					Trends
				</h1>
				<p className="font-body text-sm text-secondary">
					{"// Group performance metrics over time"}
				</p>
			</div>
		</div>
	);
}
