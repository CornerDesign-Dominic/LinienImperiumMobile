# Vehicle forecasts inside single-contract details

Prepared; not published.

- Each eligible vehicle shows tours, duration, server-calculated XP and total profit including the completion bonus.
- A separate disclosure on each vehicle expands contract revenue, operating costs, completion bonus and relationship reward. Expanding does not select a vehicle.
- The separate overall forecast card is removed.
- Active assignments retain their server forecast, including already booked and frozen current-tour economics. Their summary distinguishes remaining tours/time from total XP/profit. Remaining tours include the current trip; remaining time follows the visible server deadline.
- Possible rewards appear above vehicle selection as small rarity-colored icon tiles, preserving the server's labels, quantities, progress conditions and chances.
- Completion reward collection remains available.
- New UI strings have English equivalents.

Validation: reviewed against engine estimate() and singleForecast(): choices already contain each vehicle's XP/revenue/cost/bonus/totalProfit/trips. No new economy computation or server behavior changed. Reviewed selection/disclosure separation, active/queued/completed states and empty vehicle lists. Full TypeScript/Android build and device verification deferred to release.
