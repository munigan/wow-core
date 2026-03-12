import { accounts } from "./accounts";
import { cores } from "./cores";
import { sessions } from "./sessions";
import { users } from "./users";
import { verifications } from "./verifications";

export { accounts } from "./accounts";
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
};
