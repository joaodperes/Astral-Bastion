import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultSave,normalizeSave} from '../src/storage.mjs';
import {BACKUP_FORMAT,exportSaveBackup,parseSaveBackup,MAX_BACKUP_CHARS} from '../src/saveTransfer.mjs';

test('portable backup round-trip preserves campaign and collection progress',()=>{
 const save=defaultSave();save.completed=7;save.coreLevel=4;save.gold=937;
 save.collection.pulse=5;save.encountered=['scout','bulwark'];save.muted=true;
 const text=exportSaveBackup(save,'2026-10-30T00:00:00.000Z');
 const envelope=JSON.parse(text);
 assert.equal(envelope.format,BACKUP_FORMAT);assert.equal(envelope.formatVersion,1);
 assert.equal(envelope.exportedAt,'2026-10-30T00:00:00.000Z');
 assert.deepEqual(parseSaveBackup(text),normalizeSave(save));
});
test('incompatible or malformed JSON cannot overwrite browser saves',()=>{
 assert.throws(()=>parseSaveBackup('{broken'),/valid JSON/);
 assert.throws(()=>parseSaveBackup('{}'),/compatible/);
 assert.throws(()=>parseSaveBackup(JSON.stringify({format:BACKUP_FORMAT,formatVersion:2,save:defaultSave()})),/compatible/);
 assert.throws(()=>parseSaveBackup(JSON.stringify({format:BACKUP_FORMAT,formatVersion:1,save:{schema:99}})),/Unsupported save/);
 assert.throws(()=>parseSaveBackup(JSON.stringify({format:BACKUP_FORMAT,formatVersion:1,save:{schema:1,deck:['unknown'],collection:{unknown:1}}})),/recognizable cards/);
 assert.throws(()=>parseSaveBackup(' '.repeat(MAX_BACKUP_CHARS+1)),/oversized/);
});
test('inherited object properties do not count as valid card IDs',()=>{
 const envelope=JSON.parse(exportSaveBackup(defaultSave()));
 envelope.save.deck=['toString','constructor','pulse'];
 envelope.save.collection={toString:8,constructor:8,pulse:2};
 const restored=parseSaveBackup(JSON.stringify(envelope));
 assert.equal(restored.deck.includes('toString'),false);
 assert.equal(restored.deck.includes('constructor'),false);
 assert.equal(restored.collection.pulse,2);
 assert.equal(Object.hasOwn(restored.collection,'constructor'),false);
 assert.equal(Object.hasOwn(restored.collection,'toString'),false);
});
