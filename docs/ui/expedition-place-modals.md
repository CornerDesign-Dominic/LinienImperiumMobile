# Expedition location modals

Every agreed location now opens its own close-up portrait rather than a text-only sheet. There are 40 unique portraits: seven stops and the final trading location in each of the five regions. They preserve the architecture, landscape and mature painterly style of the existing regional panoramas.

The modal shows the image, region, real location name, current state and appropriate action. Exploration shows invested points; a running bonus delivery shows remaining time and its progress. Rewards use labeled icon chips. Completed locations show received rewards without redundant completed progress bars. Duration and the existing gameplay explanation are collapsed under **Details**. The 44-point close control stays outside the scrollable body, including on small displays. Images use measured numeric dimensions to avoid Android's intrinsic image size overriding their frame.

The existing commands, vehicle chooser, exploration costs, bonus deliveries, repeat expeditions, drop chances and customer unlocks remain in place. A normal bonus delivery awards one expedition-capacity point when collected. The capacity module is awarded once when the final delivery is collected; pending rewards do not promise another module to legacy saves that already received it. No server mechanics changed. Place stories remain a later phase.

## Assets

- [All close-up images](../../assets/art/places)
- [Exact prompts and panorama references](expedition-place-prompts.json)
- 1536 × 1024 JPEG, quality 84, 21.11 MB total for 40 portraits. Originals were generated with OpenAI ImageGen; only JPEG encoding was applied afterward, without cropping or resizing.
- [Lindenweiler modal](previews/place-lindenweiler.png), [Felsenwinde modal](previews/place-cliff-hoist.png), [Handelsfeste modal](previews/place-ice-fortress.png)

## Validation

- TypeScript: `npm run typecheck` passed.
- Regression suite: `npm test`, 143 passed, zero failed.
- Added tests cover single-point exploration and locked access, delivery launch/collection, final-customer commands and the once-only module, all 40 real JPEG assets, and explicit Android image dimensions plus the fixed close control.
- Rendered the actual React Native components through React Native Web with fixtures from the real game engine. Opened all 40 locations at 320 × 568, 360 × 740, 390 × 844 and 430 × 932. Checked unique loaded images, portrait bounds, modal bounds, names, expandable details, fixed close control, map signs and region navigation.
- Interactive checks cover exploration revealing the next stop, the existing vehicle chooser and mission payload, running/ready/collected delivery states, final collection, drop-chance navigation, legacy module rewards, empty expedition points and English labels. No browser JavaScript errors.
- Android Expo export completed. The Hermes bundle is 2,358,614 bytes and SHA-256 checks confirm all 40 portrait files are included among the 112 exported assets.
- Native-device and emulator visual checks were not available; browser rendering and Android export do not replace those checks.

Publication is performed through the existing Android preview update workflow.
