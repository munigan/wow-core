import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

type InvitationEmailProps = {
	inviterName: string;
	coreName: string;
	acceptUrl: string;
};

export function InvitationEmail({
	inviterName,
	coreName,
	acceptUrl,
}: InvitationEmailProps) {
	return (
		<Html lang="en">
			<Tailwind>
				<Head />
				<Preview>You've been invited to join {coreName}</Preview>
				<Body className="bg-[#0C0C0C] font-sans">
					<Container className="mx-auto max-w-xl px-5 py-10">
						<Section className="bg-[#141414] border border-[#1E1E1E] p-8">
							<Heading className="m-0 mb-6 text-center text-2xl font-bold text-[#E5E5E5]">
								You're Invited!
							</Heading>
							<Text className="m-0 mb-4 text-base leading-6 text-[#A0A0A0]">
								<strong className="text-[#E5E5E5]">{inviterName}</strong>{" "}
								invited you to join{" "}
								<strong className="text-[#E5E5E5]">{coreName}</strong> on WoW
								Raid Tools.
							</Text>
							<Button
								href={acceptUrl}
								className="my-4 block rounded bg-[#00FF88] px-6 py-3 text-center text-sm font-bold text-[#0C0C0C] no-underline"
							>
								Accept Invitation
							</Button>
							<Hr className="my-6 border-[#1E1E1E]" />
							<Text className="m-0 text-xs text-[#666666]">
								If you didn't expect this invitation, you can safely ignore this
								email.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
