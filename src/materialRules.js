// Only ordinary opaque UI surfaces receive texture. Status washes, illustration
// backplates, rarity colors and overlays deliberately remain unchanged.
const C=require('./palette.json');
function materialForColor(color){
 if([C.bg,C.panel,C.raised].includes(color))return 'paper';
 if([C.accent,C.ink,C.inkRaised].includes(color))return 'petrol';
 return null;
}
function materialOpacity(color,quiet=false){
 const strength=color===C.bg ? .24 : color===C.panel ? .72 : color===C.raised ? .55 : .88;
 return quiet?strength*.5:strength;
}
module.exports={materialForColor,materialOpacity};
