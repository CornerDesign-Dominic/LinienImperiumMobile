# Großauftrag counters and test inventory

`stats.projectCompletions` holds cumulative successful Sonderauftrag counts by stable customer ID and one combined Empfehlungsauftrag count. The first migration counts retained completed project records once. After initialization, the central fleet completion transition increments the counter; failed, queued and active work does not count. Claiming and repeated sync do not count again. Counters remain valid if old visible records are later removed. Completion history data is retained; no existing rewards or records are deleted. Already discarded historical records without a counter cannot be reconstructed.

Statistics displays the five customer totals and one referral total. Recommendations remain independent of their originating customer.

The existing Testwerkzeuge section sends `testProjects` with `{}`. The server creates five normal queued specials (one per customer) and one queued shared referral using the same generation routine as expedition finds. Nothing starts or grants completion rewards; regular fleet requirements apply. Repeating an intentional request adds another set. Existing callable transaction receipts prevent duplicate delivery of the same request ID, including transaction retries. The test command follows the existing test-tool availability (which already includes coins, points, XP and reset); it is not a new client-writable inventory endpoint.

Checks cover grant categories and economic non-effects, migration, real fleet completion, repeat sync/claim, visible statistic labels, callable retry and account isolation.
