import React,{useEffect,useRef,useState} from 'react';
import {OrderVehiclePicker} from './OrderVehiclePicker';
import {n} from './ui';
import {t} from './i18n';

const expiredMessage='Die Haltezeit ist abgelaufen. Bitte wähle einen neuen Auftrag.';
type Reservation={expiresAt:number;token:string};
// A rapid close/reopen waits for the previous in-flight hold to be released.
const pendingReleases=new Map<string,Promise<void>>();
// The server owns the fixed reservation deadline; renders and syncs never renew it.
export function SingleOrderPicker({data,id,busy,clock,onClose,onCommand,onStarted,modalBlocked=false}:any){
 const current=data.state.orders.find((entry:any)=>entry.id===id&&!entry.isProject&&(entry.status==='available'||entry.status==='queued'));
 const initial=useRef(current),callbacks=useRef({onCommand,onClose,onStarted});callbacks.current={onCommand,onClose,onStarted};
 const temporary=!!initial.current&&initial.current.status==='available'&&!initial.current.pinned&&!initial.current.saved&&!initial.current.crafted&&initial.current.kind!=='private';
 const request=useRef<Promise<Reservation|null>|null>(null),reservation=useRef<Reservation|null>(null),closed=useRef(false),[hold,setHold]=useState<Reservation|null>(null),[preparing,setPreparing]=useState(temporary),[failure,setFailure]=useState('');
 const release=()=>{
  const held=reservation.current,pending=request.current;if(!held&&!pending)return;
  reservation.current=null;request.current=null;
  const completion=Promise.resolve(held||pending).then(async lease=>{if(lease)await callbacks.current.onCommand('releaseOrderReservation',{order:id,token:lease.token});}).catch(()=>{});
  pendingReleases.set(id,completion);void completion.finally(()=>{if(pendingReleases.get(id)===completion)pendingReleases.delete(id);});
 };
 const close=()=>{if(closed.current)return;closed.current=true;release();callbacks.current.onClose();};
 useEffect(()=>{
  let alive=true;
  if(temporary){
   const previousRelease=pendingReleases.get(id);
   const pending=(async()=>{
    if(previousRelease)await previousRelease;
    if(!alive||closed.current)return null;
    const next=await callbacks.current.onCommand('reserveOrder',{order:id});
    if(next?.state?.orders.find((entry:any)=>entry.id===id)?.pinned)return null;
    const held=next?.pickerReservation||next?.state?.orders.find((entry:any)=>entry.id===id)?.pickerReservation;
    if(!held?.token||!Number.isFinite(held.expiresAt))throw Error(expiredMessage);
    return held;
   })();request.current=pending;
   void pending.then(held=>{if(alive&&!closed.current&&held){reservation.current=held;setHold(held);}}).catch((error:any)=>{if(alive&&!closed.current)setFailure(error?.message||expiredMessage);}).finally(()=>{if(alive)setPreparing(false);});
  }
  return()=>{alive=false;release();};
 },[id]);
 useEffect(()=>{
  if(current)return;
  const existing=data.state.orders.find((entry:any)=>entry.id===id);
  if(existing&&(existing.status==='active'||existing.status==='completed'))close();
  else if(initial.current)setFailure(expiredMessage);
  else close();
 },[current,data.state.orders,id]);
 const order=current||initial.current;
 if(!order)return null;
 const seconds=hold?Math.max(0,Math.ceil((hold.expiresAt-clock)/1000)):null;
 const holdRequired=temporary&&!current?.pinned,expired=seconds===0&&!!current?.pickerReservation?.displaced;
 const errorMessage=expired?expiredMessage:failure;
 return <OrderVehiclePicker data={data} choices={order.vehicleChoices||order.choices.map((choice:any)=>({...choice,free:true}))} summary={`${t(order.cargo)} · ${n(order.volume,1)} t · ${n(order.distance)} km`} busy={busy} clock={clock} modalBlocked={modalBlocked} onClose={close} headerStatus={holdRequired?(preparing?t('Haltezeit wird vorbereitet …'):seconds!==null?t(`Haltezeit: ${seconds} sek.`):undefined):undefined} startDisabled={preparing||!current||(holdRequired&&!hold)||errorMessage===expiredMessage} errorMessage={errorMessage} onStart={async(truck:string)=>{
  if(preparing||!current||(holdRequired&&!hold)||errorMessage===expiredMessage)return false;
  try{
   const next=await callbacks.current.onCommand(order.kind==='private'?'assignPrivate':order.crafted?'assignCrafted':'assign',{order:order.id,truck,...(reservation.current?{reservationToken:reservation.current.token}:{})});
   const started=next?.state.orders.some((entry:any)=>entry.id===order.id&&entry.status==='active');
   if(started){reservation.current=null;request.current=null;callbacks.current.onStarted?.();}
   else if(temporary)setFailure(next?.message||expiredMessage);
   return !!started;
  }catch(error:any){setFailure(error?.message||'Auftrag konnte nicht gestartet werden. Bitte Auswahl prüfen und erneut versuchen.');return false;}
 }}/>;
}
