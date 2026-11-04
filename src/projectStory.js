const identities=require('../functions/src/customer-identities.json');
const regions=['crownlands','plains','saffron','jade','north'];
/** Story is presentation only; completion requires both a server status and real delivered cargo. */
function projectStory(order){
 if(!order||!['special','referral'].includes(order.kind))return null;
 const customer=typeof order.customer==='string'?order.customer:order.customer?.id;
 let index=identities.findIndex(identity=>identity.id===customer);
 // A supplied but unknown identity must not be silently assigned a different customer's story.
 if(index<0){if(customer)return null;index=order.projectRegion;if(!Number.isInteger(index)||index<0||index>=regions.length)return null;}
 const volume=Number(order.volume),delivered=Number(order.delivered);
 const valid=Number.isFinite(volume)&&volume>0&&Number.isFinite(delivered);
 const progress=valid?Math.min(1,Math.max(0,delivered/volume)):0;
 const receipt=order.status==='completed'&&valid&&delivered>=volume;
 const stage=receipt?5:Math.min(4,Math.floor(progress*5));
 return {region:regions[index],stage,receipt,progress,customer:identities[index].customer};
}
module.exports={projectStory};
