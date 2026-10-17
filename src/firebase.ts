import { initializeApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence, signInAnonymously, onAuthStateChanged, EmailAuthProvider, linkWithCredential, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import * as FirebaseAuth from 'firebase/auth';
import type { Persistence } from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
const app=initializeApp({
  apiKey:'AIzaSyBfeWgspE82Mnu5D0S6m65-vwRcuWPtPJ0',authDomain:'linienimperium.firebaseapp.com',projectId:'linienimperium',
  storageBucket:'linienimperium.firebasestorage.app',messagingSenderId:'350521926986',appId:'1:350521926986:web:3c92a9bb3795a26ae68db3'
});
// Firebase exposes this function only in its React Native runtime export.
const nativePersistence=(FirebaseAuth as typeof FirebaseAuth & {getReactNativePersistence(storage:typeof AsyncStorage):Persistence}).getReactNativePersistence;
export const auth=initializeAuth(app,{persistence:Platform.OS==='web'?browserLocalPersistence:nativePersistence(AsyncStorage)});
const callable=httpsCallable(getFunctions(app,'europe-west3'),'game',{timeout:60000});
let ready:Promise<void>|null=null;
export function ensureAuth(){
  if(!ready)ready=new Promise<void>((resolve,reject)=>{
    const stop=onAuthStateChanged(auth,user=>{stop();if(user)resolve();else signInAnonymously(auth).then(()=>resolve(),reject);},reject);
  }).catch(error=>{ready=null;throw error;});
  return ready;
}
export async function command(action='sync',payload:Record<string,unknown>={},requestId=Crypto.randomUUID()){
  await ensureAuth();
  // Keep the same ID on automatic retries: server receipts prevent double spending.
  for(let attempt=0;;attempt++){
    try {const response=await callable({action,payload,requestId});return response.data as any;}
    catch(error:any){if(attempt===0&&['functions/unavailable','functions/deadline-exceeded'].includes(error.code))continue;throw error;}
  }
}
export async function saveAccount(email:string,password:string){
  await ensureAuth();if(!auth.currentUser)throw Error('Kein Konto geladen.');
  await linkWithCredential(auth.currentUser,EmailAuthProvider.credential(email.trim(),password));
}
export async function login(email:string,password:string){
  await signInWithEmailAndPassword(auth,email.trim(),password);ready=Promise.resolve();
}
export async function logout(){await signOut(auth);ready=null;}
