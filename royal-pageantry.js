/** Visual hierarchy for the five formal royal endings. These counts are game art, not historical claims. */
export const ROYAL_PAGEANTRY=Object.freeze({
 empress:{rank:5,guards:8,lanterns:12,standards:6,fireworks:5,canopy:2,color:'#d5b25f',accent:'#b7655b'},
 consort:{rank:4,guards:6,lanterns:8,standards:4,fireworks:3,canopy:1,color:'#d3b782',accent:'#c893a5'},
 crownPrincess:{rank:3,guards:4,lanterns:6,standards:2,fireworks:2,canopy:1,color:'#c9ae72',accent:'#b86d66'},
 princess:{rank:2,guards:2,lanterns:4,standards:2,fireworks:1,canopy:0,color:'#c5ad84',accent:'#a9786b'},
 heiress:{rank:1,guards:2,lanterns:2,standards:0,fireworks:0,canopy:0,color:'#c3b799',accent:'#98b3a4'}
});
const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/** Call after drawAtlas and BEFORE the scene drawer. It leaves actor space and captions clear. */
export function drawRoyalPageantry(S){
 const p=ROYAL_PAGEANTRY[S.scene];if(!p)return;const{c,w,h,z,g,t,clock,helpers}=S;
 c.save();
 // Side bands prevent ornaments from entering the hero/couple lane or the title's central column.
 c.beginPath();c.rect(0,0,w*.22,h*.81);c.rect(w*.78,0,w*.22,h*.81);c.clip();
 for(let j=0;j<p.lanterns;j++){
  const side=j%2?-1:1,k=Math.floor(j/2),count=p.lanterns/2;
  const xx=side<0?w*(.035+.16*(k%3)/2):w*(.965-.16*(k%3)/2),yy=h*(.09+.155*Math.floor(k/3));
  c.strokeStyle='#bfa371';c.lineWidth=z;c.beginPath();c.moveTo(xx,0);c.lineTo(xx,yy);c.stroke();
  helpers.lantern?.(c,xx,yy,(.46+p.rank*.035)*z,p.color,clock);
 }
 for(let j=0;j<p.standards;j++){
  const side=j%2?-1:1,k=Math.floor(j/2),xx=side<0?w*(.025+k*.063):w*(.975-k*.063),yy=g-240*z;
  c.strokeStyle=p.color;c.lineWidth=2*z;c.beginPath();c.moveTo(xx,g-6*z);c.lineTo(xx,yy-22*z);c.stroke();
  c.fillStyle=p.accent;c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+side*28*z,yy+4*z);c.lineTo(xx+side*24*z,yy+99*z);c.lineTo(xx,yy+91*z);c.closePath();c.fill();c.stroke();
  c.fillStyle=p.color;c.beginPath();c.ellipse(xx+side*12*z,yy+40*z,6*z,13*z,0,0,TAU);c.fill();
 }
 for(let j=0;j<p.guards;j++){
  const side=j%2?-1:1,k=Math.floor(j/2),xx=side<0?w*(.038+k*.049):w*(.962-k*.049),yy=g-(k%2)*20*z;
  helpers.drawCharacter?.(c,{id:'ceremony:'+S.scene+':'+j,x:xx,y:yy,scale:z*(.47+(j%2)*.025),kind:j%3?'scholar':'swordsman',pose:t>8?'bow':'idle',moving:false,motion:0,phase:0,opacity:1,time:clock,facing:-side});
 }
 if(t>7)for(let j=0;j<p.fireworks;j++){
  const life=((t-7)*.43+j/p.fireworks)%1,a=Math.sin(Math.PI*life)*.62,r=(10+life*(45+p.rank*6))*z;
  const xx=j%2?w*(.90-(j%3)*.025):w*(.10+(j%3)*.025),yy=h*(.16+(j%3)*.13);
  c.globalAlpha=a;c.strokeStyle=[p.color,'#efd6a9',p.accent][j%3];c.lineWidth=1.5*z;
  for(let k=0;k<22;k++){const an=k/22*TAU;c.beginPath();c.moveTo(xx+Math.cos(an)*r*.79,yy+Math.sin(an)*r*.79);c.lineTo(xx+Math.cos(an)*r,yy+Math.sin(an)*r);c.stroke();}c.globalAlpha=1;
 }
 c.restore();
 // Empress has the only double-tier golden ceremonial arch. It stays above the actors.
 if(p.canopy&&t>1){c.save();c.globalAlpha=clamp((t-1)/1.2,0,1)*.85;for(let tier=0;tier<p.canopy;tier++){
  const yy=h*.28-tier*18*z,left=w*.23+20*z*tier,right=w*.77-20*z*tier;
  c.strokeStyle=p.color;c.lineWidth=(tier?3:5)*z;c.beginPath();c.moveTo(left,yy+9*z);c.bezierCurveTo(w*.34,yy-24*z,w*.65,yy-24*z,right,yy+9*z);c.stroke();
  for(let k=0;k<7;k++){const xx=left+(right-left)*k/6;c.fillStyle=p.color;c.beginPath();c.ellipse(xx,yy+7*z-Math.sin(k/6*Math.PI)*18*z,2*z,4*z,0,0,TAU);c.fill();}
 }c.restore();}
}
