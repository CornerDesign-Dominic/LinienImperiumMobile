# Inventory illustrations

27 transparent 512 × 512 PNG assets, created with the built-in image generation tool from the user-approved concept selections. Exact production prompts: `prompts.json`. All files are bundled locally through `src/itemAssets.ts`; no image service is used by the running game.

The six original seal emblems are vector sources with 192 × 192 PNG exports under `seals/`. Optional renderer: `scripts/build-item-seals.cjs` (development-only sharp, not an app dependency).

Rarity backgrounds, black borders, Roman tiers and quantities are presentation layers; order seal emblems are overlaid on the blank wax faces. See `docs/ui/item-art.md` for selections, mapping, rollout and validation.
