function giftRevealSteps(count,start,winner){
 if(!Number.isInteger(count)||count<1||!Number.isInteger(start)||start<0||start>=count||!Number.isInteger(winner)||winner<0||winner>=count)return [];
 const length=count*2+(winner-start+count)%count;
 return Array.from({length},(_,step)=>({
  index:(start+step+1)%count,
  delay:Math.round(65+280*Math.pow((step+1)/length,2))
 }));
}
exports.giftRevealSteps=giftRevealSteps;
