# Grouped inventory

The inventory remains one scrolling page, with small section headings in this order:
Auffüller, Ausbau, Herstellung, Materialien, Kartensplitter, Aufträge.
Only owned stock (amount > 0) is displayed, as before. Empty sections are omitted.

`inventorySections` groups the existing stock objects without changing their IDs,
amounts, detail data or actions. Capacity modules, company items, courier tools and
supplier contacts belong to Ausbau; pickup hints to Herstellung. Gears and shards
sort from common through legendary. Material jobs precede transport-card jobs,
each by numeric tier, then other queued contracts and projects. Future stock types
remain visible in Weitere Vorräte.

Each section retains the same four equal-width columns and placeholder cells for
incomplete rows. Item frames, centered quantities and the centered detail/refill
modal are unchanged. This does not restore company departments.

Validation: TypeScript; inventory/catalog tests including complete grouping,
rarity/tier sorting, future stock retention and unchanged action object identity;
Android export. No native device layout review was available.
