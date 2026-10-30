import {CARD_BY_ID,ENEMIES,SECTORS,FACTIONS,coreMaxHull} from './catalog.mjs';
import {WaveDirector} from './waves.mjs';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const hypot=(a,b)=>Math.hypot(a,b);
const rand=(n)=>{let x=Math.sin(n*98.27+91)*45678.12;return x-Math.floor(x)};
export function routeFor(sector,lane){
 const lanes=sector.lanes;
 const base=lanes===1?250:lanes===2?[148,355][lane]:[102,260,414][lane];
 const jitter=(i)=>Math.sin(i*1.83+sector.id*1.41+lane*.97)*(sector.biome===1?46:sector.biome===2?63:30);
 return [{x:-25,y:base},{x:120,y:base+jitter(1)},{x:275,y:base+jitter(2)},{x:420,y:base+jitter(3)},{x:570,y:base+jitter(4)},{x:710,y:base+jitter(5)},{x:860,y:base}];
}
export function padLocations(sector){
 const result=[];for(let i=0;i<sector.pads;i++){
  const x=108+(i%5)*145;const y=67+Math.floor(i/5)*116;
  result.push({id:'P'+String(i+1).padStart(2,'0'),x,y});
 }return result;
}
export function waveRoster(sector,wave){
 const count=Math.min(33,5+Math.floor(wave*.85)+Math.floor(sector.id*.22));
 let pool=['scout','raider'];if(wave>2||sector.id>2)pool.push('bulwark');if(wave>3||sector.id>4)pool.push('dart');if(wave>5||sector.id>6)pool.push('splitter');if(wave>7||sector.id>8)pool.push('crusher');
 const result=[];for(let i=0;i<count;i++){let k=Math.floor(rand(sector.id*10000+wave*111+i)*pool.length);result.push(pool[k])}
 if(wave===sector.waves&&sector.boss)result.push('dreadnought');else if(wave===sector.waves||wave%5===0)result.push('warden');
 return result;
}
function upgradeCost(tower){return Math.max(2,Math.ceil(tower.card.cost*.7*tower.level))}
export class Battle {
 constructor({sectorId=1,save,onEvent=()=>{},onFinish=()=>{}}={}){
  this.sector=SECTORS.find(x=>x.id===sectorId)||SECTORS[0];
  this.save=save;this.onEvent=onEvent;this.onFinish=onFinish;
  this.hull=coreMaxHull(save.coreLevel);this.maxHull=this.hull;this.energy=10;this.started=performance.now();
  this.active=true;this.paused=false;this.pausedAt=null;this.last=0;this.enemies=[];this.towers=[];this.shots=[];this.pads=padLocations(this.sector);
  this.waveStats=new Map();this.spawnQueue=[];this.waveStarted=0;this.cleared=0;this.kills=0;this.earnedGold=0;this.earnedCores=0;this.selectedPad=null;this.selectedTower=null;
  this.handIndex=0;this.deck=save.deck.filter(id=>CARD_BY_ID[id]);this.hand=this.drawHand();
  this.director=new WaveDirector(cue=>this.startWave(cue));
  this.director.schedule(1,this.sector.waves,5000,this.started);
 }
 drawHand(){return Array.from({length:Math.min(3,this.deck.length)},(_,i)=>this.deck[(this.handIndex+i)%this.deck.length])}
 cycleHand(){this.handIndex=(this.handIndex+1)%this.deck.length;this.hand=this.drawHand();}
 factionCounts(){const counts=Object.fromEntries(Object.keys(FACTIONS).map(f=>[f,0]));for(const tower of this.towers)counts[tower.card.faction]++;return counts}
 view(now=performance.now()){
  return {sector:this.sector,wave:this.waveStarted,cleared:this.cleared,hull:this.hull,maxHull:this.maxHull,energy:this.energy,kills:this.kills,hand:this.hand,selectedPad:this.selectedPad,selectedTower:this.selectedTower,finished:!this.active,pending:this.director.snapshot(this.paused?this.pausedAt:now),towers:this.towers,enemies:this.enemies.length,factions:this.factionCounts(),pads:this.pads};
 }
 setPaused(value,now=performance.now()){
  if(!this.active||this.paused===value)return;
  if(value){this.paused=true;this.pausedAt=now;return}
  const shift=Math.max(0,now-(this.pausedAt??now));
  const p=this.director.pending;if(p){p.at+=shift;p.start+=shift}
  this.spawnQueue.forEach(item=>item.at+=shift);
  this.towers.forEach(t=>{if(t.nextFire)t.nextFire+=shift});
  this.enemies.forEach(e=>{e.slowUntil+=shift;e.burnUntil+=shift;e.vulnUntil+=shift});
  this.shots.forEach(s=>s.until+=shift);
  this.paused=false;this.pausedAt=null;this.last=now;
 }
 callWave(now=performance.now()){if(!this.active||this.paused)return false;const cue=this.director.callEarly(now);return Boolean(cue)}
 startWave(cue){
  this.waveStarted=cue.wave;this.energy+=cue.bonusEnergy;this.onEvent('wave-start',{...cue});
  const roster=waveRoster(this.sector,cue.wave);
  this.waveStats.set(cue.wave,{remaining:roster.length,paid:false});
  const now=performance.now();roster.forEach((id,i)=>{this.spawnQueue.push({id,wave:cue.wave,at:now+i*580+Math.floor(i/8)*240,lane:Math.floor(rand(this.sector.id*311+cue.wave*71+i)*this.sector.lanes)})});
  if(cue.wave<this.sector.waves){this.director.schedule(cue.wave+1,this.sector.waves,Math.max(12500,20500-cue.wave*320),now)}
 }
 spawn(item){const type=ENEMIES[item.id];if(!type)return;
  const level=1+(this.sector.id-1)*.18+Math.max(0,item.wave-1)*.10;
  const pts=routeFor(this.sector,item.lane);
  const foe={id:Symbol(item.id),type:item.id,wave:item.wave,lane:item.lane,pts,index:0,x:pts[0].x,y:pts[0].y, hp:Math.round(type.hp*level),maxHp:Math.round(type.hp*level),armor:Math.round(type.armor*(1+this.sector.id*.09)),speed:type.speed*(1+Math.min(.3,item.wave*.01)),slow:0,slowUntil:0,burn:0,burnUntil:0,vuln:0,vulnUntil:0};
  this.enemies.push(foe);if(!this.save.encountered.includes(item.id)){this.save.encountered.push(item.id);this.onEvent('first-encounter',{id:item.id})}
 }
 damageEnemy(enemy,amount,armorPierce=0,tower=null,now=performance.now()){
  if(enemy.hp<=0)return false;
  const counts=this.factionCounts();const faction=tower?.card.faction;
  if(faction==='Ion'&&counts.Ion>=2){enemy.armor=Math.max(0,enemy.armor-counts.Ion*20);enemy.vuln=Math.min(2,counts.Ion*.10);enemy.vulnUntil=now+3000}
  if(faction==='Void'&&counts.Void>=2)amount*=1+counts.Void*.04;
  const armorLeft=Math.max(0,enemy.armor-armorPierce);
  const mitigation=clamp(armorLeft/(armorLeft+75),0,.80);
  const actual=Math.max(1,amount*(1-mitigation)*(now<enemy.vulnUntil?1+enemy.vuln:1));
  enemy.hp-=actual;
  if(enemy.hp<=0){this.killEnemy(enemy);return true}return false;
 }
 killEnemy(enemy){
  if(enemy.dead)return;enemy.dead=true;this.kills++;const kind=ENEMIES[enemy.type];this.energy=Math.min(99,this.energy+kind.reward);
  if(enemy.type==='splitter'){
   const wave=this.waveStats.get(enemy.wave);wave.remaining+=2;
   for(let i=0;i<2;i++){const spawned={id:'scout',wave:enemy.wave,lane:enemy.lane,at:performance.now()+i*110,splitFrom:{x:enemy.x,y:enemy.y,index:enemy.index,pts:enemy.pts}};this.spawnQueue.push(spawned)}
  }
  this.resolveWaveMember(enemy.wave);this.onEvent('enemy-down',{type:enemy.type});
 }
 resolveWaveMember(wave){const s=this.waveStats.get(wave);if(!s||s.paid)return;s.remaining--;if(s.remaining<=0){s.paid=true;this.cleared++;this.energy=Math.min(99,this.energy+2);this.onEvent('wave-cleared',{wave,energy:2});}}
 breachEnemy(enemy){if(enemy.dead)return;enemy.dead=true;const damage=ENEMIES[enemy.type].damage;this.hull=Math.max(0,this.hull-damage);this.resolveWaveMember(enemy.wave);this.onEvent('breach',{damage,type:enemy.type});if(this.hull<=0)this.finish(false)}
 place(padId,cardId){
  if(!this.active||this.paused)return {ok:false,reason:'Deployment unavailable'};
  const pad=this.pads.find(p=>p.id===padId);const card=CARD_BY_ID[cardId];
  if(!pad||!card||this.towers.some(t=>t.padId===padId))return {ok:false,reason:'Select an empty pad'};
  if(!this.hand.includes(cardId))return {ok:false,reason:'Card is not in hand'};
  if(this.energy<card.cost)return {ok:false,reason:'Insufficient energy'};
  this.energy-=card.cost;
  const tower={padId,x:pad.x,y:pad.y,card,level:1,branch:null,nextFire:0,kills:0};this.towers.push(tower);
  this.selectedTower=tower;this.selectedPad=padId;this.cycleHand();this.onEvent('turret-placed',{tower});return {ok:true,tower};
 }
 choosePad(padId){this.selectedPad=padId;this.selectedTower=this.towers.find(t=>t.padId===padId)||null}
 upgrade(tower,branch){
  if(!this.active||this.paused||!this.towers.includes(tower))return false;
  if(tower.level>=tower.card.maxTier||this.energy<upgradeCost(tower))return false;
  if(tower.level===1&&!['assault','control'].includes(branch))return false;
  this.energy-=upgradeCost(tower);if(tower.level===1)tower.branch=branch;
  tower.level++;this.onEvent('upgrade',{tower});return true;
 }
 sell(tower){if(!this.active||this.paused||!this.towers.includes(tower))return false;
  this.energy+=Math.floor(tower.card.cost*.5+Math.max(0,tower.level-1)*tower.card.cost*.25);
  this.towers=this.towers.filter(t=>t!==tower);this.selectedTower=null;this.onEvent('sell',{});return true;
 }
 update(now=performance.now()){
  if(!this.active||this.paused)return;
  if(!this.last)this.last=now;const dt=clamp((now-this.last)/1000,0,.06);this.last=now;
  this.director.tick(now);
  const due=[];this.spawnQueue=this.spawnQueue.filter(item=>{if(item.at<=now){due.push(item);return false}return true});
  for(const item of due){this.spawn(item);if(item.splitFrom){const foe=this.enemies[this.enemies.length-1];Object.assign(foe,{x:item.splitFrom.x,y:item.splitFrom.y,index:item.splitFrom.index,pts:item.splitFrom.pts});}}
  for(const enemy of this.enemies){if(enemy.dead)continue;
   if(now<enemy.burnUntil){enemy.hp-=enemy.burn*dt;if(enemy.hp<=0){this.killEnemy(enemy);continue}}
   let speed=enemy.speed*(now<enemy.slowUntil?1-clamp(enemy.slow,0,.75):1)*dt;
   while(speed>0&&!enemy.dead){const target=enemy.pts[enemy.index+1];if(!target){this.breachEnemy(enemy);break}
    const dist=hypot(target.x-enemy.x,target.y-enemy.y);if(dist<=speed){enemy.x=target.x;enemy.y=target.y;enemy.index++;speed-=dist}else{enemy.x+=(target.x-enemy.x)/dist*speed;enemy.y+=(target.y-enemy.y)/dist*speed;speed=0}}
  }
  const counts=this.factionCounts();
  for(const tower of this.towers){if(now<tower.nextFire)continue;
   const card=tower.card;const level=tower.level;
   const range=card.range*(1+(level-1)*.08)*(card.faction==='Cryo'&&counts.Cryo>=2?1+counts.Cryo*.02:1);
   const viable=this.enemies.filter(e=>!e.dead&&hypot(e.x-tower.x,e.y-tower.y)<=range);
   if(!viable.length)continue;
   viable.sort((a,b)=>b.index-a.index||a.hp-b.hp);
   const target=viable[0];const damage=card.damage*(1+(level-1)*.34)*(tower.branch==='assault'?1.27:1)*(1+Math.max(0,(this.save.collection[card.id]||1)-1)*.04);
   const armorPierce=card.armorPierce+(tower.branch==='assault'?level*5:0);
   const splash=card.splash*(tower.branch==='control'?1.20:1);
   const hits=splash?viable.filter(e=>hypot(e.x-target.x,e.y-target.y)<=splash):viable.slice(0,Math.max(1,card.chain));
   hits.forEach((e,i)=>{
    const wasKilled=this.damageEnemy(e,damage*(i?0.65:1),armorPierce,tower,now);if(wasKilled)tower.kills++;
    const slow=card.slow+(tower.branch==='control'?.10*level:0);
    if(slow>0){e.slow=clamp(slow+(card.faction==='Cryo'&&counts.Cryo>=2?counts.Cryo*.03:0),0,.72);e.slowUntil=now+2100}
    const burn=card.burn+(card.faction==='Solar'&&counts.Solar>=2?counts.Solar:0);
    if(burn>0){e.burn=burn;e.burnUntil=now+2500}
   });
   this.shots.push({from:{x:tower.x,y:tower.y},to:{x:target.x,y:target.y},until:now+115,faction:card.faction,aoe:splash});
   const rateMult=(card.faction==='Solar'&&counts.Solar>=2?1+counts.Solar*.04:1);
   tower.nextFire=now+card.rate*1000/(1+(level-1)*.1)/rateMult;
   this.onEvent('turret-fire',{tower});
  }
  this.enemies=this.enemies.filter(e=>!e.dead);
  this.shots=this.shots.filter(s=>s.until>now);
  if(this.waveStarted===this.sector.waves && this.cleared===this.sector.waves&&!this.spawnQueue.length&&!this.enemies.length){this.finish(true)}
 }
 finish(victory){if(!this.active)return;this.active=false;this.paused=false;
  if(victory){const reward=Math.round(55+this.sector.id*13+this.kills*.55);const cores=1+(this.sector.boss?2:0);
   this.earnedGold=reward;this.earnedCores=cores;this.save.gold+=reward;this.save.cores+=cores;this.save.caches+=1;
   if(this.save.completed===this.sector.id-1)this.save.completed=Math.min(18,this.sector.id);
  }
  this.save.records.push({date:new Date().toISOString(),sector:this.sector.id,victory,kills:this.kills});this.save.records=this.save.records.slice(-30);
  this.onEvent(victory?'victory':'defeat',{sector:this.sector.id});this.onFinish({victory,sector:this.sector,kills:this.kills,gold:this.earnedGold,cores:this.earnedCores});
 }
}