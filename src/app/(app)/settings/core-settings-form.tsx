"use client";

export type CoreSettingsFormProps = {
	organizationId: string;
	name: string;
	realm: string;
	raidSize: string;
	isOwner: boolean;
};

export function CoreSettingsForm(props: CoreSettingsFormProps) {
	return <div>Core settings placeholder</div>;
}
