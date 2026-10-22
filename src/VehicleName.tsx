import React from 'react';
import {Text,TextProps} from 'react-native';
import {t} from './i18n';
import {useLanguage} from './Language';
const breaks:Record<string,string>={Lastschlitten:'Last\u00adschlitten',Silberhirsch:'Silber\u00adhirsch',Schneeleoparden:'Schnee\u00adleoparden',Kundschaftergespann:'Kundschafter\u00adgespann',Ochsenfuhrwerk:'Ochsen\u00adfuhrwerk',Lastengespann:'Lasten\u00adgespann',Maultiergespann:'Maultier\u00adgespann'};
export function VehicleName({name,...props}:TextProps&{name:string}){
 useLanguage();
 const translated=t(name),label=translated.replace(/Lastschlitten|Silberhirsch|Schneeleoparden|Kundschaftergespann|Ochsenfuhrwerk|Lastengespann|Maultiergespann/g,word=>breaks[word]).replace(/-/g,'-\u200b');
 return <Text {...props} accessibilityLabel={translated} android_hyphenationFrequency="normal" textBreakStrategy="highQuality">{label}</Text>;
}
