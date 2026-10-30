import {CARD_BY_ID} from './catalog.mjs';
import {normalizeSave} from './storage.mjs';

export const BACKUP_FORMAT='astral-bastion-reconstruction-backup';
export const BACKUP_VERSION=1;
export const MAX_BACKUP_CHARS=262144;

export function exportSaveBackup(save, exportedAt=new Date().toISOString()){
  return JSON.stringify({
    format:BACKUP_FORMAT,formatVersion:BACKUP_VERSION,exportedAt,
    save:normalizeSave(save)
  },null,2);
}
export function parseSaveBackup(raw){
  if(typeof raw!=='string'||!raw.trim()||raw.length>MAX_BACKUP_CHARS){
    throw new Error('Invalid or oversized backup (256 KB limit).');
  }
  let envelope;
  try{envelope=JSON.parse(raw)}catch{throw new Error('This file is not valid JSON.')}
  if(!envelope||typeof envelope!=='object'||Array.isArray(envelope)||
     envelope.format!==BACKUP_FORMAT||envelope.formatVersion!==BACKUP_VERSION){
    throw new Error('Not a compatible Astral Bastion reconstruction backup.');
  }
  const value=envelope.save;
  if(!value||typeof value!=='object'||Array.isArray(value)||value.schema!==1){
    throw new Error('Unsupported save format; nothing was imported.');
  }
  if(!Array.isArray(value.deck)||!value.deck.some(id=>typeof id==='string'&&Object.hasOwn(CARD_BY_ID,id))||
     !value.collection||typeof value.collection!=='object'||Array.isArray(value.collection)||
     !Object.keys(value.collection).some(id=>Object.hasOwn(CARD_BY_ID,id))){
    throw new Error('Backup has no recognizable cards or deck.');
  }
  return normalizeSave(value);
}
