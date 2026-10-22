// Pure geometry/state used by the native map and regression tests.
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
function visibleJourneyPlaces(discovered){
 const count=Number.isFinite(discovered)?clamp(Math.floor(discovered),0,7):0;
 return Array.from({length:Math.min(8,count+1)},(_,index)=>index);
}
function journeyGeometry(width,height,places,discovered){
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)return null;
 // Portrait phones show roughly 4–5 screen widths; wider screens need less panning.
 // Limit vertical crop so landmarks survive tablet/short-screen layouts as well.
 const worldWidth=Math.max(width,height*3,Math.min(width*4.6,height*3.6)),imageHeight=worldWidth/3,imageTop=height-imageHeight;
 const anchors=places.map(p=>({x:p.x*worldWidth,y:imageTop+p.y*imageHeight}));
 const visible=visibleJourneyPlaces(discovered),last=visible[visible.length-1],next=anchors[last+1];
 // The opaque mask starts safely before the next landmark, including its entire footprint.
 const fogStart=next?(anchors[last].x+next.x)/2:worldWidth;
 const contentWidth=Math.min(worldWidth,Math.max(width,fogStart+width*.38));
 return {worldWidth,imageHeight,imageTop,anchors,visible,fogStart,contentWidth};
}
function journeyOffset(geometry,width,index,saved){
 const max=Math.max(0,geometry.contentWidth-width);
 if(typeof saved==='number'&&Number.isFinite(saved))return clamp(clamp(saved,0,1)*geometry.worldWidth,0,max);
 const target=geometry.anchors[clamp(index,0,geometry.visible.length-1)].x;
 return clamp(target-width*.48,0,max);
}
function journeyFocus(discovered,deliveries,finalClaimed){
 const visible=visibleJourneyPlaces(discovered),last=visible[visible.length-1];
 const pending=(deliveries||[]).findIndex((done,i)=>i<discovered&&!done);
 return pending>=0?pending:discovered<7?last:7;
}
function adjacentJourneyRegion(maps,region,direction){
 const index=region+direction;
 return index>=0&&index<maps.length&&maps[index]?.open?index:null;
}
module.exports={visibleJourneyPlaces,journeyGeometry,journeyOffset,journeyFocus,adjacentJourneyRegion};
