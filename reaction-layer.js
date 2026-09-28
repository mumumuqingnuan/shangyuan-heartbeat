/** Scratch integration helper. Uses the scene's simulation dt, never wall-clock timers. */
export class ReactionLayer {
 constructor(){this.items=new Map();this.seen=new Set();}
 clear(){this.items.clear();this.seen.clear();}
 put(actorId,{emotion='win',stage=0,encounterId='',ttl=1.15,delay=0,priority=3,ghost=null}={}){
  const token=encounterId?encounterId+':'+actorId+':'+emotion:null;
  if(token&&this.seen.has(token))return false;
  const old=this.items.get(actorId);if(old&&old.priority>priority)return false;
  if(token){this.seen.add(token);if(this.seen.size>128)this.seen.delete(this.seen.values().next().value);}
  this.items.set(actorId,{actorId,emotion,stage,encounterId,age:-delay,ttl,priority,ghost});return true;
 }
 step(dt,stage){for(const[id,r]of this.items){if(r.stage!==stage){this.items.delete(id);continue;}r.age+=Math.max(0,dt);if(r.age>=r.ttl)this.items.delete(id);}}
 get(id){const r=this.items.get(id);return r&&r.age>=0?r:null;}
 ghosts(){return [...this.items.values()].filter(r=>r.ghost&&r.age>=0);}
 beginEncounter(id){for(const[k,r]of this.items)if(r.encounterId!==id&&r.ghost)this.items.delete(k);}
}

const TEXT={win:'得意',lose:'呜…',pout:'哼！',sweat:'诶？',shy:'心动',smug:'承让',stomp:'不服'};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/** x/y are the actor's screen-space feet, matching Canvas scene coordinates. Call after beams. */
export function drawReactionTag(c,{x,y,scale=1,emotion='win',age=0,ttl=1.15,index=0,viewportWidth=1000,topSafe=80}){
 if(age<0||age>=ttl)return;
 const alpha=Math.min(1,age/.11,(ttl-age)/.22),appear=1+.09*Math.sin(Math.min(1,age/.2)*Math.PI),w=56*scale,h=32*scale;
 const bx=clamp(x+8*scale,w*.5+8,viewportWidth-w*.5-8),by=Math.max(topSafe+20,y-(254+(index%2)*24)*scale-Math.sin(Math.min(1,age/.3)*Math.PI)*5*scale);
 c.save();c.globalAlpha*=clamp(alpha,0,1);c.translate(bx,by);c.scale(appear,appear);c.lineJoin='round';c.lineCap='round';
 c.fillStyle=['lose','pout','sweat','stomp'].includes(emotion)?'#f7eef9':'#fff2d6';c.strokeStyle='#c2a79a';c.lineWidth=1.1*scale;
 c.beginPath();c.roundRect(-w/2,-h/2,w,h,10*scale);c.fill();c.stroke();
 c.beginPath();c.moveTo(-4*scale,h/2-1);c.lineTo(0,h/2+6*scale);c.lineTo(5*scale,h/2-1);c.fill();c.stroke();
 c.font=`500 ${15*scale}px LanternKai,"Songti SC",serif`;c.textAlign='center';c.textBaseline='middle';c.fillStyle='#8b596c';c.fillText(TEXT[emotion]||TEXT.win,0,0);
 if(['win','smug','shy'].includes(emotion)){
  c.strokeStyle='#d5ad56';c.lineWidth=1.8*scale;for(const[sx,sy]of[[-w*.62,-h*.4],[w*.58,-h*.8]]){c.beginPath();c.moveTo(sx-3*scale,sy);c.lineTo(sx+3*scale,sy);c.moveTo(sx,sy-4*scale);c.lineTo(sx,sy+4*scale);c.stroke();}
 }else{
  c.fillStyle='#a8cedd';c.beginPath();c.moveTo(w*.59,-h*.45);c.bezierCurveTo(w*.42,-h*.06,w*.69,h*.07,w*.67,-h*.1);c.quadraticCurveTo(w*.65,-h*.3,w*.59,-h*.45);c.fill();
 }
 c.restore();
}

// Portrait-specific eye/mouth anchors mapped from the unchanged 4x4 atlas to its 68px head draw.
const FACE={
 hero:{eye:[8,-179.5],mouth:[17.3,-169.7],skin:'#f4d4c3'},
 rival:{eye:[8.1,-179.5],mouth:[18,-169],skin:'#f3d2c0'},
 rival2:{eye:[9,-181.8],mouth:[20,-171.7],skin:'#f3d8d2'},
 rival3:{eye:[6.5,-179.5],mouth:[17,-169.5],skin:'#f6d8c6'}
};
function softOval(c,x,y,rx,ry,color,opacity=1){
 c.save();c.translate(x,y);c.scale(rx,ry);c.globalAlpha*=opacity;const g=c.createRadialGradient(0,0,.15,0,0,1);g.addColorStop(0,color);g.addColorStop(.69,color);g.addColorStop(1,'#ffffff00');c.fillStyle=g;c.beginPath();c.arc(0,0,1,0,Math.PI*2);c.fill();c.restore();
}
function sparkle(c,x,y,r,opacity=1){c.save();c.globalAlpha*=opacity;c.fillStyle='#ffe4a0';c.strokeStyle='#c9a764';c.lineWidth=.65;c.beginPath();c.moveTo(x,y-r);c.quadraticCurveTo(x+1.2,y-1.2,x+r*.66,y);c.quadraticCurveTo(x+1.2,y+1.2,x,y+r);c.quadraticCurveTo(x-1.2,y+1.2,x-r*.66,y);c.quadraticCurveTo(x-1.2,y-1.2,x,y-r);c.closePath();c.fill();c.stroke();c.restore();}
function tear(c,x,y,r=3){c.fillStyle='#a6d8ef';c.strokeStyle='#7aadc7';c.lineWidth=.55;c.beginPath();c.moveTo(x,y-r*1.7);c.bezierCurveTo(x-r*1.5,y,x-r*.8,y+r*1.7,x,y+r*1.7);c.bezierCurveTo(x+r*.9,y+r*1.7,x+r*1.4,y,x,y-r*1.7);c.fill();c.stroke();c.fillStyle='#f8feff';c.beginPath();c.ellipse(x-r*.25,y+r*.35,r*.23,r*.52,0,0,Math.PI*2);c.fill();}

/** Invoke immediately after painted head(), in the same local head transform. No image pixel changes. */
export function drawFaceAccent(c,{emotion='win',age=0,ttl=1.15,kind='hero'}={}){
 const alpha=clamp(Math.min(age/.09,(ttl-age)/.18),0,1);if(alpha<=0)return;
 const f=FACE[({rival4:"rival2",rival5:"rival3",rival6:"rival"})[kind]||kind]||FACE.hero,[ex,ey]=f.eye,[mx,my]=f.mouth;
 c.save();c.globalAlpha*=alpha;c.lineCap='round';c.lineJoin='round';
 if(['win','smug','shy'].includes(emotion)){
  softOval(c,ex+1,ey+8,6,3.4,'#ed9da8',.4);softOval(c,ex+17,ey+3.5,3.8,2.5,'#ed9da8',.34);
  // One brief wink; the far eye, brows, nose and hair remain the original painted art.
  const wink=clamp(Math.min((age-.07)/.08,(.76-age)/.13),0,1);
  if(wink>0){c.save();c.globalAlpha*=wink;softOval(c,ex,ey,6.4,3.8,f.skin);c.strokeStyle='#694749';c.lineWidth=1.1;c.beginPath();c.moveTo(ex-4.9,ey-.45);c.quadraticCurveTo(ex+.1,ey+3,ex+4.8,ey-1);c.stroke();c.lineWidth=.8;c.beginPath();c.moveTo(ex-4.2,ey+.1);c.lineTo(ex-6,ey-1.5);c.moveTo(ex-2.7,ey+.9);c.lineTo(ex-4,ey-.5);c.stroke();c.restore();}
  const pulse=.86+.14*Math.sin(age*15);sparkle(c,32,-217,6.7*pulse);sparkle(c,-24,-228,4.4,.85);
 }else{
  const pout=emotion==='pout'||emotion==='stomp';
  softOval(c,ex-1,ey+8,6.8,4.1,'#eaa4af',.43);softOval(c,ex+17,ey+4,4.4,3,'#eaa4af',.3);
  if(pout){
   // Small, feathered mouth patch becomes a readable three-shaped pout; face outline is untouched.
   softOval(c,mx,my,4.5,2.9,f.skin);c.strokeStyle='#a76677';c.lineWidth=1.1;c.beginPath();c.moveTo(mx-1.1,my-1.6);c.quadraticCurveTo(mx+3,my-1.8,mx+.6,my+.1);c.quadraticCurveTo(mx+3,my+1.6,mx-1.3,my+1.8);c.stroke();
   const xx=-19,yy=-211,rr=4.2*(1+Math.sin(age*17)*.07);c.strokeStyle='#c77e89';c.lineWidth=1.4;for(const[dx,dy]of[[-1,-1],[1,-1],[-1,1],[1,1]]){c.beginPath();c.moveTo(xx+dx*rr,yy+dy*1);c.quadraticCurveTo(xx+dx*1.4,yy+dy*1.4,xx+dx,yy+dy*rr);c.stroke();}
  }else if(emotion==='lose'){
   tear(c,ex-3,ey+7+Math.sin(Math.min(1,age/.65)*Math.PI)*4,2.9);tear(c,ex+18,ey+4,2.25);
   // A single curved worry mark sits outside the image's eye region.
   c.strokeStyle='#ab8798';c.lineWidth=1.1;c.beginPath();c.moveTo(-18,-214);c.quadraticCurveTo(-24,-212,-23,-205);c.stroke();
  }else{tear(c,32,-207+Math.sin(age*7)*2,4);}
 }
 c.restore();
}
