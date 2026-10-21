// Bundled region paintings are 768 x 512. Position their landmarks inside a
// cover-sized frame, rather than inheriting Android Image's intrinsic size.
const focusY=[0.60,0.72,0.58,0.62,0.70];
function regionImageFrame(width,height,region){
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)return null;
 const imageWidth=Math.max(width,height*1.5),imageHeight=imageWidth/1.5;
 return {width:imageWidth,height:imageHeight,left:(width-imageWidth)/2,top:(height-imageHeight)*(focusY[region]??0.5)};
}
module.exports={regionImageFrame};
