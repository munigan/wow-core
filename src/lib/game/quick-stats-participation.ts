/**
 * Minimum distinct raids a player must appear in (per encounter presence) to be
 * eligible for ranked Quick Stats. Reduces one-off outliers (e.g. top DPS from a single raid).
 *
 * - 1 raid in window → everyone who showed up qualifies (1).
 * - 2+ raids → at least 2 raids, and at least 25% of `totalRaids` (rounded up).
 */
export const getMinRaidsForQuickStatsEligibility = (
	totalRaids: number,
): number => {
	if (totalRaids <= 1) return 1;
	return Math.min(totalRaids, Math.max(2, Math.ceil(totalRaids * 0.25)));
};
