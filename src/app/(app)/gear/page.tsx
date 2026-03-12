import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Gear & Enchants",
};

export default function GearPage() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-4xl font-bold text-primary">
					Gear & Enchants
				</h1>
				<p className="font-body text-sm text-secondary">
					{"// Equipment audit and enchant compliance"}
				</p>
			</div>
		</div>
	);
}
