'use strict';
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { gzipSync, gunzipSync } = require('node:zlib');
const { execute } = require('./engine.cjs');
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
      if(previous?.exists){const view=execute(state,'sync').view;if(previous.data().action==='transportBatch')view.transportBatchApplied=true;const find=previous.data().expeditionFind;if(find)view.expeditionFind=find;return view;}
      const now=Date.now();
      const requests=(record.requests||[]).filter(t=>now-t<60000);
      if(requests.length>=100)throw new HttpsError('resource-exhausted','Bitte einen Moment warten.');
      let result;
      try {result=execute(state,action,payload,now);}catch(error){throw new HttpsError('invalid-argument',error.message);}
      const snapshot=gzipSync(JSON.stringify(result.state));
      if(snapshot.length>900000)throw new HttpsError('resource-exhausted','Spielstand zu groß. Bitte Support kontaktieren.');
      tx.set(gameRef,{snapshot,revision:(record.revision||0)+1,requests:[...requests,now],updatedAt:Timestamp.fromMillis(now)});
      if(receipt)tx.set(receipt,{action,...(result.view.expeditionFind?{expeditionFind:result.view.expeditionFind}:{}),createdAt:Timestamp.fromMillis(now),expireAt:Timestamp.fromMillis(now+7*86400000)});
      return result.view;
    });
  } catch(error){if(error instanceof HttpsError)throw error;console.error('Game transaction failed',error);throw new HttpsError('internal','Spielstand konnte nicht geladen werden. Bitte erneut versuchen.');}
});
