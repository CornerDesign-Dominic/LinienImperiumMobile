# Premium shop foundation

The Großhändler has Geschenke, Skins and Aufladen tabs. The working name is **Premium-Münzen** and its small star is temporary until the currency artwork/name is selected. Existing region gifts retain their existing ordinary-coin price and flow. The old nonfunctional price-ideas list is removed.

The price anchor is 250 premium currency = EUR 2.50 and one paid cosmetic = 250. Preview packs are 250/500/1,000/2,500/5,000 for EUR 2.50/5/10/25/50 without assumed discounts. Every price is explicitly a preview and every real-money button is disabled. There is no simulated payment or premium-grant command.

## Server and cosmetics

`functions/src/premium-shop.cjs` owns the catalogue, integral nonnegative balance, owned skin entitlements and selected cosmetic. `skinBuy` resolves only the server catalogue, ignores caller-supplied prices and charges an unowned cosmetic once. `skinEquip` accepts owned, currently available catalogue skins only. Existing callable transaction/command receipts serialize and deduplicate these actions. Premium balance and skin entitlements survive the test-game reset. No game statistic changes from these commands.

Only the existing free Lastwombat artwork is currently available. It starts owned and selected. Paid skins must first receive approved real artwork and a renderer entry; the shop does not sell a placeholder or recolour sold as a new skin. The standard illustration is currently the only renderer, matching all Boten. The prepared price is shown as 250, with an honest "Weitere Skins folgen" message.

## Required before real purchases

The repository has no store billing dependency, configured products, server receipt verification or purchase-delivery ledger. Complete these before activating payments:

1. Choose the billing integration, register consumable products in the target stores and configure test purchase accounts/products.
2. Add the native billing integration and create a new native build; this functionality cannot be introduced solely by the current OTA runtime.
3. Implement authenticated, server-verified receipts/tokens, binding them to the authenticated player and authoritative store product catalogue. Use a global unique purchase-token/transaction ledger, an atomic wallet credit and acknowledgement/consumption retries; never trust a client amount or a local purchase-success callback as proof.
4. Display live localized prices from the store, not these planning values. Handle cancelled, pending and refunded purchases and restore/recovery appropriately. Link a recoverable player account before taking real payment.
5. Test sandbox successful/pending/cancelled/duplicate/refund delivery, then enable actual payment buttons.

No billing SDK, native build setting, paid provider or store configuration is changed by this foundation. It remains unpublished until separately requested.

Validation: premium migration, pack values, unknown grant/skin rejection, server-price deductions and duplicate ownership, insufficient balance, no statistic changes, entitlement reload/reset preservation; full suite, TypeScript and Android export.
