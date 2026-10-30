import test from 'node:test';import assert from 'node:assert/strict';
import {CARDS,CARD_BY_ID,FACTIONS,SECTORS,ENEMIES,coreMaxHull,factionRows,validateCatalog} from '../src/catalog.mjs';
import {WaveDirector,earlyCallReward,formatCountdown} from '../src/waves.mjs';
import {Battle,padLocations,routeFor,waveRoster} from '../src/engine.mjs';
import {defaultSave,normalizeSave,cardUpgrade,coreUpgrade} from '../src/storage.mjs';

test('complete reconstructed catalog is unique with exactly 32 cards, 4 factions and 18 sectors',()=>{
 assert.equal(validateCatalog(),true);assert.equal(CARDS.length,32);assert.equal(Object.keys(FACTIONS).length,4);assert.equal(SECTORS.length,18);
 assert.equal(new Set(CARDS.map(c=>c.id)).size,32);assert.equal(new Set(SECTORS.map(s=>s.id)).size,18);
});
test('every sector has 8..20 buildable pads and a valid set of lane routes',()=>{
 for(const sector of SECTORS){let pads=padLocations(sector);assert.equal(pads.length,sector.pads);assert.ok(pads.length>=8&&pads.length<=20);assert.equal(new Set(pads.map(p=>p.id)).size,pads.length);
  for(let lane=0;lane<sector.lanes;lane++){let route=routeFor(sector,lane);assert.ok(route.length>=5);assert.ok(route[0].x<0);assert.ok(route.at(-1).x>840)}
 }
});
test('all 32 cards have distinct IDs and meaningful turret statistics',()=>{
 for(const c of CARDS){assert.equal(CARD_BY_ID[c.id],c);assert.ok(c.damage>0);assert.ok(c.rate>0);assert.ok(c.cost>=2);assert.ok(c.maxTier>=3);assert.ok(c.range>80)}
});
test('core hull starter grows from 12 to 26 by increments of two',()=>{
 assert.equal(coreMaxHull(1),12);assert.equal(coreMaxHull(2),14);assert.equal(coreMaxHull(8),26);assert.equal(coreMaxHull(100),26);
});
test('faction link inactive bonuses display zero current effect',()=>{
 for(const faction of Object.keys(FACTIONS)){for(const count of [0,1]){let rows=factionRows(faction,count);assert.equal(rows.active,false);assert.match(rows.heading,/starting at 2/);assert.match(rows.current,/Current: (?:\+)?0/);}}
});
test('Ion faction preview reproduces requested six-turret armor and vulnerability totals',()=>{
 let rows=factionRows('Ion',6);assert.equal(rows.perTurret,'20 armor points stripped · +10% vulnerability for 3s');assert.equal(rows.current,'Current: 120 armor points · +60% vulnerability for 3s');
});
test('early wave reward maxes at three energy and only pays once',()=>{
 let events=[];let d=new WaveDirector(c=>events.push(c));d.schedule(1,5,30000,100);assert.equal(d.snapshot(100).bonusEnergy,3);
 assert.deepEqual(d.callEarly(200),{wave:1,reason:'early',bonusEnergy:3});assert.equal(d.callEarly(201),null);assert.equal(d.tick(35000),null);assert.equal(events.length,1);
});
test('automatic wave start gives no early reward, and countdown formatting is stable',()=>{
 let events=[];let d=new WaveDirector(c=>events.push(c));d.schedule(1,2,1000,100);assert.equal(d.tick(1099),null);assert.equal(d.tick(1100).bonusEnergy,0);
 d.schedule(2,2,2000,1100);assert.equal(d.snapshot(1100).timeText,'00:02');assert.equal(formatCountdown(65.1),'01:06');assert.equal(earlyCallReward(15001),2);
 assert.equal(d.tick(3100).wave,2);assert.equal(events.length,2);
});
test('wave cannot be scheduled twice or be scheduled out of range',()=>{
 let d=new WaveDirector(()=>{});assert.throws(()=>d.schedule(0,5,10,0));d.schedule(1,5,5,0);assert.throws(()=>d.schedule(2,5,5,0));d.tick(10);assert.throws(()=>d.schedule(1,5,5,10));
});
test('save normalization rejects unknown card IDs and clamps unsafe numbers',()=>{
 let s=normalizeSave({completed:999,coreLevel:-1,gold:Infinity,deck:['pulse','bad','pulse','cryo'],collection:{notreal:99,pulse:99},encountered:['scout','scout']});
 assert.equal(s.completed,18);assert.equal(s.coreLevel,1);assert.equal(s.gold,400);assert.equal(s.collection.pulse,8);assert.equal(s.collection.notreal,undefined);assert.equal(s.deck.length,6);assert.equal(s.deck.includes('bad'),false);assert.deepEqual(s.encountered,['scout']);
});
test('collection upgrades spend gold and honor maximum level',()=>{
 let s=defaultSave();assert.equal(cardUpgrade(s,'pulse'),true);assert.equal(s.collection.pulse,2);assert.equal(s.gold,365);s.collection.pulse=8;assert.equal(cardUpgrade(s,'pulse'),false);
});
test('core upgrades spend resources and stop at level 8',()=>{
 let s=defaultSave();assert.equal(coreUpgrade(s),true);assert.equal(s.coreLevel,2);assert.equal(s.gold,340);assert.equal(s.cores,7);s.coreLevel=8;assert.equal(coreUpgrade(s),false);
});
test('new battle starts at 12 hull and has a three-card rotation',()=>{
 let b=new Battle({save:defaultSave()});assert.equal(b.maxHull,12);assert.equal(b.hand.length,3);assert.equal(b.director.snapshot().wave,1);assert.equal(b.towers.length,0);
});
test('turret deployment spends energy and consumes hand slot',()=>{
 let b=new Battle({save:defaultSave()});let id=b.hand[0],cost=CARD_BY_ID[id].cost,placed=b.place('P01',id);
 assert.equal(placed.ok,true);assert.equal(b.energy,10-cost);assert.equal(b.towers.length,1);
 assert.equal(b.place('P01',b.hand[0]).ok,false);assert.notDeepEqual(b.hand,['pulse','cryo','ember']);
});
test('initial deck cards are all owned at level one, and Pulse level two is a graduation milestone',()=>{const s=defaultSave();assert.equal(Object.keys(s.collection).length,6);assert.equal(s.collection.pulse,1);assert.ok(s.deck.every(id=>s.collection[id]===1))});
test('pause keeps wave countdown and spawn queue time frozen until resume',()=>{const b=new Battle({save:defaultSave()});const t=b.started;const due=b.director.pending.at;b.setPaused(true,t+2000);assert.equal(b.view(t+15000).pending.timeText,b.director.snapshot(t+2000).timeText);b.setPaused(false,t+12000);assert.equal(b.director.pending.at,due+10000)});
test('tier-2 upgrade requires a branch and costs energy',()=>{
 let b=new Battle({save:defaultSave()});let tower=b.place('P01','pulse').tower;
 assert.equal(b.upgrade(tower),false);assert.equal(b.upgrade(tower,'assault'),true);assert.equal(tower.level,2);assert.equal(tower.branch,'assault');
});
test('selling a turret removes it and returns some energy',()=>{
 let b=new Battle({save:defaultSave()});let tower=b.place('P01','pulse').tower;let before=b.energy;assert.equal(b.sell(tower),true);assert.equal(b.towers.length,0);assert.ok(b.energy>before);assert.equal(b.sell(tower),false);
});
test('roster generates armored enemies and bosses as campaigns progress',()=>{
 const first=waveRoster(SECTORS[0],1);assert.ok(first.length>=5);const end=waveRoster(SECTORS[17],SECTORS[17].waves);assert.ok(end.includes('dreadnought'));assert.ok(end.length>first.length);
});
test('armor absorbs damage, armor piercing increases damage, ion strips armor',()=>{
 let b=new Battle({save:defaultSave()});const stats={...ENEMIES.bulwark};const base={hp:1000,maxHp:1000,armor:70,vuln:0,vulnUntil:0};
 const e1={...base};b.damageEnemy(e1,100,0);const without=e1.hp;
 const e2={...base};b.damageEnemy(e2,100,70);assert.ok(e2.hp<without);
 b.towers=[{card:CARD_BY_ID.ion},{card:CARD_BY_ID.ion}];const e3={...base};b.damageEnemy(e3,100,0,b.towers[0]);assert.equal(e3.armor,30);assert.ok(e3.vuln>0);
});
test('breaching inflicts distinct enemy damage and leads to defeat at zero hull',()=>{
 let ended=null;let b=new Battle({save:defaultSave(),onFinish:r=>ended=r});let foe={wave:1,type:'crusher',dead:false};b.waveStats.set(1,{remaining:10,paid:false});b.breachEnemy(foe);assert.equal(b.hull,7);for(let i=0;i<2;i++)b.breachEnemy({wave:1,type:'crusher',dead:false});assert.equal(b.hull,0);assert.equal(ended.victory,false);
});
test('wave clear grants two energy exactly once',()=>{
 let b=new Battle({save:defaultSave()});b.waveStats.set(1,{remaining:2,paid:false});const before=b.energy;b.resolveWaveMember(1);assert.equal(b.energy,before);b.resolveWaveMember(1);assert.equal(b.energy,before+2);b.resolveWaveMember(1);assert.equal(b.energy,before+2);
});
test('campaign unlocks exactly next sector after win and rewards are persisted in save object',()=>{
 const save=defaultSave();let result=null;let b=new Battle({save,onFinish:r=>result=r});b.finish(true);
 assert.equal(save.completed,1);assert.ok(save.gold>400);assert.ok(save.cores>8);assert.equal(save.caches,1);assert.equal(result.victory,true);
 const another=new Battle({save,sectorId:1});another.finish(true);assert.equal(save.completed,1);
});
test('new enemy encounters unlock manual profiles',()=>{
 let s=defaultSave();let b=new Battle({save:s});b.spawn({id:'scout',wave:1,lane:0});b.spawn({id:'scout',wave:1,lane:0});assert.deepEqual(s.encountered,['scout']);
});