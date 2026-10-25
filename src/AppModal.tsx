import React,{useLayoutEffect,useRef,useSyncExternalStore} from 'react';
import {Modal,ModalProps} from 'react-native';

const open=new Set<object>(),listeners=new Set<()=>void>();
const subscribe=(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener);};};
const snapshot=()=>open.size;
const notify=()=>listeners.forEach(listener=>listener());
export function useOpenModalCount(){return useSyncExternalStore(subscribe,snapshot,snapshot);}
/** Allows informational notices to wait for every existing product modal. */
export function AppModal({trackActivity=true,...props}:ModalProps&{trackActivity?:boolean}){
 const token=useRef({});
 useLayoutEffect(()=>{
  if(!trackActivity||props.visible===false)return;
  const value=token.current;open.add(value);notify();
  return()=>{open.delete(value);notify();};
 },[trackActivity,props.visible]);
 return <Modal {...props}/>;
}
