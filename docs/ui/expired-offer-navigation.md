# Refreshing an offer while viewing its details

Prepared, not published.

Cause: automatic or manual refresh removes unpinned available offers. The UI retained orderDetail and the deleted order id. The fallback also nested a Pressable inside Empty's Text, causing the overlap visible on Android.

Change:
- When the current single-contract detail no longer exists in the latest server state, return to the single-contract overview, clear its id, reset scroll and remove the obsolete overview return entry from navigation history.
- Existing held offers, active orders and queued orders retain their detail page as long as their id remains in the server state.
- The fallback uses a Card with separate Text and button siblings.

Verification: reviewed navigation-effect conditions against current server orders, null/loading data guard and back-stack cleanup. Source review only; full build and physical device test pending release.
