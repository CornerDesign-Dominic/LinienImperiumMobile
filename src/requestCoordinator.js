'use strict';
/** One connection, bounded player-action queue, and at most one waiting sync per account. */
function createRequestCoordinator(execute,onChange=(_state)=>{},maxActions=24){
 let active=null,actions=[],syncs=[];
 const describe=()=>({pending:!!active||actions.length>0||syncs.length>0,
  foreground:[active,...actions,...syncs].filter(task=>task&&!task.background).length,
  foregroundSync:[active,...syncs].some(task=>task?.action==='sync'&&!task.background)});
 const notify=()=>onChange(describe());
 const drain=()=>{
  if(active)return;
  const task=actions.shift()||syncs.shift();if(!task){notify();return;}
  active=task;notify();
  const finish=(ok,result)=>{active=null;if(ok)task.resolve(result);else task.reject(result);drain();};
  Promise.resolve().then(()=>execute(task)).then(result=>finish(true,result),error=>finish(false,error));
 };
 function enqueue(action='sync',payload={},options={}){
  const scope=options.scope||'',background=action==='sync'&&!!options.background;
  const key=JSON.stringify([scope,action,payload]);
  const existing=[active,...(action==='sync'?syncs:actions)].find(task=>task&&task.key===key);
  if(existing){if(!background&&existing.background){existing.background=false;notify();}return existing.promise;}
  if(action!=='sync'&&actions.length>=maxActions){const error=Error('Zu viele ausstehende Aktionen. Bitte kurz warten.');error.code='client/queue-full';return Promise.reject(error);}
  let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});
  const task={action,payload,scope,background,key,promise,resolve,reject};
  if(action==='sync'){
   // Replace obsolete waiting syncs after an account switch; their callers safely resolve empty.
   for(const stale of syncs.filter(item=>item.scope!==scope))stale.resolve(undefined);
   syncs=syncs.filter(item=>item.scope===scope);syncs.push(task);
  }else actions.push(task);
  notify();drain();return promise;
 }
 return {enqueue,snapshot:describe};
}
module.exports={createRequestCoordinator};
