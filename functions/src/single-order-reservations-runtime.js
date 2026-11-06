// A picker lease is separate from the permanent, capacity-limited pinned offers.
const PICKER_HOLD_MS=30000;
const PICKER_EXPIRED='Die Haltezeit ist abgelaufen. Bitte wähle einen neuen Auftrag.';
function pickerOffer(order){
 return !!order&&order.status==='available'&&!order.saved&&!order.crafted&&!PROJECT_DEADLINES[order.kind]&&['national','international'].includes(order.category)&&order.kind!=='private';
}
function expirePickerReservations(now=Date.now()){
 game.orders=game.orders.filter(order=>{
  const hold=order.pickerReservation;if(!hold)return true;
  if(!pickerOffer(order)||order.pinned){delete order.pickerReservation;return true;}
  // Keep an expired, undisplaced lease until close: repeated opens/retries must not renew it.
  return !(hold.displaced&&now>=hold.expiresAt);
 });
}
function reserveOrderForPicker(orderId){
 expirePickerReservations();
 const order=game.orders.find(order=>order.id===orderId);
 if(!order)throw Error(PICKER_EXPIRED);
 if(!pickerOffer(order)||order.pinned)return null;
 if(order.pickerReservation)return {...order.pickerReservation};
 game.nextPickerReservation=(Number.isSafeInteger(game.nextPickerReservation)?game.nextPickerReservation:0)+1;
 const hold={token:'picker-'+game.nextPickerReservation+'-'+Date.now(),expiresAt:Date.now()+PICKER_HOLD_MS,displaced:false};
 order.pickerReservation=hold;
 return {...hold};
}
function releaseOrderPickerReservation(orderId,token){
 const order=game.orders.find(order=>order.id===orderId),hold=order?.pickerReservation;
 if(!hold||hold.token!==token)return true;
 delete order.pickerReservation;
 if(hold.displaced&&pickerOffer(order)&&!order.pinned)game.orders=game.orders.filter(entry=>entry!==order);
 return true;
}
const pickerOriginalReplenish=replenishOrders;
replenishOrders=()=>{
 expirePickerReservations();
 // Displaced offers are extra, short-lived offers, never replacements for the new market batch.
 const extras=game.orders.filter(order=>pickerOffer(order)&&!order.pinned&&order.pickerReservation?.displaced);
 game.orders=game.orders.filter(order=>!extras.includes(order));
 pickerOriginalReplenish();
 game.orders.push(...extras);
};
const pickerOriginalReplace=replaceAvailableOffers;
replaceAvailableOffers=categories=>{
 expirePickerReservations();
 const held=game.orders.filter(order=>pickerOffer(order)&&!order.pinned&&categories.includes(order.category)&&order.pickerReservation?.expiresAt>Date.now());
 for(const order of held)order.pickerReservation.displaced=true;
 game.orders=game.orders.filter(order=>!held.includes(order));
 pickerOriginalReplace(categories);
 game.orders.push(...held);
};
function assignPickerOrder(orderId,truckId,token){
 expirePickerReservations();
 const order=game.orders.find(order=>order.id===orderId);
 if(!order)throw Error(PICKER_EXPIRED);
 if(pickerOffer(order)&&!order.pinned&&token&&order.pickerReservation?.token!==token)throw Error(PICKER_EXPIRED);
 const result=assignOrder(orderId,truckId);
 if(order.status==='active')delete order.pickerReservation;
 return result;
}
