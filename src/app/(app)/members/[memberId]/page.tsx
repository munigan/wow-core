import type { Metadata } from "next";
import { HydrateClient, trpc } from "@/lib/trpc/server";
import { MemberDetails } from "./member-details";

type MemberDetailPageProps = {
	params: Promise<{ memberId: string }>;
};

export const metadata: Metadata = {
	title: "Member Details",
};

export default async function MemberDetailPage({
	params,
}: MemberDetailPageProps) {
	const { memberId } = await params;
	void trpc.members.getById.prefetch({ memberId });

	return (
		<HydrateClient>
			<MemberDetails memberId={memberId} />
		</HydrateClient>
	);
}
