// Original icon drawings, 32-unit grid; shipped PNGs need no native SVG module.
// Optional development renderer: sharp. Set ICON_RENDERER_NODE_MODULES if it
// lives in an external tooling environment. The application never runs this file.
const fs=require('node:fs'),path=require('node:path');
const sharp=require(process.env.ICON_RENDERER_NODE_MODULES?path.join(process.env.ICON_RENDERER_NODE_MODULES,'sharp'):'sharp');
const icons={
 home:'<path d="M3 14 16 4l13 10M6 12v16h20V12M13 28V18h6v10M3 29h26"/><path d="M9 15h2m10 0h2"/>',
 fleet:'<path d="M3 5h15v9H3zM18 8h6l4 4v2H18M8 18h13v9H8zM21 21h5l3 3v3h-8"/><circle cx="7" cy="15" r="2"/><circle cx="24" cy="15" r="2"/><circle cx="12" cy="28" r="2"/><circle cx="25" cy="28" r="2"/>',
 garage:'<path d="m3 12 13-8 13 8v17H3zM8 29V15h16v14M8 19h16M8 23h16M8 27h16M13 10h6"/>',
 orders:'<path d="M7 3h16l3 3v23H7zM21 3v6h5M11 13h11M11 17h7M11 23h7m-3-3 3 3-3 3"/>',
 projects:'<path d="M4 29V5h24M4 9l15-4M12 9h14M25 5v9m-2 0a2 2 0 0 0 4 0M3 29h26"/><path d="M10 20h8v9h-8zM19 23h9v6h-9zM14 23v3m9 0v3"/>',
 expedition:'<circle cx="16" cy="16" r="12"/><path d="m21 11-3 7-7 3 3-7zM16 2v4m0 20v4M2 16h4m20 0h4"/>',
 cards:'<path d="M11 6 4 9l6 18 5-2M21 6l7 3-6 18-5-2"/><rect x="10" y="3" width="13" height="25" rx="2"/><path d="m16.5 9 3 5-3 5-3-5zM14 24h5"/>',
 company:'<path d="m3 10 13-7 13 7zM5 29h22M6 12v13m7-13v13m6-13v13m7-13v13M4 25h24v4H4"/>',
 hub:'<path d="m3 13 12-8 12 8M5 12v15h11M9 27V16h8M20 19h7l3 4v5H18V18h4M22 19v5h8"/><circle cx="21" cy="28" r="2"/><circle cx="28" cy="28" r="2"/>',
 inventory:'<path d="m4 10 12-6 12 6v15l-12 5-12-5zM4 10l12 5 12-5M16 15v15M10 7l12 6v7"/>',
 crafting:'<path d="m6 4 5 5-3 3-5-5a7 7 0 0 0 9 9l12 12a3 3 0 0 0 4-4L16 12a7 7 0 0 0-9-9M23 3l6 6-6 5-5-5zM18 10 4 25a2 2 0 0 0 3 3l10-10"/>',
 customers:'<circle cx="12" cy="10" r="5"/><path d="M3 28v-4a9 9 0 0 1 18 0v4zM22 6a5 5 0 0 1 0 10m3 4a7 7 0 0 1 4 7v1h-4"/>',
 wholesaler:'<path d="M4 11 7 4h18l3 7M4 11v3a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0v-3zM6 18v11h20V18M4 29h24M11 5l-1 6m11-6 1 6M11 21h10v8"/>',
 statistics:'<path d="M5 4h21v25H5zM9 9h12M10 24v-6m6 6V14m6 10v-13M5 4H3v25h2"/>',
 settings:'<path d="m13 3 6 0 1 4 4 2 4-1 3 5-3 3v4l2 3-3 5-4-1-4 2-1 3h-6l-1-4-4-2-4 1-3-5 3-3v-4l-2-3 3-5 4 1 4-2z" transform="translate(1 0) scale(.94)"/><circle cx="16" cy="16" r="5"/>',
 events:'<path d="M7 29V3m0 2c7-5 12 6 20 1v14c-8 5-13-6-20-1M4 29h6"/>',
 coin:'<circle cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="8"/><path d="m16 10 4 6-4 6-4-6z"/>',
 overtime:'<path d="M8 3h16M8 29h16M10 3v5c0 4 6 6 6 8s-6 4-6 8v5M22 3v5c0 4-6 6-6 8s6 4 6 8v5M12 25h8M13 8h6"/>',
 module:'<path d="M8 10h16v15H8zM8 14h16M16 14v11M3 10V5h5M3 5l5 5M29 22v5h-5m5 0-5-5"/>',
 gear:'<path d="M13 3h6l1 5 4 2 4-1 3 5-4 3v4l2 3-4 5-4-2-4 2-1 3h-5l-1-5-4-2-3 1-3-5 4-3v-4l-2-3 3-5 4 1z" transform="translate(1 0) scale(.94)"/><circle cx="16" cy="17" r="5"/>',
 shard:'<path d="m16 3 9 8 3 11-12 8L4 22l3-11zM16 3l-4 12 4 15 4-15zM4 22l8-7 8 0 8 7M7 11l5 4m8 0 5-4"/>',
 document:'<path d="M7 3h15l4 4v22H7zM21 3v6h5M11 13h11M11 17h11M11 21h5"/><circle cx="22" cy="25" r="4"/>',
 truck:'<path d="M3 9h16v15H3zM19 13h6l5 6v5H19M22 14v6h8"/><circle cx="8" cy="25" r="3"/><circle cx="25" cy="25" r="3"/>',
 lock:'<rect x="6" y="14" width="20" height="15" rx="2"/><path d="M10 14V9a6 6 0 0 1 12 0v5M16 21v3"/>',
 check:'<path d="m5 16 7 7L27 8"/>',plus:'<path d="M16 5v22M5 16h22"/>',minus:'<path d="M5 16h22"/>',
 back:'<path d="m20 5-11 11 11 11"/>',chevron:'<path d="m12 5 11 11-11 11"/>',arrow:'<path d="M7 25 25 7M7 7h18v18"/>',
 help:'<circle cx="16" cy="16" r="12"/><path d="M12 12a4 4 0 1 1 6 3c-2 1-2 2-2 4M16 24h.1"/>',
 close:'<path d="m7 7 18 18M7 25 25 7"/>',timer:'<circle cx="16" cy="18" r="11"/><path d="M12 3h8M16 3v4m0 6v6l5 3M25 9l3-3"/>',
 reward:'<path d="M4 13a12 10 0 0 1 24 0v15H4zM4 15h24M11 5v10m10-10v10M14 15v7h4v-7M4 24h10m4 0h10"/>',
};
(async()=>{const directory=path.resolve(__dirname,'../assets/icons');fs.mkdirSync(path.join(directory,'source'),{recursive:true});
for(const [name,body] of Object.entries(icons)){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="96" height="96"><g fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
 fs.writeFileSync(path.join(directory,'source',name+'.svg'),svg+'\n');await sharp(Buffer.from(svg)).png().toFile(path.join(directory,name+'.png'));
}
console.log(`Rendered ${Object.keys(icons).length} original game icons.`);})().catch(error=>{console.error(error);process.exitCode=1});
