/** Reconstructed catalog based on documented v4.1 counts, not the original source export. */
const make = (id,name,faction,cost,damage,rate,range,kind,extra={})=>Object.freeze({
  id,name,faction,cost,damage,rate,range,kind,maxTier: extra.maxTier || (cost>=5?3:4),
  armorPierce:0, splash:0, slow:0, burn:0, chain:0, utility:0, ...extra
});
export const CARDS = Object.freeze([
 make('pulse','Pulse Sentry','Solar',2,12,.56,100,'turret',{maxTier:4}),
 make('ember','Ember Mortar','Solar',4,25,1.9,145,'mortar',{splash:39,burn:3,maxTier:4}),
 make('comet','Comet Battery','Solar',5,32,1.25,174,'turret',{armorPierce:10}),
 make('flare','Flare Beam','Solar',3,9,.31,119,'beam',{burn:2}),
 make('arc','Arc Volley','Solar',3,16,.78,119,'turret',{chain:2}),
 make('solar-prism','Solar Prism','Solar',6,42,1.55,161,'beam',{armorPierce:18,burn:5}),
 make('kinetic','Kinetic Array','Solar',4,18,.43,115,'turret',{armorPierce:8}),
 make('drone','Sentinel Drone','Solar',5,11,.36,166,'drone',{chain:2}),
 make('cryo','Cryo Relay','Cryo',3,8,.62,123,'beam',{slow:.32,maxTier:3}),
 make('glacial','Glacial Lance','Cryo',4,21,1.10,156,'beam',{slow:.24,armorPierce:14}),
 make('shard','Shard Caster','Cryo',2,9,.64,94,'turret',{slow:.19}),
 make('frost-mines','Frost Mines','Cryo',3,26,2.4,112,'mortar',{splash:38,slow:.35}),
 make('tundra','Tundra Guard','Cryo',4,18,1.0,123,'turret',{slow:.2,armorPierce:8}),
 make('permafrost','Permafrost Cannon','Cryo',5,38,2.2,157,'mortar',{splash:45,slow:.3}),
 make('polar','Polar Beacon','Cryo',4,7,.75,148,'beam',{slow:.43,chain:2}),
 make('ice-sentinel','Ice Sentinel','Cryo',5,17,.44,126,'turret',{slow:.16}),
 make('void','Void Prism','Void',5,29,1.0,138,'beam',{armorPierce:16}),
 make('gravity','Gravity Well','Void',4,10,1.4,122,'mortar',{splash:50,slow:.35}),
 make('rift','Rift Walkers','Void',6,22,1.04,175,'drone',{chain:3}),
 make('singularity','Singularity Lance','Void',6,60,2.35,207,'beam',{armorPierce:32}),
 make('shadow','Shadow Pylon','Void',3,13,.90,120,'beam',{slow:.1}),
 make('phase','Phase Turret','Void',4,15,.46,131,'turret',{armorPierce:9}),
 make('eclipse','Eclipse Cannon','Void',5,43,2.05,163,'mortar',{splash:48}),
 make('warp','Warp Snare','Void',3,7,.48,101,'beam',{slow:.45}),
 make('ion','Ion Disruptor','Ion',3,12,.67,129,'beam',{armorPierce:14}),
 make('orbital','Orbital Lance','Ion',6,55,2.5,202,'beam',{armorPierce:35}),
 make('plasma','Plasma Spinner','Ion',4,13,.33,123,'turret',{burn:2}),
 make('tesla','Tesla Coil','Ion',4,17,.73,138,'beam',{chain:3}),
 make('railgun','Railgun Turret','Ion',5,47,1.75,195,'turret',{armorPierce:25}),
 make('barrier','Pulse Barrier','Ion',3,10,.65,108,'beam',{slow:.16,armorPierce:12}),
 make('blaster','Star Blaster','Ion',4,22,.79,143,'turret',{armorPierce:10}),
 make('storm','Storm Beacon','Ion',5,15,.46,142,'beam',{chain:4,armorPierce:7})
]);
export const CARD_BY_ID = Object.freeze(Object.fromEntries(CARDS.map(c=>[c.id,c])));
export const FACTIONS = Object.freeze({
  Solar:{color:'#efad56',perTurret:[{amount:1,unit:'burn damage/s'},{amount:4,unit:'% rate of fire'}]},
  Cryo:{color:'#70cffa',perTurret:[{amount:3,unit:'% slow power'},{amount:2,unit:'% extra range'}]},
  Void:{color:'#bda0fe',perTurret:[{amount:4,unit:'% damage'},{amount:2,unit:'% vulnerability for 3s'}]},
  Ion:{color:'#6ee5d5',perTurret:[{amount:20,unit:'armor points stripped'},{amount:10,unit:'% vulnerability for 3s'}]}
});
export const ENEMIES = Object.freeze({
 scout:{name:'Scout',hp:44,speed:53,armor:0,damage:1,color:'#f4dfad',reward:1,desc:'Quick and fragile. Can slip past slow turrets.'},
 raider:{name:'Raider',hp:75,speed:41,armor:5,damage:2,color:'#e8a8a1',reward:1,desc:'Ordinary hull-breaker; damages a reactor for two hull.'},
 bulwark:{name:'Bulwark',hp:165,speed:27,armor:35,damage:3,color:'#aabbd0',reward:2,desc:'Heavy armor absorbs direct damage. Use armor-stripping weapons.'},
 dart:{name:'Dart',hp:47,speed:78,armor:0,damage:2,color:'#eccc78',reward:1,desc:'Fast flanker with an evasive movement pattern.'},
 splitter:{name:'Splitter',hp:93,speed:35,armor:10,damage:2,color:'#d9aaff',reward:2,desc:'Splits into two smaller scouts on death.'},
 crusher:{name:'Crusher',hp:270,speed:20,armor:48,damage:5,color:'#dc7780',reward:3,desc:'Armored siege unit. Massive damage if it reaches a reactor.'},
 warden:{name:'Warden',hp:570,speed:20,armor:65,damage:7,color:'#e6b36c',reward:6,desc:'Mini-boss with extreme armor and shared-hull damage.'},
 dreadnought:{name:'Dreadnought',hp:1150,speed:17,armor:90,damage:10,color:'#f88469',reward:10,desc:'Sector boss. Its heavy plating requires concentrated fire.'}
});
const titles=['Kepler Outpost','Cinder Belt','Silent Nebula','Iron Meridian','Event Horizon','The Last Star',
 'Pale Horizon','Asterion Crossroads','Shattered Anchorage','Ion Tempest','Forgotten Relay','Starless Rim',
 'Helios Rift','Ashen Corridor','Frozen Expanse','Nadir Gate','Obsidian Crown','Final Bastion'];
export const SECTORS = Object.freeze(titles.map((name,i)=>Object.freeze({
  id:i+1,name,waves:5+Math.floor(i*.6),pads:Math.min(20,8+Math.floor(i*.75)),lanes:i>=9?3:i>=3?2:1,
  difficulty:1+i*.19,biome:i%4,unlock:i===0?0:i,
  boss:i===5||i===11||i===17
})));
export const CORE_MAX_LEVEL = 8;
export const coreMaxHull = level => 12+2*(Math.max(1,Math.min(8,Math.floor(level||1)))-1);
export const upgradeGoldCost = level=>Math.round(45*Math.pow(1.55,level-1));
export const upgradeCoreCost = level=>Math.max(1,Math.ceil(level/2));
export const factionRows=(faction,count)=>{
  const spec=FACTIONS[faction]; if(!spec)throw Error('Unknown faction '+faction);
  const n=Math.max(0,Math.floor(count||0)), active=n>=2;
  const format=(e,mult,current)=>`${e.unit.startsWith('%')?'+':''}${e.amount*mult}${e.unit.startsWith('%')?'':' '}${current&&e.unit==='armor points stripped'?'armor points':e.unit}`;
  return {active,heading:'Bonus per turret, starting at 2:',perTurret:spec.perTurret.map(e=>format(e,1,false)).join(' · '),current:'Current: '+spec.perTurret.map(e=>format(e,active?n:0,true)).join(' · ')};
};
export const START_DECK = Object.freeze(['pulse','cryo','ember','ion','arc','gravity']);
export function validateCatalog(){
 const ids=CARDS.map(c=>c.id);
 if(new Set(ids).size!==32)throw Error('Card count/IDs not 32 distinct');
 if(SECTORS.length!==18)throw Error('Sector count must be 18');
 for(const card of CARDS){if(!FACTIONS[card.faction]||card.cost<1||card.damage<=0||card.rate<=0||card.range<=0)throw Error('Invalid card '+card.id)}
 return true;
}