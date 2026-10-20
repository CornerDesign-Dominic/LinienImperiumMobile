'use strict';

// One central test route; shared schedules, scoring and rewards are added separately.
const EVENT_PROJECT_DISTANCE_KM = 240;
const EVENTS = [{
  id: 'large-project-own-overtime',
  title: 'Großprojekt mit eigenen Überstunden',
  description: 'Mit einer eigenen Flotte passiv liefern und normale Überstundenpunkte einsetzen.',
  rarity: 'legendary', unlimited: true, distance: EVENT_PROJECT_DISTANCE_KM,
}];

function eventViews(state, fleetOptions = []) {
  return EVENTS.map(event => {
    const saved=state.eventTests?.[event.id];
    return {...event,status:'available',run:0,...saved,rarity:event.rarity,
      project:saved?.project?{...saved.project,vehicles:saved.project.vehicles.filter(v=>v.cardId).map(v=>{
        const desired=fleetOptions.find(option=>option.index===saved.project.template)?.vehicles?.find(next=>next.slot===v.slot);
        return {...v,pendingCardId:desired?.cardId||null,pendingModel:desired?.model||null};
      })}:undefined,
      fleetOptions:saved?.status==='running'&&!saved.project?fleetOptions:[]};
  });
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

module.exports = {eventViews, changeEvent, assignEventFleet, EVENT_PROJECT_DISTANCE_KM};
