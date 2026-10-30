/** Source-independent, no-double-award wave director. Mirrors tested integration-kit behavior. */
export const earlyCallReward=ms=>Number.isFinite(ms)&&ms>0?Math.min(3,Math.ceil(ms/10000)):0;
export const formatCountdown=seconds=>{
 const s=Math.max(0,Math.ceil(seconds));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
};
export class WaveDirector {
 constructor(onStart){this.onStart=onStart;this.pending=null;this.lastStarted=0;this.total=0}
 schedule(wave,total,delayMs,now=performance.now()){
  if(!Number.isInteger(wave)||wave<1||wave>total||wave<=this.lastStarted||this.pending)throw Error('Wave cannot be scheduled');
  if(!Number.isFinite(delayMs)||delayMs<0)throw Error('Invalid wave delay');
  this.total=total;this.pending={wave,at:now+delayMs,start:now};
 }
 tick(now=performance.now()){if(this.pending&&now>=this.pending.at)return this.start('automatic',0);return null}
 callEarly(now=performance.now()){if(!this.pending||now>=this.pending.at)return null;return this.start('early',earlyCallReward(this.pending.at-now))}
 start(reason,bonusEnergy){const next=this.pending;if(!next)throw Error('No pending wave');this.pending=null;this.lastStarted=next.wave;const cue={wave:next.wave,reason,bonusEnergy};this.onStart(cue);return cue}
 snapshot(now=performance.now()){
  const p=this.pending;
  if(!p)return {label:this.total&&this.lastStarted>=this.total?'Final wave deployed':'Wave in progress',wave:null,timeText:'00:00',bonusEnergy:0,canCallEarly:false,progress:1};
  const remaining=Math.max(0,p.at-now);return {wave:p.wave,timeText:formatCountdown(remaining/1000),bonusEnergy:earlyCallReward(remaining),canCallEarly:remaining>0,progress:Math.max(0,Math.min(1,1-remaining/Math.max(1,p.at-p.start))),label:remaining>0?`Wave ${p.wave} in ${formatCountdown(remaining/1000)}`:`Wave ${p.wave} incoming`};
 }
 reset(){this.pending=null;this.lastStarted=0;this.total=0}
}