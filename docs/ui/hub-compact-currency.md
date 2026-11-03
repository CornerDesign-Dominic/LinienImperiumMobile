# Compact hub and currency amounts

- Earnings card is 308 dp in every cycle state (previously 350); its petrol timeline section is 124 dp instead of 166. Timeline marker space stays reserved when paused. The collect action remains 46 dp.
- The stock-depleted marker uses a frameless painted parcel. The next courier slot uses a painted antique padlock. Both are transparent 192 px offline PNGs, together under 90 KB; generation prompts are in `assets/art/hub/compact-icons.prompts.json`.
- Courier rows use three identical unpadded column hosts. Card padding no longer changes the locked tile's column allocation. All tiles share width, aspect ratio and minimum height. The redundant courier/count/toolbox heading is removed.
- Courier details no longer offer removal or selling; existing unassigned couriers retain their assignment action. Upgrade dialogs omit their secondary identity line and cost heading, preserve accessible needed/owned labels, and use paper with a subtle green tint for the after-value box.
- Numeric Imperium-Taler amounts have no T suffix in balances, buttons, costs and rates. Full currency names remain reward/description labels; premium currency and euro prices are unchanged. Legacy server text strips both historical M and T suffixes without mutating state or player names.
- Sales upgrade costs omit the owned/required heading and missing-material summary. Individual counts and enough/not-enough indications still explain the disabled action; real request errors remain.

Verification: TypeScript, existing interaction/economy suites and Android export. Currency presentation regression includes unchanged tonne units, premium names and full reward labels. The generated artwork was inspected, including alpha; no native device layout measurement is available here.
