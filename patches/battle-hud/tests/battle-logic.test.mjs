import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WaveDirector, earlyCallReward, formatCountdown } from '../src/waveDirector.ts';
import { factionLinkRows, exampleArmorLink } from '../src/factionLinks.ts';

test('bonus scales with time saved and caps at three', () => {
  assert.equal(earlyCallReward(0), 0);
  assert.equal(earlyCallReward(1), 1);
  assert.equal(earlyCallReward(15_001), 2);
  assert.equal(earlyCallReward(60_000), 3);
});
test('countdown is mm:ss', () => {
  assert.equal(formatCountdown(17), '00:17');
  assert.equal(formatCountdown(90), '01:30');
});
test('early call starts exactly once and prevents repeated bonus', () => {
  const seen = [];
  const director = new WaveDirector(cue => seen.push(cue));
  director.schedule(1, 5, 20_000, 0);
  assert.equal(director.snapshot(5_000).timeText, '00:15');
  assert.equal(director.callEarly(5_000)?.bonusEnergy, 2);
  assert.equal(director.callEarly(5_000), null);
  assert.equal(director.tick(20_000), null);
  assert.equal(seen.length, 1);
  director.schedule(2, 5, 5_000, 20_000);
  assert.equal(director.tick(25_000)?.bonusEnergy, 0);
  assert.equal(seen.length, 2);
});
test('wave that has reached deadline cannot be claimed early', () => {
  const director = new WaveDirector(() => {});
  director.schedule(1, 1, 1000, 0);
  assert.equal(director.callEarly(1000), null);
  assert.equal(director.tick(1000)?.reason, 'automatic');
});
test('faction link shows requested three rows at six turrets', () => {
  const rows = factionLinkRows(exampleArmorLink);
  assert.equal(rows.heading, 'Bonus per turret, starting at 2:');
  assert.equal(rows.perTurret, '20 armor points stripped · +10% vulnerability for 3s');
  assert.equal(rows.current, 'Current: 120 armor points · +60% vulnerability for 3s');
});
test('inactive bonus has zero current values, including a single deployed turret', () => {
  const rows = factionLinkRows({ ...exampleArmorLink, turretCount: 1 });
  assert.equal(rows.active, false);
  assert.equal(rows.current, 'Current: 0 armor points · +0% vulnerability for 3s');
});
test('no wave schedules beyond final wave', () => {
  const director = new WaveDirector(() => {});
  assert.throws(() => director.schedule(6, 5, 1000), /outside/);
});