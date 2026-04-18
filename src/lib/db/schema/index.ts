import { accounts } from "./accounts";
import { armoryFetchRuns } from "./armory-fetch-runs";
import { buffUptimes } from "./buff-uptimes";
import { consumableUses } from "./consumable-uses";
import { coreInvitations } from "./core-invitations";
import { coreMembers } from "./core-members";
import { cores } from "./cores";
import { encounterPlayers } from "./encounter-players";
import { encounters } from "./encounters";
import { externalBuffs } from "./external-buffs";
import { memberArmoryMeta } from "./member-armory-meta";
import { memberGearSlots } from "./member-gear-slots";
import { members } from "./members";
import { playerDeaths } from "./player-deaths";
import { raidMembers } from "./raid-members";
import { raids } from "./raids";
import { sessions } from "./sessions";
import { users } from "./users";
import { verifications } from "./verifications";
import { wotlkItems } from "./wotlk-items";

export { accounts } from "./accounts";
export { armoryFetchRuns } from "./armory-fetch-runs";
export { buffUptimes } from "./buff-uptimes";
export { consumableUses } from "./consumable-uses";
export { coreInvitations } from "./core-invitations";
export { coreMembers } from "./core-members";
export { cores } from "./cores";
export { encounterPlayers } from "./encounter-players";
export { encounters } from "./encounters";
export { externalBuffs } from "./external-buffs";
export { memberArmoryMeta } from "./member-armory-meta";
export { memberGearSlots } from "./member-gear-slots";
export { members } from "./members";
export { playerDeaths } from "./player-deaths";
export { raidMembers } from "./raid-members";
export { raids } from "./raids";
export { sessions } from "./sessions";
export { users } from "./users";
export { verifications } from "./verifications";
export { wotlkItems } from "./wotlk-items";

export const schema = {
	users,
	sessions,
	accounts,
	verifications,
	cores,
	coreMembers,
	coreInvitations,
	members,
	memberGearSlots,
	memberArmoryMeta,
	armoryFetchRuns,
	raids,
	raidMembers,
	encounters,
	encounterPlayers,
	playerDeaths,
	consumableUses,
	buffUptimes,
	externalBuffs,
	wotlkItems,
};
