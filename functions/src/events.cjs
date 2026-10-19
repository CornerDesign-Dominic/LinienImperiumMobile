'use strict';

// Event catalogue and manual test lifecycle. Transport gameplay is added separately.
const EVENTS = [{
  id: 'large-project-own-overtime',
  title: 'Großprojekt mit eigenen Überstunden',
  description: 'Mit einer eigenen Flotte passiv liefern und normale Überstundenpunkte einsetzen.',
}];

function eventViews(state) {
  return EVENTS.map(event => ({...event, status: 'available', run: 0,
    ...state.eventTests?.[event.id]}));
}

function changeEvent(state, eventId, action, expectedRun, now) {
  if (!EVENTS.some(event => event.id === eventId)) throw Error('Unbekanntes Event.');
  const previous = state.eventTests?.[eventId];
  const run = previous?.run || 0;
  if (!Number.isSafeInteger(expectedRun) || expectedRun !== run)
    throw Error('Der Eventstatus hat sich geändert. Bitte aktualisieren.');
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

module.exports = {eventViews, changeEvent};
