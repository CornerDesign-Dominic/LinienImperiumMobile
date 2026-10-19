import {Platform} from 'react-native';

// Text tones stay darker than material accents for legible values on parchment.
export {default as C} from './palette.json';
import C from './palette.json';
export const displayFont=Platform.select({ios:'Georgia',android:'serif',default:'serif'});
export const regionInks=[C.accent,'#82632F','#476570','#78604D','#6A5B75'];
