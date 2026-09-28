import { drawHuXiaohua } from './cat.js?v=53';
import { drawFaceAccent } from './reaction-layer.js?v=53';
/** V4 original Song romance art: generated painted heads + a newly drawn, articulated long-robe rig. */
export const GAIT_STRIDE_LENGTH=144;
export const CHARACTER_METRICS=Object.freeze({height:222,maxEffectHeight:258,groundY:0,strideLength:144,eye:{x:14,y:-180},hand:{x:34,y:-106},hold:{x:28,y:-112},pour:{x:43,y:-118}});
export const CHARACTER_KINDS=['hero','rival','rival2','rival3','rival4','rival5','rival6','scholar','champion','oilSeller','noble','prince','heir','crownPrince','emperor','swordsman','musician','doctor','merchant','ghost','visitor','cat'];
const INK='#5d4e50', TAU=Math.PI*2;
const HEAD_INDEX={hero:0,rival:1,rival2:2,rival3:3,rival4:2,rival5:3,rival6:1,scholar:4,champion:5,oilSeller:6,noble:7,prince:8,heir:9,crownPrince:10,emperor:11,swordsman:12,musician:13,doctor:7,merchant:6,ghost:14,visitor:15};
export const PORTRAIT_ATLAS=Object.freeze({file:'assets/portraits.png',width:1254,height:1254,columns:4,rows:4,index:HEAD_INDEX});
const OUTFITS=[
 {a:'#b7dace',b:'#679f90',light:'#faf2d9',edge:'#d9bd83',ribbon:'#e8baa8',motif:'#f6e5bf'},
 {a:'#e6a5ad',b:'#b6647b',light:'#fff0dc',edge:'#e5c086',ribbon:'#f1cb9d',motif:'#f9e2ce'},
 {a:'#c8bddf',b:'#897cab',light:'#f3eef9',edge:'#c9c5e2',ribbon:'#a8d9d4',motif:'#eee5fa'},
 {a:'#a6cddf',b:'#6296af',light:'#f3f5e7',edge:'#d0bd87',ribbon:'#e4c7e2',motif:'#edf3e8'},
 {a:'#f0dbac',b:'#bc9a60',light:'#fff5d8',edge:'#cead69',ribbon:'#d8848d',motif:'#fff0c1'},
 {a:'#dca798',b:'#a8534f',light:'#f8dfb0',edge:'#ddb971',ribbon:'#eebc69',motif:'#f7d18e'}
];
const SUITS={
 scholar:{a:'#b8cbe1',b:'#677e9e',light:'#edf1ef',edge:'#b6c4d2',ribbon:'#a5b8bd'},
 champion:{a:'#ad706d',b:'#764447',light:'#f8dfc4',edge:'#d3b878',ribbon:'#dcbc7c'},
 oilSeller:{a:'#b5c2bf',b:'#7a938e',light:'#e9e0c8',edge:'#bea98a',ribbon:'#ad8d65'},
 noble:{a:'#dddde8',b:'#959bb6',light:'#f9f6e7',edge:'#bcc7d0',ribbon:'#a8b8ce'},
 prince:{a:'#e8dcc0',b:'#bd9861',light:'#fffae6',edge:'#cca957',ribbon:'#a4bfb4'},
 heir:{a:'#8caeaa',b:'#4e7e7a',light:'#e7eeeb',edge:'#c7b37d',ribbon:'#88a9b8'},
 crownPrince:{a:'#e3c486',b:'#ae8042',light:'#fff0c6',edge:'#dcc076',ribbon:'#a95854'},
 emperor:{a:'#d6aa58',b:'#9b672c',light:'#ffe9a7',edge:'#f0d082',ribbon:'#a94743'},
 swordsman:{a:'#8391a8',b:'#4a5772',light:'#d7dfeb',edge:'#a9b4c3',ribbon:'#ba6868'},
 musician:{a:'#e1ddeb',b:'#a29bbc',light:'#faf5ff',edge:'#cec6e0',ribbon:'#a8cdc8'},
 doctor:{a:'#dae2cd',b:'#94a887',light:'#fbf4df',edge:'#c6bb91',ribbon:'#aac8bc'},
 merchant:{a:'#ddc8a1',b:'#a48459',light:'#fff0cd',edge:'#cdb16a',ribbon:'#ac7371'},
 ghost:{a:'#c0e1e7',b:'#83b0c5',light:'#effdff',edge:'#cae9f2',ribbon:'#b4cbea'},
 visitor:{a:'#bba5c6',b:'#7d668f',light:'#ede1e6',edge:'#d5b575',ribbon:'#81b9bb',skin:'#dfb798'}
};
let atlas=null,assetsPromise=null;
export async function loadCharacterAssets(options={}){
 if(atlas)return {atlas,metadata:PORTRAIT_ATLAS};
 if(assetsPromise)return assetsPromise;
 const src=typeof options==='string'?options:options.atlasURL||new URL('./assets/portraits.png',import.meta.url).href;
 assetsPromise=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{atlas=img;resolve({atlas,metadata:PORTRAIT_ATLAS});};img.onerror=()=>{assetsPromise=null;reject(new Error('Character artwork could not be loaded: '+src));};img.src=src;});
 return assetsPromise;
}
export function getGait(phase=0){const p=((phase%1)+1)%1;const f=q=>{q=((q%1)+1)%1;const grounded=q<.5,t=grounded?q*2:(q-.5)*2;return{x:grounded?36-72*t:-36+72*t,y:grounded?0:-27*Math.sin(Math.PI*t),grounded};};return{phase:p,strideLength:144,left:f(p),right:f(p+.5),bob:-1.5*Math.abs(Math.sin(TAU*p)),armSwing:Math.cos(TAU*p)};}
function S(c,fill,fn,stroke=INK,w=1){c.beginPath();fn(c);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=w;c.stroke();}}
function E(c,x,y,rx,ry,fill,stroke=null,w=1,angle=0){S(c,fill,q=>q.ellipse(x,y,rx,ry,angle,0,TAU),stroke,w);}
function L(c,points,color=INK,w=1){S(c,null,q=>{q.moveTo(...points[0]);for(const pt of points.slice(1))q.lineTo(...pt);},color,w);}
function C(c,a,b,d,e,color=INK,w=1){S(c,null,q=>{q.moveTo(...a);q.bezierCurveTo(...b,...d,...e);},color,w);}
function G(c,x,y,w,h,a,b){const g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function alpha(hex,a){const n=parseInt(hex.slice(1),16);return `rgba(${n>>16},${(n>>8)&255},${n&255},${a})`;}
function heart(c,x,y,r,color='#ec94ad'){S(c,color,q=>{q.moveTo(x,y+r*.75);q.bezierCurveTo(x-r*1.7,y-r*.1,x-r,y-r*1.3,x,y-r*.4);q.bezierCurveTo(x+r,y-r*1.3,x+r*1.7,y-r*.1,x,y+r*.75);q.closePath();},null);}
function flower(c,x,y,r=3,color='#f8e5c7'){for(let j=0;j<5;j++){const a=j*TAU/5;E(c,x+Math.cos(a)*r*.62,y+Math.sin(a)*r*.62,r*.55,r*.36,color,'#b59b84',.3,a);}E(c,x,y,r*.24,r*.24,'#c7a25d');}
function foliage(c,x,y,s,p){c.save();c.translate(x,y);c.scale(s,s);C(c,[0,4],[6,-7],[8,-14],[5,-24],p.edge,.6);for(const[k,yy]of[[-1,-7],[1,-13],[-1,-19]])S(c,p.motif||p.light,q=>{q.moveTo(5,yy+3);q.quadraticCurveTo(5+k*12,yy-10,5+k*13,yy-3);q.quadraticCurveTo(5+k*8,yy+3,5,yy+3);},p.edge,.4);flower(c,5,-23,4,p.motif||p.light);c.restore();}
function silkLine(c,a,b,d,e,p,w=1){C(c,a,b,d,e,p.b,w);C(c,[a[0]+1,a[1]],[b[0]+1,b[1]],[d[0]+1,d[1]],[e[0]+1,e[1]],p.light,.5);}
const clothStore=new WeakMap();
function clothState(c,key,time,target){let map=clothStore.get(c);if(!map){map=new Map();clothStore.set(c,map);}let s=map.get(key);if(!s){s={amp:target,t:time};map.set(key,s);}const dt=Math.min(.12,Math.max(0,time-s.t));s.amp+=(target-s.amp)*(1-Math.exp(-dt*8));s.t=time;return s.amp;}
function drawShoe(c,x,y,p,back){S(c,G(c,x,y-11,20,10,p.light,p.b),q=>{q.moveTo(x-7,y-9);q.quadraticCurveTo(x+1,y-12,x+8,y-7);q.quadraticCurveTo(x+17,y-9,x+19,y-5);q.quadraticCurveTo(x+22,y-1,x+12,y);q.lineTo(x-8,y);q.quadraticCurveTo(x-10,y-4,x-7,y-9);},INK,.8);C(c,[x-8,y-2],[x+1,y],[x+14,y],[x+19,y-4],back?'#bab1a1':'#efe3c8',1.1);flower(c,x+10,y-5,1.9,p.edge);}
function leg(c,foot,hipX,p,back){const hx=hipX,hy=-72,ax=foot.x,ay=foot.y-8,dx=ax-hx,dy=ay-hy,d=Math.hypot(dx,dy),off=Math.sqrt(Math.max(0,40*40-d*d/4)),kx=(hx+ax)/2-dy/d*off,ky=(hy+ay)/2+dx/d*off;S(c,back?p.b:p.light,q=>{q.moveTo(hx-6,hy);q.quadraticCurveTo(kx-5,ky,ax-5,ay);q.lineTo(ax+5,ay);q.quadraticCurveTo(kx+8,ky,hx+7,hy);q.closePath();},INK,.7);drawShoe(c,ax,foot.y,p,back);}
function ribbon(c,p,flow,time,back=true){const trail=flow*35,wave=Math.sin(time*8-1)*flow*7,x=-18;S(c,G(c,-65,-147,60,80,p.ribbon,p.light),q=>{q.moveTo(x,-147);q.bezierCurveTo(-44-trail*.4,-149-wave,-30-trail,-104+wave,-56-trail,-89+wave);q.bezierCurveTo(-64-trail,-79+wave,-38-trail,-65-wave,-54-trail,-52-wave);q.lineTo(-46-trail,-48-wave);q.bezierCurveTo(-28-trail,-64-wave,-49-trail,-77+wave,-43-trail,-87+wave);q.bezierCurveTo(-16-trail,-105+wave,-24-trail*.4,-143-wave,x+7,-141);q.closePath();},p.b,.65);C(c,[x,-144],[-42-trail*.4,-145-wave],[-24-trail,-106+wave],[-49-trail,-89+wave],p.light,.9);}
function hand(c,x,y,skin,angle=0){c.save();c.translate(x,y);c.rotate(angle-.1);S(c,G(c,-3,-5,8,13,'#fff0df',skin),q=>{q.moveTo(-2.7,-5);q.bezierCurveTo(-3.7,-1,-3.1,3,-1.8,6.5);q.quadraticCurveTo(-.8,9,.5,8);q.lineTo(2.7,3.6);q.quadraticCurveTo(5,3.5,5.1,1);q.quadraticCurveTo(4.8,-1,2,-1.5);q.lineTo(2.4,-4.8);q.closePath();},'#b99887',.6);C(c,[-.8,1],[-.3,3],[.2,5],[.2,6.5],'#cbb09b',.4);C(c,[2,-1],[3.7,.2],[3.7,1.7],[2.6,2.6],'#c29f8d',.4);c.restore();}
function arm(c,p,skin,pose,swing,front,female,flow){const sx=front?16:-18,sy=-146;let ex=sx+5+swing*13,ey=-126,wx=sx+10+swing*17,wy=-108+Math.abs(swing)*2;
 if(pose==='charmed'){ex=sx+15;ey=-123;wx=sx+19;wy=-104;}
 if(pose==='dance'){ex=sx+18;ey=-125+swing*5;wx=sx+34;wy=-121+swing*8;}
 if(pose==='celebrate'){ex=sx+(front?17:-21);ey=-166;wx=sx+(front?23:-20);wy=-193;}
 if(pose==='drum'){ex=sx+16;ey=-143-swing*9;wx=sx+30;wy=-154-swing*19;}
 if(pose==='hold'){ex=sx+18;ey=-128;wx=front?30:24;wy=-115;}
 if(pose==='pour'){ex=sx+19;ey=-137;wx=front?44:31;wy=front?-125:-109;}
 if(pose==='sit'){ex=sx+18;ey=-126;wx=front?38:28;wy=front?-128-swing*12:-112;}
 if(pose==='seated'){ex=sx+12;ey=-129;wx=front?25:15;wy=-112;}
 if(pose==='bow'||pose==='kneel'){ex=sx+16;ey=-128;wx=front?29:24;wy=-116;}
 const drop=female?24:17;
 S(c,G(c,sx-12,sy,33,56,front?p.a:p.b,p.light),q=>{q.moveTo(sx-8,sy-2);q.bezierCurveTo(ex-14-flow*3,ey-1,wx-17-flow*4,wy+drop,wx-8,wy+drop+1);q.quadraticCurveTo(wx+8,wy+drop,wx+7,wy-2);q.quadraticCurveTo(ex+11,ey-9,sx+8,sy+4);q.closePath();},INK,.85);
 S(c,G(c,wx-13,wy-8,20,30,alpha(p.b,0),alpha(p.b,.23)),q=>{q.moveTo(sx+7,sy+5);q.quadraticCurveTo(ex+5,ey+5,wx+3,wy+drop-2);q.quadraticCurveTo(wx-5,wy+drop+1,wx-9,wy+drop);q.bezierCurveTo(wx-3,wy+8,ex-3,ey+3,sx+7,sy+5);q.closePath();},null);
 C(c,[sx-4,sy+5],[ex-8,ey],[wx-13,wy+9],[wx-9,wy+drop-4],alpha(p.light,.7),2.2);
 S(c,p.light,q=>{q.moveTo(wx-7,wy-2);q.lineTo(wx+8,wy);q.lineTo(wx+6,wy+7);q.lineTo(wx-8,wy+4);q.closePath();},p.b,.65);
 silkLine(c,[sx-3,sy+6],[ex-7,ey+3],[wx-12,wy+17],[wx-9,wy+18],p,.7);
 hand(c,wx,wy+7,skin,swing*.2);
 if(pose==='drum'){L(c,[[wx,wy+8],[wx+23,wy-17]],'#92785b',3);E(c,wx+24,wy-18,3,5,'#e9d2aa',INK,.6,.6);}
 if(pose==='sit'&&front){L(c,[[wx+1,wy+6],[wx+7,wy-7]],'#b3a580',1.5);E(c,wx+8,wy-8,3.2,2.2,'#fff4d9',INK,.4);}
}
function costume(c,p,kind,gait,pose,flow,time){const female=kind.startsWith('rival')||kind==='hero',hem=pose==='kneel'?-54:pose==='sit'?-42:kind==='oilSeller'?-25:-13,sway=gait.armSwing*flow,side=flow*Math.sin(gait.phase*TAU)*5;
 // Long pleated underskirt: all folds follow the planted-foot gait, while cloth lags after stopping.
 S(c,G(c,-31,-120,62,100,p.light,p.a),q=>{q.moveTo(-14,-121);q.lineTo(17,-121);q.bezierCurveTo(19,-80,30+side,-43,36+side,hem-2);q.quadraticCurveTo(18+side,hem+6,2+side,hem+2);q.quadraticCurveTo(-19+side,hem+6,-34+side,hem-2);q.bezierCurveTo(-26+side,-45,-20,-83,-14,-121);q.closePath();},INK,.85);
 for(let i=0;i<10;i++){const t=i/9,x=-12+t*26,bx=-30+t*63+side;C(c,[x,-116],[x+(t-.5)*8,-79],[bx-(t-.5)*6,-44],[bx,hem+1],i%2?p.a:p.b,.55);C(c,[x+1,-114],[x+(t-.5)*8+1,-79],[bx-(t-.5)*6+1,-44],[bx+1,hem],p.light,.75);}
 for(let j=0;j<5;j++){const x=-11+j*5.5,bx=-27+j*13+side;S(c,G(c,bx-2,-109,7,96,alpha(p.b,.025),alpha(p.b,.2)),q=>{q.moveTo(x,-112);q.bezierCurveTo(x-1,-78,bx-2,-44,bx-3,hem+1);q.lineTo(bx+3,hem+1);q.bezierCurveTo(bx+1,-49,x+2,-85,x,-112);q.closePath();},null);}
 C(c,[-32+side,hem-1],[-13+side,hem+6],[15+side,hem+6],[34+side,hem-1],p.edge,1.4);
 // Two open beizi panels and fitted cross collar: slender waist, generous sleeves, ankle-length folds.
 for(const s of [-1,1])S(c,G(c,s<0?-29:1,-155,28,130,p.a,p.b),q=>{q.moveTo(s*5,-158);q.quadraticCurveTo(s*24,-153,s*23,-140);q.lineTo(s*17,-116);q.bezierCurveTo(s*20,-85,s*23+side,-52,s*29+side,hem-9);q.quadraticCurveTo(s*22+side,hem-3,s*12+side,hem-9);q.bezierCurveTo(s*9,-50,s*9,-94,s*5,-119);q.lineTo(s*1,-148);q.closePath();},INK,.75);
 for(const s of [-1,1]){C(c,[s*7,-149],[s*9,-126],[s*11,-63],[s*16+side,hem-10],p.edge,1.45);C(c,[s*10,-140],[s*14,-119],[s*18,-53],[s*22+side,hem-15],p.light,.8);}
 for(const s of[-1,1]){S(c,G(c,s*6,-145,s*16,33,alpha(p.b,0),alpha(p.b,.23)),q=>{q.moveTo(s*20,-147);q.quadraticCurveTo(s*9,-140,s*7,-122);q.lineTo(s*17,-117);q.quadraticCurveTo(s*14,-139,s*20,-147);q.closePath();},null);C(c,[s*17,-112],[s*11,-94],[s*19,-75],[s*20+side,-60],alpha(p.light,.6),1.4);}
 S(c,p.light,q=>{q.moveTo(-6,-158);q.lineTo(6,-144);q.lineTo(13,-156);q.lineTo(19,-150);q.lineTo(6,-132);q.lineTo(-15,-154);q.closePath();},p.b,.75);L(c,[[-4,-155],[6,-143],[13,-153]],p.edge,.7);
 S(c,G(c,-19,-123,38,13,p.b,p.a),q=>{q.moveTo(-18,-124);q.quadraticCurveTo(0,-119,18,-123);q.lineTo(19,-114);q.quadraticCurveTo(0,-108,-19,-113);q.closePath();},INK,.7);
 L(c,[[-18,-118],[0,-115],[18,-117]],p.edge,1);
 S(c,G(c,-18,-114,0,14,alpha(p.b,.28),alpha(p.b,0)),q=>{q.moveTo(-18,-112);q.quadraticCurveTo(0,-107,18,-113);q.lineTo(20,-99);q.quadraticCurveTo(0,-103,-20,-99);q.closePath();},null);
 S(c,p.ribbon,q=>{q.moveTo(7,-116);q.quadraticCurveTo(-5,-122,-7,-112);q.quadraticCurveTo(-1,-107,8,-114);q.quadraticCurveTo(14,-103,20,-110);q.quadraticCurveTo(18,-120,7,-116);q.closePath();},p.b,.6);E(c,8,-113,3.2,3.2,p.edge);
 for(const ss of[-1,1])S(c,G(c,0,-112,25,55,p.ribbon,p.light),q=>{q.moveTo(7+ss*2,-112);q.bezierCurveTo(8+ss*5-side,-90,9+ss*11-side*2,-80,5+ss*16-side*2,-68);q.lineTo(11+ss*16-side*2,-66);q.bezierCurveTo(15+ss*10-side*2,-87,13+ss*5-side,-98,10+ss*2,-112);q.closePath();},p.b,.5);
 if(female){foliage(c,-23+side,-41,.62,p);foliage(c,17+side,-60,.5,p);flower(c,-15,-140,2.8,p.motif);}
 else{
  foliage(c,-20+side,-52,.48,p);
  if(['prince','heir','crownPrince','emperor','noble'].includes(kind)){foliage(c,19+side,-77,.48,p);foliage(c,-15,-139,.42,p);}
  if(kind==='emperor'||kind==='crownPrince'){c.save();c.translate(0,-95);c.scale(.85,.85);C(c,[-4,3],[-20,-11],[19,-17],[5,-27],p.edge,3);for(let j=0;j<6;j++)E(c,Math.sin(j*.75)*8,-4-j*3.7,2.4,2,p.edge);E(c,5,-28,4,3,p.edge);L(c,[[7,-30],[11,-34],[10,-29]],p.edge,1.3);c.restore();}
 }
 if(kind==='swordsman'){c.save();c.translate(-20,-119);c.rotate(-.3);S(c,'#6f6675',q=>q.roundRect(-4,-4,8,78,2),INK,.8);S(c,p.edge,q=>q.roundRect(-10,-5,20,5,1),INK,.5);L(c,[[0,-23],[0,-5]],'#a46366',6);c.restore();}
 if(kind==='doctor'){S(c,'#b69e7d',q=>q.roundRect(-29,-105,14,24,4),INK,.6);L(c,[[-25,-94],[-19,-94]],p.light,1.5);L(c,[[-22,-97],[-22,-91]],p.light,1.5);}
 if(kind==='oilSeller'){L(c,[[-21,-144],[25,-101]],'#7b806d',4);S(c,'#d1b284',q=>q.roundRect(20,-99,12,30,4),INK,.7);E(c,26,-100,5,2,'#9b8058',INK,.5);}
 if(kind==='musician'){L(c,[[-24,-125],[-18,-80]],'#a8a383',4);for(let j=0;j<4;j++)E(c,-22+j,-113+j*7,.8,.8,'#5d766d');}
 if(kind==='merchant'){S(c,'#b3936f',q=>q.roundRect(18,-113,14,24,4),INK,.6);E(c,25,-101,3,3,p.edge);}
 if(kind==='visitor'){for(let j=0;j<9;j++){E(c,-12,-137+j*12,1.2,1.2,p.edge);E(c,14,-137+j*12,1.2,1.2,p.edge);}E(c,0,-117,5,4,p.edge,INK,.5);E(c,0,-117,2.5,2.5,'#82babc');}
}
function fallbackHead(c,kind){const skin=kind==='ghost'?'#def3fa':'#ffe3cf';E(c,3,-187,25,29,skin,'#8d736d',.7);S(c,'#3e3540',q=>{q.moveTo(-22,-185);q.bezierCurveTo(-34,-217,30,-224,29,-189);q.quadraticCurveTo(18,-209,4,-199);q.quadraticCurveTo(-8,-198,-13,-181);q.closePath();},INK,.7);for(const x of[-3,17]){E(c,x,-187,5,7,'#fff8f2',INK,.6);E(c,x+1,-186,3,5,'#8a6755');E(c,x,-189,1.1,1.4,'#fff');}C(c,[7,-173],[10,-172],[14,-172],[16,-174],'#ba7b7b',.7);}
function head(c,kind,pose,time){const i=HEAD_INDEX[kind]??4,cell=313.5;if(atlas)c.drawImage(atlas,(i%4)*cell,Math.floor(i/4)*cell,cell,cell,-34,-222,68,68);else fallbackHead(c,kind);
 if(pose==='charmed'||pose==='dance'){c.save();c.globalAlpha*=.55;E(c,11,-172,11,5,'#f9a4af');c.restore();heart(c,6,-181,4.7,'#ef82a6');heart(c,22,-185,4.2,'#ef82a6');}
}
function shock(c,time){const b='#282531',shake=Math.sin(time*57)*1.3;S(c,b,q=>{q.moveTo(-12,-155);q.quadraticCurveTo(0,-167,15,-151);q.lineTo(14,-73);q.lineTo(-13,-72);q.closePath();},b,1);E(c,2,-186,24,27,b);S(c,b,q=>{q.moveTo(-22,-193);for(const p of[[-27,-213],[-15,-206],[-12,-226],[-4,-209],[4,-229],[11,-209],[26,-221],[23,-202],[33,-211],[24,-184]])q.lineTo(...p);q.closePath();},b,1);
 for(const s of[-1,1]){C(c,[s*12,-151],[s*34,-169],[s*30,-195],[s*40,-219+shake],b,11);for(let j=0;j<4;j++)L(c,[[s*40-5+j*3,-218+shake],[s*42-5+j*3,-232+shake]],b,2.2);}
 S(c,b,q=>{q.moveTo(-12,-76);q.lineTo(0,-73);q.lineTo(-8,-37);q.lineTo(-7,-9);q.lineTo(-19,-8);q.lineTo(-22,-39);q.closePath();},b,1);S(c,b,q=>{q.moveTo(4,-77);q.quadraticCurveTo(43,-96,48,-75);q.lineTo(25,-42);q.lineTo(14,-48);q.lineTo(33,-73);q.lineTo(12,-62);q.closePath();},b,1);S(c,b,q=>{q.moveTo(-19,-9);q.lineTo(-6,-8);q.quadraticCurveTo(8,-3,5,0);q.lineTo(-22,0);q.closePath();},b,1);E(c,23,-43,12,4.5,b,null,1,.3);
}

export function drawCharacter(c,o={}){
 let {x=0,y=0,scale=1,facing=1,kind='hero',outfit=0,phase=0,pose='idle',time=0,opacity=1}=o;kind=['persian','foreign','foreigner'].includes(kind)?'visitor':kind;
 const eating=o.eating!==false&&pose!=='ride'&&pose!=='seated';if(pose==='ride'||pose==='seated')pose='sit';
 const female=kind==='hero'||kind.startsWith('rival'),p=kind==='hero'?OUTFITS[((outfit%OUTFITS.length)+OUTFITS.length)%OUTFITS.length]:kind==='rival'?OUTFITS[1]:kind==='rival2'?OUTFITS[3]:kind==='rival3'?OUTFITS[4]:kind==='rival4'?OUTFITS[2]:kind==='rival5'?OUTFITS[5]:kind==='rival6'?OUTFITS[0]:(SUITS[kind]||SUITS.scholar),skin=p.skin||'#f3d6bd';
 const moving=(pose==='run'||pose==='charmed')&&o.moving!==false,target=o.motion??(o.speed!==undefined?Math.min(1,Math.abs(o.speed)/500):(moving?1:0)),flow=clothState(c,o.id??o.actorId??kind+':'+outfit,time,target);
 c.save();c.translate(x,y);c.scale(scale*(facing<0?-1:1),scale);c.globalAlpha*=opacity*(kind==='ghost'?.8:1);c.lineJoin='round';c.lineCap='round';
 if(kind==='cat'){drawHuXiaohua(c,{phase,time,walking:o.moving===true||pose==='run',sitting:pose==='sit'});c.restore();return;}
 if(pose==='shock'){shock(c,time);c.restore();return;}
 if(pose==='fall'){c.translate(-83,-34);c.rotate(Math.PI/2);pose='idle';}
 const g=moving?getGait(phase):{phase,armSwing:0,bob:0,left:{x:-10,y:0},right:{x:9,y:0}};
 if(pose==='dance'){g.armSwing=Math.sin(phase*TAU);g.left={x:-10,y:-Math.max(0,g.armSwing)*7};g.right={x:10,y:-Math.max(0,-g.armSwing)*7};}
 if(pose==='drum'||pose==='sit'||pose==='pour')g.armSwing=Math.sin(phase*TAU);
 if(pose==='sit'){c.translate(0,76);for(const back of[true,false]){S(c,back?p.b:p.light,q=>{q.moveTo(-9,-78);q.lineTo(34,-73);q.quadraticCurveTo(48,-60,43,-30);q.lineTo(31,-29);q.lineTo(28,-58);q.lineTo(-9,-58);q.closePath();},INK,.7);drawShoe(c,37,-22+(back?-5:0),p,back);}}
 else if(pose==='kneel'){S(c,p.b,q=>{q.moveTo(-16,-31);q.quadraticCurveTo(25,-34,33,-15);q.lineTo(35,-3);q.lineTo(-12,-2);q.closePath();},INK,.8);drawShoe(c,27,0,p,false);c.translate(0,42);}
 else{leg(c,g.left,-7,p,true);leg(c,g.right,7,p,false);}
 c.save();c.translate(0,g.bob);const lean=pose==='bow'?.29:pose==='charmed'?.1:pose==='run'?.027:0;c.translate(0,-76);c.rotate(lean);c.translate(0,76);
 if(female)ribbon(c,p,flow,time);else if(['noble','heir','swordsman','musician','ghost'].includes(kind)){c.save();c.globalAlpha*=.7;ribbon(c,{...p,ribbon:p.b},flow*.8,time);c.restore();}
 S(c,G(c,-4,-164,14,14,'#e9c7af',skin),q=>q.roundRect(-4,-165,14,15,3),'#bda28e',.5);
 const armPose=pose==='sit'&&!eating?'seated':pose;
 arm(c,p,skin,armPose,-g.armSwing,false,female,flow);costume(c,p,kind,g,pose,flow,time);c.save();if(o.expression){c.translate(0,-168);c.rotate(Math.sin(time*9)*(['pout','stomp','lose'].includes(o.expression.emotion)?.09:.045));c.translate(0,168);}head(c,kind,pose,time);if(o.expression)drawFaceAccent(c,{...o.expression,kind});c.restore();arm(c,p,skin,armPose,g.armSwing,true,female,flow);
 if(pose==='sit'&&eating){S(c,'#edf0de',q=>{q.moveTo(16,-111);q.lineTo(53,-111);q.quadraticCurveTo(48,-96,35,-96);q.quadraticCurveTo(20,-99,16,-111);q.closePath();},INK,.7);E(c,35,-112,19,4,'#dbd1b7',INK,.5);for(const[xx,yy]of[[27,-114],[35,-116],[44,-113]])E(c,xx,yy,4.4,3.6,'#fff8e5','#bca88b',.4);C(c,[34,-124],[28,-129],[38,-134],[34,-139],'#c6cfbc',.7);}
 c.restore();if(pose==='charmed'){heart(c,-10,-240-Math.sin(time*3)*3,5);heart(c,17,-251-Math.sin(time*3+.8)*3,3.2,'#f4b1c8');}if(pose==='celebrate')for(let i=0;i<3;i++)heart(c,-31+i*29,-240-Math.sin(time*4+i)*5,4.5,['#e7a4b5','#d6bb7c','#a8cdbd'][i]);c.restore();
}

/** Portrait rectangle uses top-left (x,y). Real artwork, no body drawn. */
export function drawPortrait(c,{x=0,y=0,width=160,height=160,w,h,size,kind='hero',facing=1,opacity=1,...opts}={}){
 width=w??size??width;height=h??size??height;kind=['persian','foreign','foreigner'].includes(kind)?'visitor':kind;const i=HEAD_INDEX[kind]??4,cell=313.5;c.save();c.globalAlpha*=opacity;c.translate(x+(facing<0?width:0),y);if(facing<0)c.scale(-1,1);if(atlas)c.drawImage(atlas,(i%4)*cell,Math.floor(i/4)*cell,cell,cell,0,0,width,height);else{c.translate(width/2,height);c.scale(width/68,height/68);fallbackHead(c,kind);}c.restore();
}
export default drawCharacter;
