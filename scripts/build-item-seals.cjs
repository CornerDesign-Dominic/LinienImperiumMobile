// Original seal emblems rendered from vector sources; no native SVG dependency.
const fs=require('node:fs'),path=require('node:path');
const sharp=require(process.env.ICON_RENDERER_NODE_MODULES?path.join(process.env.ICON_RENDERER_NODE_MODULES,'sharp'):'sharp');
const drawings={
 private:'<path d="M5 15 16 5l11 10M8 13v15h6v-8h5v8h5V13"/>',
 customer:'<path d="m5 10 11-5 11 5v14l-11 5-11-5zM5 10l11 5 11-5M16 15v14M11 8l11 5v6"/>',
 material:'<path d="m12 4 8 0 1 5 5 2 4 6-4 3-1 6-6 3-4-4-6-1-4-6 3-4 1-6z"/><circle cx="16" cy="17" r="5"/>',
 character:'<rect x="3" y="2" width="26" height="28" rx="2"/><path d="M6 11h13v11H6zM19 15h4l4 4v3h-8M22 15v4h5"/><circle cx="10" cy="23" r="2"/><circle cx="24" cy="23" r="2"/>',
 referral:'<path d="m2 12 7-5 7 2 6-2 8 6-7 13-6 2-9-5zM9 8l-3 9 7 7M16 9l-6 7 3 3 7-5 6 7M13 24l3 3M17 21l5 5M21 18l4 5"/>',
 special:'<path d="m16 3 4 9 10 1-8 7 3 10-9-5-9 5 3-10-8-7 10-1z"/>'
};
(async()=>{const dest=path.resolve(__dirname,'../assets/art/items/seals');fs.mkdirSync(dest,{recursive:true});for(const [name,body]of Object.entries(drawings)){const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" stroke="#000" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;fs.writeFileSync(path.join(dest,name+'.svg'),svg+'\n');await sharp(Buffer.from(svg)).resize(192,192).png().toFile(path.join(dest,name+'.png'));}})().catch(e=>{console.error(e);process.exitCode=1});
