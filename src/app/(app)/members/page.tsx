import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Members",
};

export default function MembersPage() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-4xl font-bold uppercase text-primary">
					Members
				</h1>
				<p className="font-body text-sm text-secondary">
					{"// Roster and individual performance"}
				</p>
			</div>
		</div>
	);
}
