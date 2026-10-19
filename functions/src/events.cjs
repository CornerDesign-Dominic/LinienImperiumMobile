'use strict';

// One central test route; shared schedules, scoring and rewards are added separately.
const EVENT_PROJECT_DISTANCE_KM = 240;
const EVENTS = [{
  id: 'large-project-own-overtime',
  title: 'Großprojekt mit eigenen Überstunden',
  description: 'Mit einer eigenen Flotte passiv liefern und normale Überstundenpunkte einsetzen.',
  rarity: 'epic', unlimited: true, distance: EVENT_PROJECT_DISTANCE_KM,
}];

function eventViews(state, fleetOptions = []) {
  return EVENTS.map(event => ({...event, status: 'available', run: 0,
    ...state.eventTests?.[event.id],
    fleetOptions: state.eventTests?.[event.id]?.status === 'running' && !state.eventTests[event.id].project ? fleetOptions : []}));
}

function currentEvent(state, eventId, expectedRun) {
  if (!EVENTS.some(event => event.id === eventId)) throw Error('Unbekanntes Event.');
  const previous = state.eventTests?.[eventId];
  const run = previous?.run || 0;
  if (!Number.isSafeInteger(expectedRun) || expectedRun !== run)
    throw Error('Der Eventstatus hat sich geändert. Bitte aktualisieren.');
  return previous;
}

function changeEvent(state, eventId, action, expectedRun, now) {
  const previous = currentEvent(state, eventId, expectedRun);
  const run = previous?.run || 0;
  if (action === 'start') {
    if (previous?.status === 'running') throw Error('Dieses Event läuft bereits.');
    state.eventTests ||= {};
    state.eventTests[eventId] = {status: 'running', run: run + 1, startedAt: now, endedAt: null};
    return 'Event gestartet.';
  }
  if (action !== 'end' || previous?.status !== 'running') throw Error('Dieses Event läuft nicht.');
  state.eventTests[eventId] = {...previous, status: 'ended', endedAt: now};
  return 'Event beendet. Du kannst es erneut starten.';
}

function assignEventFleet(state, eventId, expectedRun, template, fleetOptions, now) {
  const event = currentEvent(state, eventId, expectedRun);
  if (event?.status !== 'running') throw Error('Dieses Event läuft nicht.');
  if (event.project) throw Error('Für diesen Durchlauf ist bereits eine Flotte eingesetzt.');
  const option = fleetOptions.find(option => option.index === template);
  if (!option?.vehicles?.length) throw Error('Bitte zuerst mindestens eine Fahrzeugkarte in diese Flotte einsetzen.');
  event.project = {template, assignedAt: now, distance: EVENT_PROJECT_DISTANCE_KM,
    delivered: 0, km: 0, tonKm: 0, tours: 0,
    vehicles: JSON.parse(JSON.stringify(option.vehicles)).map(vehicle => ({...vehicle,
      completedTours: 0, nextAt: now + vehicle.cycleMs}))};
  return 'Flotte eingesetzt. Das Großprojekt läuft.';
}

function settleEvents(state, now) {
  for (const event of Object.values(state.eventTests || {})) {
    const project = event.project;
    if (event.status !== 'running' || !project) continue;
    for (const vehicle of project.vehicles) {
      // Arithmetic catch-up: no finite target, fake huge volume or per-tour loop.
      const completed = Math.floor(Math.max(0, now - project.assignedAt) / vehicle.cycleMs);
      vehicle.completedTours = Math.max(vehicle.completedTours, completed);
      vehicle.nextAt = project.assignedAt + (vehicle.completedTours + 1) * vehicle.cycleMs;
    }
    project.delivered = project.vehicles.reduce((sum, vehicle) => sum + vehicle.completedTours * vehicle.capacity, 0);
    project.km = project.vehicles.reduce((sum, vehicle) => sum + vehicle.completedTours * project.distance * 2, 0);
    project.tonKm = project.delivered * project.distance;
    project.tours = project.vehicles.reduce((sum, vehicle) => sum + vehicle.completedTours, 0);
  }
}

module.exports = {eventViews, changeEvent, assignEventFleet, settleEvents, EVENT_PROJECT_DISTANCE_KM};
