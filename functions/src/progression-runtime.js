// Mobile progression. Keep the vendored web engine and its regression baseline unchanged.
const legacyLevelForXp = levelForXp;
levelForXp = xp => {
  const level = Math.floor((1 + Math.sqrt(1 + 8 * Math.max(0, xp) / 100)) / 2);
  const start = 50 * level * (level - 1);
  return {level, within: xp - start, need: 100 * level};
};
function migrateLinearProgression() {
  if (game.linearProgressionVersion === 1) return;
  const previous = legacyLevelForXp(game.xp, game);
  const fraction = previous.need > 0 ? clamp(previous.within / previous.need, 0, 1 - Number.EPSILON) : 0;
  game.xp = 50 * previous.level * (previous.level - 1) + Math.min(100 * previous.level - .01, round2(fraction * 100 * previous.level));
  delete game.levelFloor;
  delete game.levelFloorXp;
  game.linearProgressionVersion = 1;
}
function hubUnlocked() { return !!hub() || levelForXp(game.xp).level >= 5; }
hubCapacity = () => Math.max(cityTruckCount(), Math.floor(levelForXp(game.xp).level / 5));
const legacyBuyHub = buyHub;
buyHub = () => {
  if (!hubUnlocked()) { showToast('Stadthub ab Level 5 verfügbar.'); return false; }
  return legacyBuyHub();
};
function nextHubVehicleLevel() {
  return Math.max(5, (Math.max(cityTruckCount(), Math.floor(levelForXp(game.xp).level / 5)) + 1) * 5);
}
