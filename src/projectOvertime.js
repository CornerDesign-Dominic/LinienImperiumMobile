function overtimeQuote(order, stock, amount, now) {
 const remaining=Math.max(0,Number(order.volume)-Number(order.delivered));
 const valid=order.status==='active'&&Number.isFinite(order.distance)&&order.distance>0&&remaining>0&&now<order.project?.deadlineAt;
 const available=Math.max(0,Math.floor(Number(stock)||0));
 const need=order.overtimeForDeadline;
 const forecast=valid&&Number.isFinite(order.eta)&&order.eta>0&&Number.isSafeInteger(need)&&need>=0;
 const required=forecast?need:null;
 const requested=amount==='max'?(required||0):amount;
 const points=valid?Math.min(available,Math.ceil(remaining*order.distance/1000),requested):0;
 return {points,tons:valid?Math.min(remaining,points*1000/order.distance):0,after:available-points,required,deadlineEnabled:forecast&&need>0&&need<=available,canConfirm:points>0&&(amount!=='max'||(forecast&&need>0&&need<=available))};
}
module.exports={overtimeQuote};
