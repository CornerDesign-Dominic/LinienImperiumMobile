import React,{useEffect} from 'react';
import {OrderVehiclePicker} from './OrderVehiclePicker';
import {n} from './ui';
import {t} from './i18n';

// Navigation controller only: the existing transport picker owns its unchanged UI.
export function SingleOrderPicker({data,id,busy,clock,onClose,onCommand,onStarted,modalBlocked=false}:any){
 const order=data.state.orders.find((entry:any)=>entry.id===id&&!entry.isProject&&(entry.status==='available'||entry.status==='queued'));
 useEffect(()=>{if(!order)onClose();},[order,onClose]);
 if(!order)return null;
 return <OrderVehiclePicker data={data} choices={order.vehicleChoices||order.choices.map((choice:any)=>({...choice,free:true}))} summary={`${t(order.cargo)} · ${n(order.volume,1)} t · ${n(order.distance)} km`} busy={busy} clock={clock} modalBlocked={modalBlocked} onClose={onClose} onStart={async(truck:string)=>{
  const next=await onCommand(order.kind==='private'?'assignPrivate':order.crafted?'assignCrafted':'assign',{order:order.id,truck});
  const started=next?.state.orders.some((entry:any)=>entry.id===order.id&&entry.status==='active');
  if(started)onStarted?.();
  return !!started;
 }}/>;
}
