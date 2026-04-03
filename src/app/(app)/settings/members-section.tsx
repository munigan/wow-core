"use client";

export type MembersSectionProps = {
	organizationId: string;
	members: {
		id: string;
		userId: string;
		role: string;
		name: string;
		email: string;
	}[];
	invitations: {
		id: string;
		email: string;
		status: string;
	}[];
	isOwner: boolean;
	currentUserId: string;
};

export function MembersSection(props: MembersSectionProps) {
	return <div>Members placeholder</div>;
}
