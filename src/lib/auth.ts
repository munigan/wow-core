import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { db } from "@/lib/db";
import { schema } from "@/lib/db/schema";
import { InvitationEmail } from "@/emails/invitation";
import { resend } from "@/lib/resend";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...schema,
			user: schema.users,
			session: schema.sessions,
			account: schema.accounts,
			verification: schema.verifications,
			organization: schema.cores,
			member: schema.coreMembers,
			invitation: schema.coreInvitations,
		},
	}),
	emailAndPassword: {
		enabled: true,
	},
user: {
		modelName: "users",
	},
	session: {
		modelName: "sessions",
	},
	plugins: [
		organization({
			sendInvitationEmail: async (data) => {
				await resend.emails.send({
					from: process.env.RESEND_FROM_EMAIL!,
					to: data.email,
					subject: `You've been invited to ${data.organization.name}`,
					react: InvitationEmail({
						inviterName: data.inviter.user.name,
						coreName: data.organization.name,
						acceptUrl: `${process.env.BETTER_AUTH_URL}/sign-up`,
					}),
				});
			},
			schema: {
				organization: {
					modelName: "cores",
					additionalFields: {
						realm: {
							type: "string",
							required: true,
							input: true,
						},
						raidSize: {
							type: "string",
							required: true,
							input: true,
						},
					},
				},
				member: {
					modelName: "coreMembers",
				},
				invitation: {
					modelName: "coreInvitations",
				},
			},
		}),
	],
	advanced: {
		database: {
			generateId: false,
		},
	},
});
