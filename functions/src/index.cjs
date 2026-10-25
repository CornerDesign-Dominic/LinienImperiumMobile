'use strict';
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { gzipSync, gunzipSync } = require('node:zlib');
const { execute } = require('./engine.cjs');
const {readEventContext,refreshRanking}=require('./event-store.cjs');
initializeApp();
const db=getFirestore();
exports.game = onCall({region:'europe-west3', serviceAccount:'mobile-game-runtime@linienimperium.iam.gserviceaccount.com', memory:'512MiB', timeoutSeconds:60, maxInstances:3, cors:true}, async request=>{
  if(!request.auth)throw new HttpsError('unauthenticated','Bitte erneut anmelden.');
  const {action='sync',payload={},requestId}=request.data||{};
  if(typeof action!=='string'||action.length>40||typeof payload!=='object'||payload===null||Array.isArray(payload)||JSON.stringify(payload).length>2048)throw new HttpsError('invalid-argument','Ungültige Aktion.');
  if(action!=='sync'&&(typeof requestId!=='string'||!/^[-a-zA-Z0-9]{16,80}$/.test(requestId)))throw new HttpsError('invalid-argument','Anfragekennung fehlt.');
  const gameRef=db.doc(`players/${request.auth.uid}`);
  const receipt=action==='sync'?null:gameRef.collection('commands').doc(requestId);
  try {
    return await db.runTransaction(async tx=>{
      const saved=await tx.get(gameRef);
      const previous=receipt?await tx.get(receipt):null;
      const record=saved.exists?saved.data():{};
      const state=record.snapshot?JSON.parse(gunzipSync(record.snapshot).toString('utf8')):null;
      const now=Date.now();
      const requests=(record.requests||[]).filter(t=>now-t<60000);
      if(requests.length>=100)throw new HttpsError('resource-exhausted','Bitte einen Moment warten.');
      const eventContext=await readEventContext(tx,db,request.auth.uid,previous?.exists?'sync':action,now);
      let result;
      try {result=execute(state,previous?.exists?'sync':action,previous?.exists?{}:payload,now,Math.random,eventContext);}catch(error){throw new HttpsError('invalid-argument',error.message);}
      // A retried command is not applied twice, but its sync arrivals must still persist.
      if(previous?.exists){for(const key of ['claimSummary','levelUps','hubCrateParts','giftFind','expeditionFind','customerBatchApplied','expansionAllocationApplied'])if(previous.data()[key])result.view[key]=previous.data()[key];if(previous.data().action==='transportBatch')result.view.transportBatchApplied=true;}
      if(previous?.exists&&JSON.stringify(result.state)===JSON.stringify(state)){refreshRanking(result.view,eventContext,request.auth.uid,result.state);return result.view;}
      eventContext.persist(result.state);
      refreshRanking(result.view,eventContext,request.auth.uid,result.state);
      const snapshot=gzipSync(JSON.stringify(result.state));
      if(snapshot.length>900000)throw new HttpsError('resource-exhausted','Spielstand zu groß. Bitte Support kontaktieren.');
      tx.set(gameRef,{snapshot,revision:(record.revision||0)+1,requests:[...requests,now],updatedAt:Timestamp.fromMillis(now)});
      if(receipt&&!previous?.exists)tx.set(receipt,{action,...(result.view.expansionAllocationApplied?{expansionAllocationApplied:true}:{}),...(result.view.customerBatchApplied?{customerBatchApplied:true}:{}),...(result.view.levelUps?{levelUps:result.view.levelUps}:{}),...(result.view.claimSummary?{claimSummary:result.view.claimSummary}:{}),...(result.view.hubCrateParts?{hubCrateParts:result.view.hubCrateParts}:{}),...(result.view.giftFind?{giftFind:result.view.giftFind}:{}),...(result.view.expeditionFind?{expeditionFind:result.view.expeditionFind}:{}),createdAt:Timestamp.fromMillis(now),expireAt:Timestamp.fromMillis(now+7*86400000)});
      return result.view;
    });
  } catch(error){if(error instanceof HttpsError)throw error;console.error('Game transaction failed',error);throw new HttpsError('internal','Spielstand konnte nicht geladen werden. Bitte erneut versuchen.');}
});
