import {START_DECK,CORE_MAX_LEVEL,CARD_BY_ID} from './catalog.mjs';
export const SAVE_KEY='astral-bastion-reconstructed-save-v1';
export function defaultSave(){return {schema:1,gold:400,cores:8,completed:0,selectedSector:1,collection:Object.fromEntries(START_DECK.map(id=>[id,1])),coreLevel:1,deck:[...START_DECK],encountered:[],tutorialStep:0,records:[],caches:0,muted:false};}
export function normalizeSave(value){
 const seed=defaultSave();if(!value||typeof value!=='object')return seed;
 const number=(v,f,min,max)=>Number.isFinite(v)?Math.max(min,Math.min(max,Math.floor(v))):f;
 const deck=Array.isArray(value.deck)?Array.from(new Set(value.deck.filter(x=>Object.hasOwn(CARD_BY_ID,x)))).slice(0,6):seed.deck;
 while(deck.length<6){let next=START_DECK.find(x=>!deck.includes(x));if(!next)break;deck.push(next)}
 const collection={...seed.collection};if(value.collection&&typeof value.collection==='object')for(const [k,v]of Object.entries(value.collection)){if(Object.hasOwn(CARD_BY_ID,k))collection[k]=number(v,1,1,8)}
 return {schema:1,gold:number(value.gold,seed.gold,0,1e7),cores:number(value.cores,seed.cores,0,1e6),completed:number(value.completed,0,0,18),selectedSector:number(value.selectedSector,1,1,18),collection,coreLevel:number(value.coreLevel,1,1,CORE_MAX_LEVEL),deck,encountered:Array.isArray(value.encountered)?Array.from(new Set(value.encountered.filter(x=>typeof x==='string'))).slice(0,100):[],tutorialStep:number(value.tutorialStep,0,0,6),records:Array.isArray(value.records)?value.records.slice(-30).filter(x=>x&&typeof x==='object'):[],caches:number(value.caches,0,0,999),muted:!!value.muted};
}
export function loadSave(){try{return normalizeSave(JSON.parse(localStorage.getItem(SAVE_KEY)))}catch{return defaultSave()}}
export function persistSave(save){try{localStorage.setItem(SAVE_KEY,JSON.stringify(normalizeSave(save)));return true}catch{return false}}
export function cardUpgrade(save,id){const level=save.collection[id]||1;if(level>=8)return false;const cost=35*level*level;if(save.gold<cost)return false;save.gold-=cost;save.collection[id]=level+1;return true}
export function coreUpgrade(save){if(save.coreLevel>=CORE_MAX_LEVEL)return false;const cost=60*save.coreLevel*save.coreLevel,cores=Math.ceil(save.coreLevel/2);if(save.gold<cost||save.cores<cores)return false;save.gold-=cost;save.cores-=cores;save.coreLevel++;return true}