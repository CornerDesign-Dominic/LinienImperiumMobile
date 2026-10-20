# Garage vehicle picker

Prepared on batch/mobile-adjustments; not published.

- Keep a full-width compact list entry per owned card that is not already parked in the garage.
- Filters: All plus every catalog rarity, including Legendary. Reset to All whenever an empty garage slot is opened.
- Show name, capacity, card level, total speed rank, loaded speed and empty speed from cardVehicles. Rarity colors identify each entry.
- Long names and speed labels may wrap on narrow screens. The list scrolls; filters and Close remain above it.
- Selecting an entry still uses garageAdd; the modal closes only after the returned state confirms the card was added.
- Fleet assignments remain independent of garage assignments.
- German and English labels supplied, including the filtered empty state.

Verification: reviewed source, stat field usage against VehicleCards, ownership/existing-garage filtering, reset behavior, busy state and unchanged add command. No device test or full build run for this UI-only preparation.

Test at release: open an empty slot; switch each rarity and All; check an empty rarity; compare upgraded vehicle stats with its card detail; add a card and confirm it is no longer offered; check long names and scrolling on a small phone in German and English.
