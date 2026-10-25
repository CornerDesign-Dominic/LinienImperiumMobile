// The server freezes the purchased quantity at cycle start and distributes it
// linearly during workMs. No independent warehouse stock is simulated.
function hubCycle(h,cycle,now){
 if(!cycle||!h||!(cycle.durationMs>0)||!(cycle.workMs>0))return null;
 const elapsed=Math.max(0,Math.min(cycle.durationMs,now-(h.nextCycleAt-cycle.durationMs)));
 const full=h.cashboxCycles>=cycle.cashboxMax,hasGoods=cycle.quantity>0;
 return {elapsed,progress:elapsed/cycle.durationMs,minutes:Math.floor(elapsed/60000),
  full,hasGoods,remaining:full||!hasGoods?0:Math.max(0,1-elapsed/cycle.workMs),
  emptyAt:!full&&hasGoods?cycle.workMs/cycle.durationMs:null,
  idleMs:!full&&hasGoods?Math.max(0,cycle.durationMs-cycle.workMs):0,
  paused:full||!hasGoods,waiting:elapsed>=cycle.workMs};
}
module.exports={hubCycle};
