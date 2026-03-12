import { accounts } from "./accounts";
import { coreInvitations } from "./core-invitations";
import { coreMembers } from "./core-members";
import { cores } from "./cores";
import { sessions } from "./sessions";
import { users } from "./users";
import { verifications } from "./verifications";

export { accounts } from "./accounts";
export { coreInvitations } from "./core-invitations";
export { coreMembers } from "./core-members";
export { cores } from "./cores";
export { sessions } from "./sessions";
export { users } from "./users";
export { verifications } from "./verifications";

export const schema = {
	users,
	sessions,
	accounts,
	verifications,
	cores,
	coreMembers,
	coreInvitations,
};
