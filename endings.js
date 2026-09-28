import { drawHuXiaohua, drawCompanionCat } from './cat.js?v=53';
import { drawRoyalPageantry } from './royal-pageantry.js?v=53';
/**
 * Twenty-three original Song Lantern ending films.
 * Public drawing is deterministic from time, does not mutate game state, and balances save/restore.
 * Art atlas: a 2x2 grid, 0 palace / 1 plum courtyard / 2 oil-tea shop / 3 river boat deck.
 */
const TAU=Math.PI*2,INK='#514e49',PAPER='#fff0d1',GOLD='#c6a569',RED='#a94d52',JADE='#769a87';
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
const between=(t,a,b)=>smooth((t-a)/(b-a));
let atlas=null,assetPromise=null,atlasSource='';

export async function loadEndingAssets(atlasUrl=new URL('./assets/ending-atlas.png',import.meta.url)){
 const src=String(atlasUrl);
 if(atlas&&atlasSource===src)return{atlas,width:atlas.naturalWidth||atlas.width,height:atlas.naturalHeight||atlas.height};
 if(assetPromise&&atlasSource===src)return assetPromise;
 atlasSource=src;
 assetPromise=new Promise((resolve,reject)=>{
  if(typeof Image==='undefined'){reject(new Error('Ending atlas requires a browser image loader.'));return;}
  const image=new Image();image.decoding='async';
  image.onload=()=>{const w=image.naturalWidth||image.width,h=image.naturalHeight||image.height;if(w<4||h<4){reject(new Error('Ending atlas is empty.'));return;}atlas=image;resolve({atlas:image,width:w,height:h});};
  image.onerror=()=>{assetPromise=null;reject(new Error('Cannot load ending atlas: '+src));};
  image.src=src;
 });
 try{return await assetPromise;}catch(error){assetPromise=null;throw error;}
}

export const ENDING_EGGS={
 solo:{title:'彩蛋 · 全部都要',text:'掌柜问几位，知意伸出一根手指，又认真补了一句：“一位，三碗。”'},
 cat:{title:'彩蛋 · 真正的一家之主',text:'胡小花领来了一只黑猫和一只白猫。知意还没开口，它们已经替自己挑好了三个软枕。'},
 scholar:{title:'彩蛋 · 情诗太长',text:'书生的情诗写了三丈长。一阵春风吹来，情诗先替他围好了围巾。'},
 champion:{title:'彩蛋 · 红花归谁',text:'状元郎郑重献出红花，路过的小猫却看中了流苏。今夜的头彩，差点被一爪领走。'},
 oilSeller:{title:'彩蛋 · 稳手也心慌',text:'卖油郎看着她笑，手里的油仍一滴不偏——只是油瓶早已满了。'},
 noble:{title:'彩蛋 · 输给你也好',text:'世家公子算尽棋路，偏偏没算到她最后那一手。认输之后，还主动把茶也续满。'},
 prince:{title:'彩蛋 · 王——唔！',text:'随从刚要喊出身份，王爷便递过去一颗汤圆：“先吃，趁热。”'},
 princess:{title:'彩蛋 · 红绸被借走了',text:'王妃的红绸刚系成结，就被一只猫拖去做窝。王爷只好亲手再打一个。'},
 heir:{title:'彩蛋 · 马去哪儿了',text:'世子挑好最快的一匹马，她却指着旁边的小毛驴：“这个，走得稳。”'},
 heiress:{title:'彩蛋 · 箱底的聘礼',text:'世子妃打开行装，金玉底下藏着一整箱桂花糖。有人连出门的点心都想好了。'},
 swordsman:{title:'彩蛋 · 轻功失手',text:'侠客只顾看她，剑穗挂住了花灯。人还在耍帅，灯已经跟着走了。'},
 crownPrince:{title:'彩蛋 · 奏折留白',text:'太子记下她说的民情，空白处却画了三颗小心。她笑着替他圈出：“此处须改。”'},
 crownPrincess:{title:'彩蛋 · 东宫第一道命令',text:'太子妃的第一道“命令”是先吃早饭。太子连忙把厚厚的奏折换成了热粥。'},
 empress:{title:'彩蛋 · 凤印被占',text:'皇后正在议事，那只幽园的猫一跃坐上了印匣。天子只好先请“猫大人”让座。'},
 consort:{title:'彩蛋 · 花也会打喷嚏',text:'贵妃的团扇一摇，满枝牡丹都落了花粉。天子忍了又忍，还是打了个漂亮的喷嚏。'},
 ghost:{title:'彩蛋 · 汤圆穿过去了',text:'幽客伸手接汤圆，汤圆却穿过掌心。她换成一盏热灯：“这个，总能暖到你吧。”'},
 ghostReturn:{title:'彩蛋 · 还魂的第一件事',text:'晏青等了很久才见到天亮。重返人间后的第一句话，却是：“原来会饿，是真的。”'},
 visitor:{title:'彩蛋 · 学得最快的一句',text:'旅人还没学会“心上人”，倒先学会了“再来一碗”。连江里的鱼都听懂了。'},
 doctor:{title:'彩蛋 · 给自己把个脉',text:'医师替她诊过脉，转头又摸了摸自己的手腕。药方写到最后，只有四个字：“明日再见。”'},
 musician:{title:'彩蛋 · 漏掉的一拍',text:'笛师答应一曲只赠她，偏偏又漏了一拍。她替他轻轻拍上，那一拍就成了暗号。'},
 merchant:{title:'彩蛋 · 算来算去',text:'商家公子拨了三遍算盘，算出的答案总是一样：“还要给她再买一碗。”'},
 twoWorlds:{title:'彩蛋 · 船票怎么算',text:'旅人替三个人买船票，掌柜看着秤上轻飘飘的幽客犯了难：“这位……算半张？”'},
 festival:{title:'彩蛋 · 明年请早',text:'公子们在楼下跳得热闹，知意在楼上又添了一碗。掌柜悄悄挂出牌子：“明年请早。”'},
};
const movie=(panel,winner,captions)=>({panel,winner,captions});
export const ENDING_MOVIES={
 solo:movie(3,null,['良宵散场，今夜依然属于自己。','慢慢走，想吃什么就买什么。','一盏灯，一张桌，也足够热闹。','一位客人，三碗汤圆。']),
 cat:movie(1,null,['三花胡小花，循着鱼丸香来了。','知意蹲下身，胡小花伸出小白爪。','原来它还带着一黑一白两位朋友。','小爪子先替自己选好了软枕。']),
 scholar:movie(1,'scholar',['梅影深处，有人等着读你的回信。','你添一行，他写一行。','灯下的字，慢慢写成了一生。','情诗太长，春风替他围成了围巾。']),
 champion:movie(0,'champion',['宫门开，新科状元踏过长街。','金榜之外，他另有一桩欢喜。','红花赠你，往后并肩看春风。','一只小爪子，也想领走红花流苏。']),
 oilSeller:movie(2,'oilSeller',['油担放稳，铺子里刚点起晚灯。','他把一滴不偏的认真，留在你面前。','往后的烟火日子，也想这样稳稳接住。','手依然很稳——可瓶子已经满了。']),
 noble:movie(1,'noble',['世家庭院里，今日不论门第。','一盘棋，两盏茶，输赢都慢慢说。','她落下最后一子，他笑着认输。','棋输了，茶也该由他来续。']),
 prince:movie(3,'prince',['王爷换回普通衣衫，赴一场寻常的约。','江风正好，分一碗热汤圆。','身份放在一旁，心事说给彼此。','王——唔！先吃，趁热。']),
 princess:movie(0,'prince',['王府灯红，月下之约终于有了回音。','红绸牵起，两个人慢慢走近。','今后每年上元，都还要到街上来。','猫猫借走红绸，王爷只好再打一个结。']),
 heir:movie(3,'heir',['世子把行程图铺开，问你先看哪处山河。','棋盘上的马，已经跃跃欲试。','最快的坐骑牵来了，你却另有主意。','小毛驴走得稳，今日就选它。']),
 heiress:movie(1,'heir',['福印系上剑穗，王府也留一扇看世界的窗。','成礼之后，仍然可以一起远行。','新行装里，收好了两人的春天。','金玉底下，怎么是一整箱桂花糖？']),
 swordsman:movie(3,'swordsman',['城门将开，侠客等你一同上路。','剑与心意，都有了归处。','灯结系上剑穗，下一程并肩走。','只顾耍帅，花灯却被剑穗带跑了。']),
 crownPrince:movie(0,'crownPrince',['微服归来，太子仍记着街头的声音。','你指一处，他在册子上认真记一处。','天下很大，愿先听你把话说完。','奏折空白处，怎么画满了小心？']),
 crownPrincess:movie(0,'crownPrince',['同心笺展开，东宫迎来新的春天。','今后并肩做事，也并肩过日子。','礼成之后，先把千言万语慢慢说。','东宫第一道命令：先吃早饭。']),
 empress:movie(0,'emperor',['宫灯如昼，百姓的陈情送到御前。','她递上的，既是真心，也是担当。','凤冠落定，愿与你同看万家灯火。','凤印被占，请猫大人先让一让。']),
 consort:movie(0,'emperor',['牡丹开时，宫里仍记得御街的桂花香。','一柄团扇，遮不住最初的笑。','春光不负，心意也不必匆忙。','花粉飞来，有人实在忍不住了。']),
 ghost:movie(1,'ghost',['月色将淡，幽客的身影也轻了。','留一盏心灯，记住来时的路。','来年上元，梅影下还要再见。','汤圆穿过掌心，灯火却能留下。']),
 ghostReturn:movie(1,'ghost',['药方与心灯，守着将散的魂。','光一点点聚拢，终于留住了温度。','天亮了，他第一次踏稳人间的路。','重返人间第一件事：好饿。']),
 visitor:movie(3,'visitor',['江风吹开星图，远方的船也等着启程。','他指过许多港口，又轻轻指向你。','远方有海，眼前的人就是归处。','“再来一碗”，连江鱼都听懂了。']),
 doctor:movie(2,'doctor',['杏林晚灯，花茶仍温。','他认真替她诊脉，却不敢看她的眼睛。','这一回，不必再替心跳找借口。','给自己开的方子：明日再见。']),
 musician:movie(1,'musician',['梅影中响起一支，只准备送给你的曲子。','笛声婉转，你静静听。','一个空拍，恰好留给你的应和。','漏了一拍？那就算我们的暗号。']),
 merchant:movie(2,'merchant',['小铺收账，掌柜却迟迟没合上算盘。','珍宝不必有价签，心意也不用计较。','亲手做的灯，已经写好了重逢的日子。','算来算去：还要再买一碗。']),
 twoWorlds:movie(3,null,['一张星图，一盏心灯，坐到了同一条船上。','天涯与彼岸，今夜也有共同的归路。','船慢慢开，三段故事还远没有说完。','这位轻飘飘的客人，船票该怎么算？']),
 festival:movie(0,null,['三街灯火为你开，公子们齐齐登台。','左一下，右一下——别踩到衣摆。','鼓点再响一点，小姐还在楼上。','楼下继续跳，楼上又添了一碗。']),
};
function path(c,points,fill,stroke=INK,width=1.6){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function ellipse(c,x,y,rx,ry,fill,stroke=null,width=1.3){c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,TAU);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function line(c,x1,y1,x2,y2,color=INK,width=2){c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
function rect(c,x,y,w,h,fill,stroke=null,r=3){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=1.5;c.stroke();}}
function text(c,value,x,y,size=22,color=INK,align='center'){c.fillStyle=color;c.font=size+'px LanternKai, "Songti SC", serif';c.textAlign=align;c.textBaseline='alphabetic';c.fillText(value,x,y);}
function heart(c,x,y,size=9,color='#c57e83'){c.save();c.translate(x,y);c.scale(size/10,size/10);c.beginPath();c.moveTo(0,7);c.bezierCurveTo(-21,-5,-9,-18,0,-8);c.bezierCurveTo(9,-18,21,-5,0,7);c.fillStyle=color;c.fill();c.restore();}
function blossom(c,x,y,size,color='#d99ba5',angle=0){c.save();c.translate(x,y);c.rotate(angle);for(let k=0;k<5;k++){const a=k*TAU/5;ellipse(c,Math.cos(a)*size*.5,Math.sin(a)*size*.5,size*.5,size*.38,color);}ellipse(c,0,0,size*.2,size*.2,'#d5b563');c.restore();}
function shadow(c,x,y,z=1){ellipse(c,x,y+2*z,34*z,6*z,'#29423c25');}
function crown(c,x,y,z=1,royal='phoenix',angle=0){
 c.save();c.translate(x,y);c.rotate(angle);c.scale(z,z);
 path(c,[[-29,9],[-25,-6],[-14,-1],[-8,-19],[0,-9],[8,-19],[15,-1],[26,-7],[29,9]],'#d6b76d','#7c6546');
 line(c,-28,10,28,10,'#f2d48f',3);ellipse(c,0,1,5,7,'#b96666','#967347');
 for(const side of[-1,1]){if(royal==='phoenix'){c.beginPath();c.moveTo(side*9,-6);c.bezierCurveTo(side*24,-30,side*40,-26,side*43,-9);c.strokeStyle='#e3bd70';c.lineWidth=4;c.stroke();}
 for(let k=0;k<3;k++){const xx=side*(18+k*8);line(c,xx,4,xx,22+(k%2)*7,'#c6a262',1.2);ellipse(c,xx,24+(k%2)*7,2.3,3,'#f6ddb0');}}
 c.restore();
}
function scroll(c,x,y,w=140,h=80,z=1,label='',open=1,seal=false){
 c.save();c.translate(x,y);c.scale(z,z);const width=Math.max(8,w*clamp(open));
 rect(c,-width/2,-h/2,width,h,PAPER,'#a79164',1);for(const side of[-1,1]){rect(c,side*width/2-4,-h/2-6,8,h+12,'#8b7655','#6c654b',2);}
 for(let j=0;j<3;j++)line(c,-width*.34,-h*.18+j*15,width*.34,-h*.18+j*15,'#a69b7944',1);
 if(label&&open>.45)text(c,label,0,5,Math.min(23,width/(label.length+1)),'#806d51');if(seal&&open>.6){rect(c,width*.27,h*.12,17,19,'#b35152');text(c,'印',width*.27+8.5,h*.12+14,11,'#fff2db');}c.restore();
}
function bowl(c,x,y,z=1,{food=true,steam=true,color='#e0ece5'}={}){
 c.save();c.translate(x,y);c.scale(z,z);path(c,[[-32,-5],[-23,17],[-11,22],[13,22],[27,14],[33,-5]],color,'#7d9285',1.4);ellipse(c,0,-5,33,9,'#e6d1a8','#8b8b74');
 if(food)for(const [a,b]of[[-13,-6],[4,-9],[16,-3]])ellipse(c,a,b,9,7,'#fff6d9','#d9c7a3',.8);
 if(steam)for(let j=0;j<3;j++){c.beginPath();c.moveTo(-13+j*13,-18);c.bezierCurveTo(-25+j*13,-29,-3+j*13,-36,-12+j*13,-47);c.strokeStyle='#f7edce88';c.lineWidth=2;c.stroke();}c.restore();
}
function table(c,x,y,z=1,w=190){c.save();c.translate(x,y);c.scale(z,z);rect(c,-w/2,-76,w,12,'#987a59','#6c6150');rect(c,-w/2+13,-64,9,64,'#775f48');rect(c,w/2-22,-64,9,64,'#775f48');line(c,-w/2+18,-25,w/2-18,-25,'#897257',5);c.restore();}
function jar(c,x,y,z=1,fill=0,color='#80a298'){
 c.save();c.translate(x,y);c.scale(z,z);path(c,[[-12,-62],[-13,-49],[-26,-32],[-22,-5],[-14,2],[14,2],[22,-5],[26,-32],[13,-49],[12,-62]],'#d8e8decc','#677f73',1.5);
 c.save();c.beginPath();c.rect(-22,-36,44,39);c.clip();c.fillStyle=color;c.fillRect(-22,3-37*clamp(fill),44,37*clamp(fill));c.restore();rect(c,-15,-65,30,8,'#8b8364','#6a705b');rect(c,-14,-34,28,23,'#f7e6ba99');text(c,'油',0,-17,15,'#8b7755');c.restore();
}
function abacus(c,x,y,z,t,hearts=false){
 c.save();c.translate(x,y);c.scale(z,z);rect(c,-64,-35,128,70,'#6c6951','#585e48');rect(c,-56,-27,112,54,'#ead3a4');for(let k=0;k<7;k++){const xx=-45+k*15;line(c,xx,-27,xx,27,'#746d4e',2);for(let j=0;j<4;j++){const yy=-18+j*11+Math.sin(t*2+k)*3;ellipse(c,xx,yy,6,4.5,hearts?'#bb7576':'#a68c54');}}line(c,-57,-5,57,-5,'#71664e',4);c.restore();
}
function coin(c,x,y,z=1){ellipse(c,x,y,8*z,8*z,'#d5b363','#977c4b');rect(c,x-2*z,y-2*z,4*z,4*z,'#746c48',null,0);}
function chess(c,x,y,z,t,variant='go'){
 c.save();c.translate(x,y);c.scale(z,z);rect(c,-92,-48,184,100,'#d7bb86','#856f4d');for(let i=0;i<9;i++){line(c,-80+i*20,-38,-80+i*20,42,'#9b8159',.8);line(c,-80,-38+i*10,80,-38+i*10,'#9b8159',.8);}
 const count=Math.min(9,Math.floor(Math.max(0,t-3)*1.4));for(let i=0;i<count;i++){const px=-60+(i%5)*27,py=-26+Math.floor(i/5)*43+((i%2)*8);ellipse(c,px,py,8,7,i%2?'#f6ecd0':'#41594f','#7f7c62');if(variant==='xiangqi')text(c,['馬','車','兵'][i%3],px,py+3,9,i%2?'#a85450':'#efe5c4');}
 if(t>8&&variant==='go')line(c,-59,-24,48,-24,'#bc747180',3);c.restore();
}
function fan(c,x,y,z,t,open=1,color='#c8838f'){
 c.save();c.translate(x,y);c.rotate(Math.sin(t*2)*.12);c.scale(z,z);const radius=48,angle=1.15*clamp(open);c.beginPath();c.moveTo(0,0);c.arc(0,0,radius,-Math.PI/2-angle,-Math.PI/2+angle);c.closePath();c.fillStyle=color;c.fill();c.strokeStyle='#b29865';c.lineWidth=2;c.stroke();
 for(let i=0;i<=8;i++){const a=-Math.PI/2-angle+i*angle/4;line(c,0,0,Math.cos(a)*radius,Math.sin(a)*radius,'#e4c78b99',1);}
 line(c,0,0,0,22,'#b09861',4);c.restore();
}
function flute(c,x,y,z=1,angle=0){c.save();c.translate(x,y);c.rotate(angle);rect(c,-44*z,-4*z,88*z,8*z,'#cbb975','#96874f');for(let i=0;i<5;i++)ellipse(c,(-24+i*11)*z,0,1.4*z,1.4*z,'#827643');c.restore();}
function cat(c,x,y,z,t,color='#c7a884',facing=1,walking=false,coat='calico'){const draw=coat==='calico'?drawHuXiaohua:drawCompanionCat;draw(c,{x,y,scale:z,time:t,facing,walking,sitting:!walking,coat});}
function animal(c,x,y,z,t,donkey=false,walking=false){
 c.save();c.translate(x,y);c.scale(z,z);const col=donkey?'#928e83':'#ad8768';ellipse(c,-10,-45,51,27,col,'#696655');for(let i=0;i<4;i++){const xx=-43+i*25,phase=walking?Math.sin(t*8+i%2*Math.PI)*10:0;line(c,xx,-33,xx+phase,-1,col,9);line(c,xx+phase-4,0,xx+phase+7,0,'#565a50',5);}
 path(c,[[23,-54],[35,-101],[51,-96],[59,-55]],col);ellipse(c,52,-91,21,13,col,'#696655');line(c,40,-101,donkey?36:41,donkey?-141:-120,col,7);line(c,49,-102,donkey?52:52,donkey?-143:-121,col,6);ellipse(c,61,-92,2.1,2.5,'#414e48');line(c,-56,-52,-72,-34,col,7);rect(c,-30,-70,54,19,'#b15e5d','#75614b',5);c.restore();
}
function sword(c,x,y,z,angle=-.6){c.save();c.translate(x,y);c.rotate(angle);path(c,[[-4,-93],[0,-114],[4,-93],[3,10],[-3,10]],'#c1d0c9','#6b827b');rect(c,-20,6,40,5,'#b4a06c');rect(c,-5,13,10,25,'#775951');line(c,0,40,0,62,'#a85662',3);c.restore();}
function veil(c,x,y,z,amount=1){c.save();c.globalAlpha*=amount;c.translate(x,y);c.scale(z,z);path(c,[[-46,-18],[43,-18],[54,91],[0,112],[-54,91]],'#ac505add','#cdad71');for(const xx of[-28,0,28])line(c,xx,-5,xx*1.2,84,'#d4a46a66',1);blossom(c,0,30,10,'#d6b06a');c.restore();}
function notes(c,x,y,z,t,wrong=false){
 for(let i=0;i<5;i++){const p=((t*.34+i*.2)%1),xx=x+(p*135-35)*z,yy=y-Math.sin(p*Math.PI)*60*z;c.save();c.globalAlpha*=Math.sin(p*Math.PI);text(c,wrong&&i===2?'？':'♪',xx,yy,(18+i%2*6)*z,wrong?'#bc7a7d':'#648e81');c.restore();}
}
function petals(c,w,h,t,color='#d6a0aa',strength=15){for(let i=0;i<strength;i++){const p=(t*.07+i*.173)%1,x=(i*137.4+t*13)%w,y=p*h;blossom(c,x,y,4+i%3,color,i+t*.4);}}
function stars(c,x,y,w,h,t){for(let i=0;i<12;i++){const px=x+(i*67%w),py=y+(i*37%h),r=2+Math.sin(t*2+i)*1.1;line(c,px-r,py,px+r,py,'#d1c38f',1);line(c,px,py-r,px,py+r,'#e4d6a5',1);}}
function drawAtlas(c,w,h,panel,t,helpers,g){
 if(atlas){const aw=atlas.naturalWidth||atlas.width,ah=atlas.naturalHeight||atlas.height,pw=aw/2,ph=ah/2,sx=(panel%2)*pw,sy=Math.floor(panel/2)*ph,scale=Math.max(w/pw,h/ph),sw=w/scale,sh=h/scale;c.drawImage(atlas,sx+(pw-sw)/2,sy+(ph-sh)/2,sw,sh,0,0,w,h);}
 else if(helpers.drawBackdrop)helpers.drawBackdrop(c,{width:w,height:h,camera:0,stage:panel===0?1:panel===1?2:0,time:t,ground:g,day:true});
 else{const grad=c.createLinearGradient(0,0,0,h);grad.addColorStop(0,['#899996','#bac7b4','#cebaa0','#9fbdbc'][panel]);grad.addColorStop(1,'#ebe0c3');c.fillStyle=grad;c.fillRect(0,0,w,h);}
 const shade=c.createLinearGradient(0,h*.72,0,h);shade.addColorStop(0,'#183a3200');shade.addColorStop(1,'#203d3a9e');c.fillStyle=shade;c.fillRect(0,0,w,h);
}
function findWinner(state,type){return state?.npcs?.filter(n=>n.type===type&&state.wins?.includes(n.id)).sort((a,b)=>(b.earnedScore||0)-(a.earnedScore||0))[0];}
function makeStage(c,o,helpers,scene){
 const w=o.width,h=o.height,portrait=w<h,t=clamp(Number(o.time)||0,0,20),clock=Math.max(0,Number(o.time)||0),z=Math.min(h/700,w/(portrait?480:1000)),a=z*1.15,g=h*(portrait?.70:.79);
 const definition=ENDING_MOVIES[scene],winner=findWinner(o.state,definition.winner),outfit=typeof o.outfit==='string'?['jade','scarlet','moon'].indexOf(o.outfit):Number(o.outfit)||0;
 const S={c,w,h,t,clock,z,a,g,portrait,scene,definition,winner,outfit,beat:Number.isFinite(o.beat)?o.beat:clock*133/60,helpers,positions:[]};
 S.actor=(kind,x,{y=g,pose='idle',facing=kind==='hero'?1:-1,scale=a,opacity=1,from=null,enter=[3,5.4],phase=null,outfit:wear=outfit,royal=null,moving:walking=null,eating=true}={})=>{
  const p=from===null?1:between(t,...enter),xx=from===null?x:mix(from,x,p),moving=walking??(from!==null&&p>0&&p<1),walkPhase=from===null?0:Math.abs(xx-from)/(144*scale);
  shadow(c,xx,y,scale);helpers.drawCharacter(c,{id:'ending:'+scene+':'+kind+':'+S.positions.length,x:xx,y,kind,facing,scale,pose:moving?'run':pose,phase:phase??(moving?walkPhase:S.beat/2),time:clock,outfit:wear,opacity,moving,eating});
  if(royal)crown(c,xx,y-220*scale,scale*.8,royal);
  S.positions.push({kind,x:xx,y,moving,phase:phase??(moving?walkPhase:S.beat/2),scale});
  return{x:xx,y,scale,head:y-(pose==='sit'?146:pose==='kneel'?180:222)*scale,handX:xx+facing*34*scale,handY:y-(pose==='sit'?30:pose==='kneel'?64:106)*scale};
 };
 S.hero=(x,options={})=>S.actor('hero',x,options);
 S.man=(x,options={})=>S.actor(definition.winner||'scholar',x,options);
 S.pair=(options={})=>{const left=w*(portrait?.29:.37),right=w*(portrait?.71:.66);return{hero:S.hero(left,{from:-90*a,enter:[.7,3],...options.hero}),man:S.man(right,{from:w+80*a,enter:[1.3,3.6],...options.man})};};
 S.heartTrail=(x,y,n=6)=>{for(let i=0;i<n;i++){const p=((clock*.32+i/n)%1);heart(c,x+Math.sin(i*4)*25*z,y-p*110*z,(4+Math.sin(p*Math.PI)*4)*z,'#be7d8499');}};
 S.lantern=(x,y,scale=.7)=>{if(helpers.lantern)helpers.lantern(c,x,y,scale*z,'#e9c584',clock);else{ellipse(c,x,y,18*z*scale,25*z*scale,'#e8bd6f');line(c,x,y+20*z*scale,x,y+38*z*scale,GOLD,2);}};
 return S;
}
function drawSolo(S){
 const{c,w,g,z,t}=S;const enter=between(t,.7,4),x=mix(w*.08,w*.52,enter);S.hero(x,{pose:t>5?'sit':'idle',moving:enter>0&&enter<1,phase:Math.abs(x-w*.08)/(144*S.a),y:t>5?g-41*z:g});
 table(c,w*.67,g,z,140);for(let i=0;i<(t<8?1:3);i++)bowl(c,w*.66+(i-1)*34*z,g-(84+i%2*27)*z,.68*z);
 if(t>12){const p=between(t,12,15);bowl(c,mix(w*.86,w*.48,p),g-99*z,.8*z);S.heartTrail(w*.49,g-220*z,3);}
 S.lantern(w*.26,g-257*z,.75);
}
function drawCats(S){
 const{c,w,g,z,t}=S;S.hero(w*.42,{from:-80*z,enter:[.8,3],pose:t>3?'kneel':'idle'});
 bowl(c,w*.60,g-8*z,.75*z,{food:true,steam:false});const p=between(t,3.4,7.2);
 const curl=between(t,12,15);if(t>12)rect(c,w*.23,g-34*z,120*z,30*z,'#c7b29a','#897c65',12);
 cat(c,mix(mix(w+50*z,w*.61,p),w*.28,curl),g-30*z*curl-Math.sin(curl*Math.PI)*22*z,1.1*z,t,'#c9a887',-1,p<1||(curl>0&&curl<1));
 if(t>8){for(let i=0;i<2;i++){const q=between(t,8.4+i*.8,11+i*.8),target=w*(i?.75:.55);cat(c,mix(w+80*z,target,q),g+(i?8:-6)*z,(i?.78:.85)*z,t+i,['#e3d9c4','#88988b'][i],-1,q<1,i?'white':'black');}}
 if(t>12)S.heartTrail(w*.5,g-70*z,4);
}
function drawScholar(S){
 const{c,w,g,z,t}=S,p=S.pair({man:{pose:t>12?'charmed':t>3?'hold':'idle'}});
 const open=between(t,3,6);scroll(c,w*.51,g-109*z,150,87,z,'与卿书',open);
 if(t>5){for(let k=0;k<Math.min(5,Math.floor((t-5)*2));k++)line(c,w*.455+k*15*z,g-116*z,w*.455+k*15*z,g-101*z,'#7b7964',1.5);}
 if(t>8){const len=between(t,8,11)*90*z;rect(c,w*.515,g-62*z,42*z,len,PAPER,'#bda878',1);}
 if(t>12){const q=between(t,12,14);c.save();c.translate(p.man.x,p.man.head+65*S.a);c.rotate(Math.sin((t-12)*3)*.07*q);rect(c,-42*z,-8*z,85*z,28*z,'#f4e7c4','#b8a47a');line(c,-30*z,0,25*z,0,'#8b8a6b',1);c.restore();S.heartTrail(p.hero.x,g-240*z,4);}
}
function drawChampion(S){
 const{c,w,g,z,t}=S,p=S.pair({man:{pose:t>8?'celebrate':'idle'}});
 c.save();c.translate(p.man.x,g-131*S.a);c.rotate(-.28);rect(c,-12*z,-31*z,24*z,126*z,'#b35355','#ceac72');text(c,'新科',0,17*z,17*z,'#eed9a0');c.restore();
 const gift=between(t,4,8),x=mix(p.man.x-35*z,p.hero.x+25*z,gift);blossom(c,x,g-125*z,18*z,'#bb565d');line(c,x,g-116*z,x+4*z,g-74*z,'#af565b',4*z);
 if(t>8){scroll(c,w*.5,g-313*z,190,57,z,'金榜题名',between(t,8,10),true);}
 if(t>12){const q=between(t,12,15);cat(c,mix(w+70*z,x+22*z,q),g,.75*z,t,'#acb79f',-1,q<1);line(c,x,g-76*z,mix(x,x+25*z,q),g-39*z,'#b4515d',2*z);}
}
function drawOil(S){
 const{c,w,g,z,t}=S,p=S.pair({hero:{pose:'idle'},man:{pose:t>3?'pour':'idle'}});
 table(c,w*.52,g,z,164);jar(c,w*.47,g-78*z,.68*z,between(t,3.5,9),'#c6aa55');
 const angle=-between(t,3.6,5)*.85,px=w*.58,py=g-164*z;c.save();c.translate(px,py);c.rotate(angle);jar(c,0,0,.56*z,.9,'#c6aa55');c.restore();
 if(t>4.4){c.beginPath();c.moveTo(px-19*z,py-13*z);c.quadraticCurveTo(w*.48,g-150*z,w*.47,g-115*z);c.strokeStyle='#d4b96b';c.lineWidth=(t>12?4:2)*z;c.stroke();}
 if(t>12){const spill=between(t,12,16);ellipse(c,w*.47,g-76*z,spill*47*z,7*z,'#cfb26099');heart(c,w*.49,g-218*z,13*z);S.heartTrail(p.man.x,g-225*z,3);}
}
function drawNoble(S){
 const{c,w,g,z,t}=S;S.pair({hero:{pose:'idle'},man:{pose:t>9?'charmed':'idle'}});table(c,w*.52,g,z,215);chess(c,w*.52,g-79*z,z*.87,t);
 if(t>8){ellipse(c,w*.52+27*z,g-95*z,8*z,6*z,'#f5ebce','#92816a');heart(c,w*.43,g-216*z,12*z);}
 const pour=between(t,12,15);bowl(c,w*.62-pour*80*z,g-104*z,.48*z,{food:false,steam:true});if(t>12){c.beginPath();c.moveTo(w*.62-pour*80*z,g-110*z);c.quadraticCurveTo(w*.5,g-128*z,w*.45,g-90*z);c.strokeStyle='#bdae6a99';c.lineWidth=2*z;c.stroke();}
}
function drawPrince(S){
 const{c,w,g,z,t}=S,p=S.pair({man:{pose:t>8?'charmed':'idle'}});table(c,w*.51,g,z,135);bowl(c,w*.51,g-86*z,.83*z);S.lantern(w*.51,g-286*z,.65);
 if(t>8){const q=between(t,8,11),x=mix(w+70*z,w*.85,q),scale=S.a*.63;S.actor('heir',x,{scale,pose:t>13?'charmed':'idle',facing:-1,moving:q>0&&q<1,phase:Math.abs(x-(w+70*z))/(144*scale)});if(t<13)text(c,'王——',x,g-164*z,20*z,'#936d58');
 if(t>12){const r=between(t,12,13.3),xx=mix(p.man.x+25*z,x-13*z,r),yy=g-118*z-Math.sin(r*Math.PI)*54*z;ellipse(c,xx,yy,8*z,7*z,'#fff0cf');if(r===1)text(c,'唔！',x,g-161*z,20*z,'#aa7770');}}
}
function drawPrincess(S){
 const{c,w,g,z,t}=S,p=S.pair({hero:{outfit:1},man:{pose:t>8?'celebrate':'idle'}});
 c.save();c.strokeStyle='#b65f65';c.lineWidth=7*z;c.beginPath();c.moveTo(p.hero.handX,p.hero.handY);c.quadraticCurveTo(w*.62,g-64*z,p.man.handX,p.man.handY);c.stroke();c.restore();
 if(t>=3)veil(c,p.hero.x,p.hero.head+21*z,S.a*.93,t<8?1:1-between(t,8,10));if(t>8)crown(c,p.hero.x,p.hero.head,S.a*.72,'phoenix');
 blossom(c,w*.52,g-92*z,13*z,'#b3515e');if(t>12){const q=between(t,12,16),cx=mix(w*.51,w*.83,q);cat(c,cx,g,.8*z,t,'#e0d7c1',1,q<1);line(c,w*.52,g-92*z,cx-23*z,g-20*z,'#b65f65',4*z);}
}
function drawHeir(S){
 const{c,w,g,z,t}=S;S.hero(w*.28,{from:-80*z,enter:[.7,3]});S.man(w*.70,{from:w+80*z,enter:[1,3.4],pose:t>12?'charmed':'idle'});
 table(c,w*.49,g,z,155);chess(c,w*.49,g-83*z,z*.65,t,'xiangqi');if(t>8){const q=between(t,8,11);animal(c,mix(w+110*z,w*.76,q),g+18*z,.75*z,t,false,q<1);}
 if(t>12){const q=between(t,12,16);animal(c,mix(-130*z,w*.31,q),g+25*z,.85*z,t,true,q<1);text(c,'这个，稳。',w*.3,g-260*z,21*z,'#758467');}
}
function drawHeiress(S){
 const{c,w,g,z,t}=S,p=S.pair({hero:{outfit:1},man:{pose:t>9?'charmed':'idle'}});sword(c,p.man.x-43*z,g-67*z,.8*z,-.2);if(t>3){const q=between(t,3,7);line(c,mix(p.hero.x+22*z,p.man.x-44*z,q),g-99*z,p.man.x-44*z,g-70*z,'#739b8b',3*z);ellipse(c,p.man.x-42*z,g-65*z,9*z,12*z,'#a5c4a4','#738d71');}
 rect(c,w*.5-69*z,g-44*z,138*z,45*z,'#98755c','#70634d',6);if(t>8){const open=between(t,8,11);c.save();c.translate(w*.5,g-44*z);c.rotate(-open*.5);rect(c,-69*z,-17*z,138*z,19*z,'#b9956b','#79664d',4);c.restore();}
 if(t>12){for(let i=0;i<10;i++){const q=clamp((t-12-i*.12)/2),xx=w*.5+Math.sin(i*8)*q*98*z,yy=g-40*z-Math.sin(q*Math.PI)*63*z;ellipse(c,xx,yy,7*z,5*z,['#e2bf75','#b5915c','#efd0a1'][i%3]);}text(c,'桂花糖',w*.5,g-96*z,23*z,'#987756');}
}
function drawSwordsman(S){
 const{c,w,g,z,t}=S,p=S.pair({man:{pose:t>13?'charmed':'idle'}});
 const angle=-.7+Math.sin(t*1.4)*.08;sword(c,p.man.x-29*z,g-90*z,.96*z,angle);const lift=between(t,8,12),lx=p.man.x-69*z,ly=g-241*z+lift*87*z;S.lantern(lx,ly,.69);
 if(t>8)line(c,p.man.x-49*z,g-47*z,lx,ly-35*z,'#b36970',2*z);
 if(t>12){const pull=Math.sin((t-12)*3)*8*z;line(c,p.man.x-51*z+pull,g-51*z,lx+pull,ly-36*z,'#b36970',2*z);text(c,'……等等。',p.man.x,g-288*z,21*z,'#7e6f64');}
}
function drawCrownPrince(S){
 const{c,w,g,z,t}=S,p=S.pair();table(c,w*.51,g,z,207);scroll(c,w*.51,g-83*z,175,84,z,'米 · 桥 · 灯',between(t,3,6));
 if(t>4){for(let i=0;i<3;i++){const q=between(t,4+i,5+i);line(c,p.hero.x+31*z,g-123*z,w*.46+i*37*z*q,g-101*z,'#9d917144',2);}}
 if(t>8){scroll(c,w*.53,g-198*z,137,74,z,'同心知民',between(t,8,10),true);}
 if(t>12){for(let i=0;i<3;i++)heart(c,w*.45+i*30*z,g-91*z,7*z);text(c,'此处须改。',p.hero.x,g-278*z,21*z,'#8e8268');}
}
function drawCrownPrincess(S){
 const{c,w,g,z,t}=S,p=S.pair({hero:{outfit:1},man:{pose:t>8?'celebrate':'idle'}});S.lantern(w*.27,g-289*z,.65);S.lantern(w*.74,g-289*z,.65);
 if(t>3){scroll(c,w*.52,g-108*z,163,81,z,'同心笺',between(t,3,7),true);}
 if(t>8){crown(c,p.hero.x,p.hero.head,S.a*.67,'phoenix');line(c,p.hero.x+25*z,g-94*z,p.man.x-25*z,g-94*z,'#c0927c',3*z);}
 if(t>12){table(c,w*.51,g,z,172);for(let i=0;i<4;i++)rect(c,w*.43+i*8*z,g-(97+i*6)*z,78*z,7*z,'#e4d7b4','#ae9b75');const q=between(t,12,16);bowl(c,mix(w*.80,w*.53,q),g-93*z,.9*z);text(c,'先吃早饭。',w*.51,g-264*z,23*z,'#8c7664');}
}
function drawEmpress(S){
 const{c,w,g,z,t}=S;
 for(const side of[-1,1]){const xx=w*.5+side*w*.19;rect(c,xx-47*z,g-103*z,94*z,104*z,'#93644e','#c6ab76',5);rect(c,xx-35*z,g-91*z,70*z,58*z,'#b99764','#e0c993',4);}
 const p=S.pair({hero:{outfit:1,pose:t>8?'celebrate':t>3?'hold':'idle'},man:{pose:'idle'}});
 if(t>3)scroll(c,w*.51,g-115*z,171,86,z,'万家灯火',between(t,3,7),true);
 if(t>8){crown(c,p.hero.x,p.hero.head,S.a*.88,'phoenix');for(let i=0;i<8;i++){const a=i*TAU/8,r=55+between(t,8,11)*50;line(c,p.hero.x+Math.cos(a)*r*z,p.hero.head+Math.sin(a)*r*z,p.hero.x+Math.cos(a)*(r+16)*z,p.hero.head+Math.sin(a)*(r+16)*z,'#d9bc7566',2*z);}}
 if(t>12){const q=between(t,12,15),y=g-20*z-Math.sin(q*Math.PI)*77*z;rect(c,w*.51-22*z,g-30*z,44*z,30*z,'#b58a56','#745d42');cat(c,mix(w*.81,w*.51,q),q===1?g-28*z:y,.72*z,t,'#c8bc9f',-1,q<1);text(c,'请猫大人让座。',w*.51,g-301*z,21*z,'#927354');}
}
function drawConsort(S){
 const{c,w,g,z,t}=S,sneeze=t>12&&(t-12)%3<.34,p=S.pair({hero:{outfit:1,pose:t>3?'hold':'idle'},man:{pose:sneeze?'bow':'idle'}});fan(c,p.hero.x+28*z,g-130*z,z*1.1,t,between(t,3,6),'#bd8291');
 if(t>8){for(let i=0;i<7;i++){const xx=w*.17+i*w*.11;line(c,xx,g,xx,g-50*z,JADE,3*z);blossom(c,xx,g-62*z,18*z*between(t,8+i*.15,10.5),'#bc7f91');}blossom(c,p.hero.x-28*z,p.hero.head+10*z,12*z,'#c28697');}
 if(t>12){petals(c,w,g,t,'#d49bab',22);fan(c,p.man.x-25*z,g-155*z,z*.75,t*3,1,'#cda4a0');text(c,t%3<.6?'阿嚏！':'',p.man.x,g-294*z,25*z,'#a77775');}
}
function drawGhost(S){
 const{c,w,g,z,t}=S;const p=S.pair({man:{opacity:t<8?.76:mix(.76,.28,between(t,8,12)),y:g-16*z+Math.sin(t*2)*7*z,pose:'charmed'}});
 const carry=between(t,3,8);S.lantern(mix(p.hero.x+35*z,w*.51,carry),g-116*z,.86);stars(c,w*.28,g-312*z,w*.44,135*z,t);
 if(t>12){const q=((t-12)/3)%1;ellipse(c,mix(p.hero.x+31*z,p.man.x+20*z,q),g-122*z+Math.pow(q,2)*135*z,8*z,7*z,'#f7eacf');heart(c,w*.51,g-162*z,10*z,'#cda3a7');}
}
function drawGhostReturn(S){
 const{c,w,g,z,t}=S;S.hero(w*.29,{from:-80*z,enter:[.7,3]});const q=between(t,7.5,10.5),step=between(t,10.5,12),x=mix(w*.70,w*.61,step);if(q<1)S.actor('ghost',w*.70,{opacity:1-q,y:g-17*z+Math.sin(t*2)*5*z});if(q>0)S.actor('scholar',x,{opacity:q,moving:step>0&&step<1,phase:Math.abs(x-w*.70)/(144*S.a)});
 S.lantern(w*.5,g-94*z,.83);jar(c,w*.44,g-13*z,.54*z,.8,'#9bb39a');if(t>3&&t<11){for(let i=0;i<9;i++){const a=t*2+i*TAU/9;ellipse(c,x+Math.cos(a)*58*z,g-122*z+Math.sin(a)*138*z,2*z,4*z,'#dce4b4aa');}}
 if(t>8){const glow=c.createLinearGradient(0,0,0,g);glow.addColorStop(0,'#f6dfaa55');glow.addColorStop(1,'#f6dfaa00');c.fillStyle=glow;c.fillRect(0,0,w,g);}
 if(t>12){table(c,w*.5,g,z,156);for(let i=0;i<3;i++)bowl(c,w*.5+(i-1)*32*z,g-(85+(i%2)*25)*z,.62*z);text(c,'好饿。',x,g-275*z,25*z,'#8c8b6d');}
}
function drawVisitor(S){
 const{c,w,g,z,t}=S,p=S.pair({man:{pose:t>8?'charmed':'idle'}});table(c,w*.51,g,z,189);scroll(c,w*.51,g-84*z,170,85,z,'海 · 星 · 归处',between(t,3,6));stars(c,w*.435,g-118*z,126*z,60*z,t);
 if(t>8){for(let i=0;i<4;i++){const yy=g+19*z+i*12*z;c.beginPath();for(let j=0;j<20;j++){const xx=j*w/19,y=yy+Math.sin(j*.7+t*1.4)*3*z;j?c.lineTo(xx,y):c.moveTo(xx,y);}c.strokeStyle='#c4d7c199';c.lineWidth=2*z;c.stroke();}}
 if(t>12){const words=['再','来','一','碗'];for(let i=0;i<4;i++){const px=w*.42+i*28*z,py=g-252*z+Math.sin(t*3+i)*6*z;rect(c,px-12*z,py-23*z,24*z,31*z,PAPER,'#a9956e');text(c,words[i],px,py,20*z,'#9b6e5d');}bowl(c,p.man.x-20*z,g-94*z,.63*z);}
}
function drawDoctor(S){
 const{c,w,g,z,t}=S,p=S.pair();table(c,w*.52,g,z,150);rect(c,w*.47,g-94*z,60*z,16*z,'#acc1a6','#7e927b',7);const pulse=t>3?Math.sin(t*(t>12?16:5))*10*z:0;
 line(c,p.hero.x+27*z,g-111*z,w*.52,g-93*z,'#d6ba9b',7*z);line(c,p.man.x-26*z,g-111*z,w*.52+5*z,g-101*z+Math.sin(t*4)*3*z,'#d9b89b',7*z);
 if(t>8)scroll(c,w*.5,g-213*z,147,72,z,t>12?'明日再见':'早睡 · 温茶',between(t,8,10));
 if(t>12){for(let i=0;i<3;i++)heart(c,p.man.x+(i-1)*24*z,g-(241+i%2*18)*z-pulse*.3,8*z);text(c,'我也……诊一诊。',p.man.x,g-291*z,20*z,'#9a7a6d');}
}
function drawMusician(S){
 const{c,w,g,z,t}=S,p=S.pair({man:{pose:t>12?'charmed':t>3?'hold':'idle'}});flute(c,p.man.x-26*z,g-162*S.a,z,.09+Math.sin(t*2)*.025);
 if(t>3)notes(c,p.man.x-45*z,g-188*z,z,t,t>12);if(t>8){heart(c,w*.48,g-200*z,11*z);S.heartTrail(p.hero.x,g-230*z,3);}
 if(t>12){const clap=Math.sin((t-12)*133/60*Math.PI);ellipse(c,p.hero.x+33*z+clap*3*z,g-132*z,5*z,9*z,'#efd4b4');ellipse(c,p.hero.x+43*z-clap*3*z,g-132*z,5*z,9*z,'#efd4b4');text(c,t%3<.5?'噗。':'',p.man.x,g-280*z,22*z,'#b68f88');}
}
function drawMerchant(S){
 const{c,w,g,z,t}=S,p=S.pair({man:{pose:t>8?'charmed':'idle'}});table(c,w*.51,g,z,196);abacus(c,w*.53,g-91*z,z*.85,t,t>12);if(t>3){for(let i=0;i<4;i++)coin(c,w*.41+i*13*z,g-83*z,z*.8);}
 if(t>8){S.lantern(p.hero.x+25*z,g-108*z,.59);scroll(c,w*.54,g-220*z,146,66,z,'心意无价',between(t,8,10));}
 if(t>12){const q=((t-12)/3)%1;coin(c,mix(w*.55,p.hero.x+21*z,q),g-115*z-Math.sin(q*Math.PI)*38*z,.75*z);bowl(c,p.hero.x+23*z,g-79*z,.53*z);}
}
function drawTwoWorlds(S){
 const{c,w,g,z,t}=S;const a=S.a*(S.portrait?.78:.92);S.hero(w*.49,{scale:a,from:-80*z,enter:[.7,3]});S.actor('visitor',w*.21,{scale:a,from:-80*z,enter:[1.4,4]});S.actor('ghost',w*.78,{scale:a,from:w+80*z,enter:[1.2,4],opacity:.72,y:g-12*z+Math.sin(t*2)*6*z});
 scroll(c,w*.40,g-90*z,114,66,z,'星图',between(t,3,7));S.lantern(w*.63,g-86*z,.61);
 if(t>8){stars(c,w*.2,g-315*z,w*.6,150*z,t);for(let i=0;i<4;i++)line(c,w*.10,g+(14+i*13)*z,w*.90,g+(14+i*13)*z,'#b7d0bd66',1.6*z);}
 if(t>12){const xx=w*.70,yy=g-44*z;line(c,xx,yy-50*z,xx,yy+20*z,'#a98f59',3*z);const ang=Math.sin(t*3)*.10;c.save();c.translate(xx,yy-45*z);c.rotate(ang);line(c,-47*z,0,47*z,0,GOLD,3*z);for(const side of[-1,1]){line(c,side*39*z,0,side*39*z,25*z,GOLD,1);ellipse(c,side*39*z,29*z,19*z,5*z,'#b89e62');}c.restore();text(c,'半张？',w*.79,g-265*z,22*z,'#a08b68');}
}
// Small, deterministic material details keep the vehicles in the same painted palette as the atlas.
function wood(c,x,y,w,h,z=1,dark=false){
 const grad=c.createLinearGradient(x,y,x,y+h);grad.addColorStop(0,dark?'#9e7560':'#bd9a72');grad.addColorStop(.18,dark?'#745444':'#987458');grad.addColorStop(.63,dark?'#584638':'#775b47');grad.addColorStop(1,dark?'#886650':'#a4805e');
 rect(c,x,y,w,h,grad,'#584b3dcc',2*z);
 c.save();c.beginPath();c.rect(x+z,y+z,w-2*z,h-2*z);c.clip();
 const lines=Math.max(2,Math.floor(h/(7*z)));for(let i=0;i<lines;i++){const yy=y+(i+.6)*h/lines;c.beginPath();c.moveTo(x-5*z,yy);c.bezierCurveTo(x+w*.27,yy+Math.sin(i*3)*3*z,x+w*.62,yy-Math.cos(i*5)*2*z,x+w+5*z,yy+z);c.strokeStyle=i%2?'#e4c49433':'#362e2329';c.lineWidth=.65*z;c.stroke();}
 c.restore();line(c,x+z,y+z,x+w-z,y+z,'#e7cb9999',.85*z);
}
function cloud(c,x,y,w,h,color='#d4b887',weight=1){
 c.save();c.translate(x,y);c.scale(w/100,h/40);c.beginPath();c.moveTo(-45,10);c.bezierCurveTo(-60,-6,-24,-20,-25,-2);c.bezierCurveTo(-25,8,-41,4,-36,-2);c.bezierCurveTo(-22,-10,-14,12,0,7);c.bezierCurveTo(15,0,18,-19,32,-9);c.bezierCurveTo(44,-1,29,6,27,-1);c.bezierCurveTo(48,-17,62,3,43,10);c.moveTo(-35,17);c.bezierCurveTo(-9,7,5,28,34,13);c.strokeStyle=color;c.lineWidth=weight;c.stroke();c.restore();
}
function lattice(c,x,y,w,h,z=1){
 const cells=Math.max(2,Math.round(w/(48*z))),step=w/cells;
 wood(c,x,y,w,5*z,z,true);wood(c,x,y+h-5*z,w,5*z,z,true);
 for(let i=0;i<=cells;i++){const xx=x+i*step;wood(c,xx-2*z,y,4*z,h,z,true);ellipse(c,xx,y-2*z,3.4*z,3*z,'#cfb17a','#785b42',.7*z);}
 for(let i=0;i<cells;i++){const cx=x+(i+.5)*step,cy=y+h*.50,rx=Math.max(6*z,step*.34),ry=h*.32;
  path(c,[[cx-rx,cy],[cx,cy-ry],[cx+rx,cy],[cx,cy+ry]],null,'#8a6951',3.2*z);path(c,[[cx-rx,cy-z],[cx,cy-ry-z],[cx+rx,cy-z],[cx,cy+ry-z]],null,'#d8bb83',.8*z);
  ellipse(c,cx,cy,3.1*z,3.1*z,'#bd9968','#654f3a',.6*z);
 }
}
function silkCurtain(c,x,y,w,h,z,t,side=1,rose=true){
 const sway=Math.sin(t*1.7+x*.01)*3*z,grad=c.createLinearGradient(x-w*.5,y,x+w*.5,y);grad.addColorStop(0,rose?'#744a4c':'#576f64');grad.addColorStop(.35,rose?'#b78279':'#91a693');grad.addColorStop(.56,rose?'#d9ada0':'#b4c0a3');grad.addColorStop(1,rose?'#855659':'#638575');
 c.save();c.beginPath();c.moveTo(x-w/2,y);c.lineTo(x+w/2,y);c.bezierCurveTo(x+w*.38,y+h*.38,x+side*w*.13+sway,y+h*.61,x+side*w*.12+sway,y+h*.68);c.bezierCurveTo(x+side*w*.50+sway,y+h*.86,x+side*w*.54,y+h*.97,x+side*w*.56,y+h);c.bezierCurveTo(x+side*w*.10,y+h*1.07,x-side*w*.20,y+h*.94,x-side*w*.2,y+h*.72);c.bezierCurveTo(x-w*.35,y+h*.46,x-w*.48,y+h*.20,x-w/2,y);c.closePath();c.fillStyle=grad;c.fill();c.strokeStyle='#d6bd84';c.lineWidth=1.05*z;c.stroke();c.clip();
 for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(x+i*w*.16,y);c.bezierCurveTo(x+i*w*.15,y+h*.37,x+side*w*.16+i*w*.04+sway,y+h*.65,x+side*w*.39+i*w*.11,y+h);c.strokeStyle=i%2?'#f4d8b138':'#53393e30';c.lineWidth=2*z;c.stroke();}
 for(let row=0;row<4;row++)for(let col=0;col<2;col++)blossom(c,x+(col-.5)*w*.38,y+(row+.65)*h*.21,3.3*z,'#e4c89877',row);
 c.restore();const tieX=x+side*w*.1+sway,tieY=y+h*.68;line(c,tieX-w*.23,tieY,tieX+w*.22,tieY+2*z,'#d8bf88',2.2*z);for(let i=0;i<3;i++)line(c,tieX+(i-1)*2*z,tieY+2*z,tieX+(i-1)*3*z+Math.sin(t*2)*2*z,tieY+23*z,'#d4b16d',1.1*z);ellipse(c,tieX,tieY+4*z,3*z,4*z,'#b9935c');
}
function pavilionRoof(c,l,r,y,z=1,rose=true){
 const grad=c.createLinearGradient(0,y-37*z,0,y+22*z);grad.addColorStop(0,rose?'#5b4846':'#445f58');grad.addColorStop(.38,rose?'#a77b70':'#859c87');grad.addColorStop(.70,rose?'#77534f':'#506f64');grad.addColorStop(1,'#d1b38a');
 c.beginPath();c.moveTo(l-30*z,y+3*z);c.bezierCurveTo(l-7*z,y+6*z,l+9*z,y-12*z,l+22*z,y-34*z);c.quadraticCurveTo((l+r)/2,y-42*z,r-22*z,y-34*z);c.bezierCurveTo(r-9*z,y-12*z,r+7*z,y+6*z,r+30*z,y+3*z);c.lineTo(r+22*z,y+15*z);c.quadraticCurveTo((l+r)/2,y+6*z,l-22*z,y+15*z);c.closePath();c.fillStyle=grad;c.fill();c.strokeStyle='#554b3e';c.lineWidth=1.8*z;c.stroke();
 c.save();c.clip();const count=Math.max(8,Math.round((r-l)/(18*z)));for(let i=0;i<=count;i++){const xx=mix(l+22*z,r-22*z,i/count),bottom=mix(l-27*z,r+27*z,i/count);c.beginPath();c.moveTo(xx,y-35*z);c.quadraticCurveTo(mix(xx,bottom,.4),y-7*z,bottom,y+12*z);c.strokeStyle=i%2?'#e7cba55c':'#372f2d44';c.lineWidth=1.35*z;c.stroke();}
 for(let k=0;k<3;k++){c.beginPath();c.moveTo(l,y-25*z+k*12*z);c.quadraticCurveTo((l+r)/2,y-35*z+k*13*z,r,y-25*z+k*12*z);c.strokeStyle='#e1c49650';c.lineWidth=.7*z;c.stroke();}c.restore();
 for(const offset of[0,8]){c.beginPath();c.moveTo(l-29*z,y+3*z+offset*z);c.quadraticCurveTo((l+r)/2,y+15*z+offset*z,r+29*z,y+3*z+offset*z);c.strokeStyle=offset?'#72563e':'#debd7e';c.lineWidth=offset?4*z:2.4*z;c.stroke();}
 wood(c,l-10*z,y+17*z,r-l+20*z,10*z,z,true);for(let i=0;i<8;i++){const xx=mix(l,r,i/7);cloud(c,xx,y+22*z,22*z,8*z,'#dfc28b',.7);line(c,xx,y+29*z,xx,y+38*z,'#b49361',1.4*z);ellipse(c,xx,y+40*z,2.3*z,3*z,'#e6c988');}
 for(const x of[l+21*z,r-21*z]){ellipse(c,x,y-34*z,5*z,4*z,'#b99562','#594c37',.8*z);line(c,x,y-37*z,x,y-43*z,'#d4b77f',1.3*z);}cloud(c,(l+r)/2,y-35*z,53*z,13*z,'#d5b67e',1.2);
}
// Whole vehicles enter and travel in world space. Passengers move with the deck;
// sedan bearers take ground-contact steps driven by the vehicle's travelled distance.
function boatLayer(S,front=false){
 const{c,w,g,z,t,scene}=S,l=w*.08,r=w*.91,deck=g+9*z;
 if(!front){
  ellipse(c,w*.5,deck+28*z,w*.44,34*z,'#5b8c8777');
  const deckTone=c.createLinearGradient(0,deck-21*z,0,deck+7*z);deckTone.addColorStop(0,'#d0b995');deckTone.addColorStop(.4,'#a48a67');deckTone.addColorStop(1,'#78634c');path(c,[[l,deck-4*z],[l+22*z,deck-20*z],[r-32*z,deck-20*z],[r,deck-4*z]],deckTone,'#6c7c66',2*z);
  for(let i=0;i<16;i++)line(c,l+(r-l)*i/16,deck-17*z,l+(r-l)*i/16+15*z,deck-2*z,i%2?'#e8d2ac66':'#6e5c4655',.9*z);
  lattice(c,l+23*z,deck-64*z,r-l-56*z,45*z,z*.8);
  if(scene==='prince'){
   for(const side of[-1,1])wood(c,w*.51+side*w*.26-4*z,g-287*z,8*z,deck-g+279*z,z,true);
   pavilionRoof(c,w*.21,w*.81,g-290*z,z,true);silkCurtain(c,w*.25,g-264*z,47*z,142*z,z,t,1,true);silkCurtain(c,w*.77,g-264*z,47*z,142*z,z,t,-1,true);
   for(let i=0;i<4;i++)S.lantern(w*.28+i*w*.15,g-267*z,.5);
  }else if(scene==='visitor'){
   wood(c,w*.83-3*z,g-315*z,6*z,deck-g+315*z,z,true);
   const sail=c.createLinearGradient(w*.65,0,w*.83,0);sail.addColorStop(0,'#b4b8a0dd');sail.addColorStop(.35,'#e5ddbcf0');sail.addColorStop(1,'#f1e6c9e8');path(c,[[w*.83,g-304*z],[w*.83,g-133*z],[w*.65,g-152*z]],sail,'#a99a77',1.5*z);for(let j=1;j<6;j++)line(c,w*.83,g-(304-j*27)*z,mix(w*.83,w*.65,j/6),g-(304-j*25.3)*z,'#b9ae8e88',.8*z);line(c,w*.83,g-304*z,w*.91,deck-10*z,'#d6c29b99',.8*z);
   stars(c,w*.73,g-281*z,w*.07,103*z,t);
  }else S.lantern(w*.5,g-290*z,.9);
 }else{
  const hull=c.createLinearGradient(0,deck-17*z,0,deck+57*z);hull.addColorStop(0,'#abc0a3');hull.addColorStop(.27,'#809e8a');hull.addColorStop(.63,'#536f66');hull.addColorStop(1,'#385650');
  path(c,[[l-15*z,deck-14*z],[l+35*z,deck+55*z],[r-38*z,deck+55*z],[r+24*z,deck-30*z],[r-35*z,deck+8*z],[l+30*z,deck+8*z]],hull,'#d7be82',2*z);
  for(const yy of[19,48])line(c,l+28*z,deck+yy*z,r-32*z,deck+yy*z,'#cdb681aa',1.5*z);
  for(let i=0;i<10;i++){const xx=l+47*z+i*(r-l-94*z)/9;cloud(c,xx,deck+33*z,53*z,23*z,i%2?'#c5c5a77a':'#d4bb8488',.85);line(c,xx-30*z,deck+23*z,xx-30*z,deck+45*z,'#1d494133',.65*z);}
  for(const xx of[l+44*z,r-45*z]){ellipse(c,xx,deck+33*z,13*z,14*z,'#728e77','#d5bc85',1.3*z);blossom(c,xx,deck+32*z,8*z,'#d4bc83');}
  lattice(c,l+29*z,deck-16*z,r-l-64*z,29*z,z*.72);
  // A small carved phoenix prow distinguishes a Song pleasure boat from a flat platform.
  const x=r+3*z;c.beginPath();c.moveTo(x,deck+5*z);c.bezierCurveTo(x+44*z,deck-35*z,x+6*z,deck-86*z,x+35*z,deck-91*z);c.strokeStyle='#9c8b5b';c.lineWidth=15*z;c.stroke();c.strokeStyle='#e1c886';c.lineWidth=7*z;c.stroke();ellipse(c,x+37*z,deck-94*z,14*z,10*z,'#ccba83','#7f8060');ellipse(c,x+42*z,deck-97*z,1.8*z,2*z,INK);path(c,[[x+48*z,deck-96*z],[x+65*z,deck-89*z],[x+48*z,deck-88*z]],'#bb8560');for(let j=0;j<3;j++){line(c,x+(28+j*6)*z,deck-102*z,x+(24+j*9)*z,deck-(115+j%2*6)*z,'#b8a56f',1.3*z);ellipse(c,x+(24+j*9)*z,deck-(115+j%2*6)*z,2*z,3*z,'#d0bb7e');}
  for(let i=0;i<5;i++){c.save();c.translate(l+z,deck);c.rotate(-.56+i*.19);ellipse(c,0,-34*z,8*z,43*z,['#738e79','#99806f','#b4aa7c','#a58885','#607f72'][i],'#d3ba81',.8*z);ellipse(c,0,-50*z,4*z,8*z,'#d6bd82');ellipse(c,0,-50*z,2*z,4*z,'#7c8d7a');c.restore();}
  for(let i=0;i<4;i++){const xx=l+(r-l)*(i+.3)/4,yy=deck+65*z+Math.sin(t*2+i)*3*z;c.beginPath();c.moveTo(xx,yy);c.quadraticCurveTo(xx+35*z,yy-9*z,xx+70*z,yy);c.strokeStyle='#d4e0c388';c.lineWidth=2*z;c.stroke();}
 }
}
function sedanLayer(S,front=false){
 const{c,w,g,z,t,scene}=S,cx=w*.45,l=w*.23,r=w*.67,seat=g-79*z;
 if(!front){
  wood(c,l,seat-107*z,r-l,107*z,z,true);
  const count=3,pw=(r-l-20*z)/count;for(let i=0;i<count;i++){const xx=l+10*z+i*pw,rose=scene==='princess',pad=c.createLinearGradient(0,seat-99*z,0,seat-8*z);pad.addColorStop(0,rose?'#b88f7a':'#8e9e8b');pad.addColorStop(.52,rose?'#8b6759':'#617c70');pad.addColorStop(1,rose?'#c09b83':'#adbaa0');rect(c,xx+3*z,seat-98*z,pw-6*z,89*z,pad,'#d5b983',2*z);rect(c,xx+8*z,seat-93*z,pw-16*z,78*z,null,'#e3c99288',3*z);cloud(c,xx+pw/2,seat-74*z,pw*.68,24*z,'#e4c89b88',1.05);cloud(c,xx+pw/2,seat-37*z,pw*.57,21*z,'#d2b47b88',.85);blossom(c,xx+pw/2,seat-57*z,7*z,rose?'#c6a481':'#c1c4a0');}
  const cushion=c.createLinearGradient(0,seat-20*z,0,seat+3*z);cushion.addColorStop(0,'#f1d9ab');cushion.addColorStop(.45,'#ceb18e');cushion.addColorStop(1,'#96765b');rect(c,cx-48*z,seat-19*z,96*z,23*z,cushion,'#d3bb87',7*z);for(let i=0;i<7;i++)line(c,cx-39*z+i*13*z,seat-15*z,cx-36*z+i*13*z,seat-13*z,'#fff0c4aa',.7*z);
  for(const x of[l,r]){wood(c,x-4*z,seat-209*z,8*z,210*z,z,true);for(const yy of[27,151,203])rect(c,x-6*z,seat-yy*z,12*z,5*z,'#cbb180','#806a4f',1);}
  pavilionRoof(c,l,r,seat-206*z,z,scene==='princess');const cw=Math.min(57*z,(r-l)*.20);silkCurtain(c,l+10*z,seat-177*z,cw,135*z,z,t,1,scene==='princess');silkCurtain(c,r-10*z,seat-177*z,cw,135*z,z,t,-1,scene==='princess');
  for(const x of[l,r])S.lantern(x,seat-168*z,.38);
 }else{
  wood(c,w*.04,seat+8*z,w*.84,9*z,z,true);line(c,w*.04,seat+9*z,w*.88,seat+9*z,'#d2b984',1.1*z);
  for(const x of[w*.07,w*.84])for(let i=0;i<3;i++)line(c,x+i*3*z,seat+8*z,x+i*3*z,seat+17*z,'#d8ba8199',.8*z);
  wood(c,l-9*z,seat+3*z,r-l+18*z,31*z,z,true);rect(c,l-6*z,seat+6*z,r-l+12*z,24*z,null,'#dfc38d',2*z);
  const count=Math.max(3,Math.round((r-l)/(81*z)));for(let i=0;i<count;i++)cloud(c,l+(i+.5)*(r-l)/count,seat+17*z,54*z,16*z,'#e1c188',.85);blossom(c,cx,seat+17*z,11*z,'#b7807a');ellipse(c,cx,seat+17*z,3*z,4*z,'#e5c887');
  lattice(c,l+3*z,seat-28*z,r-l-6*z,29*z,z*.70);
  if(t>12)cat(c,w*.73,g+5*z,.66*z,t,'#d0bea0',-1,true);
 }
}
function drawTransport(S,drawer,vehicle){
 const{c,w,z,t}=S,startX=w*1.2,q=between(t,.35,3),drift=between(t,3,20)*w*.13,dx=(1-q)*startX-drift,distance=startX-dx,bob=Math.sin(t*2.3)*(vehicle==='boat'?3:1.4)*z;
 const original={actor:S.actor,pair:S.pair,hero:S.hero,man:S.man},begin=S.positions.length;
 c.save();c.translate(dx,bob);
 try{
  if(vehicle==='boat'){
   boatLayer(S,false);
   S.actor=(kind,x,o={})=>original.actor(kind,x,{...o,from:null,moving:o.moving??false});
   S.pair=(o={})=>({hero:S.hero(w*(S.portrait?.29:.37),{...o.hero}),man:S.man(w*(S.portrait?.71:.66),{...o.man})});
   drawer(S);boatLayer(S,true);
  }else{
   sedanLayer(S,false);
   for(const [kind,x]of[['scholar',w*.14],['swordsman',w*.77]]){const scale=S.a*.71;S.actor(kind,x,{scale,moving:t>.35,phase:distance/(144*scale),facing:-1});}
   S.pair=(o={})=>({hero:S.hero(w*.45,{...o.hero,pose:'sit',eating:false,y:S.g-79*z,scale:S.a*.94}),man:S.man(w*.90,{...o.man,moving:t>.35,phase:distance/(144*S.a*.69),scale:S.a*.69,facing:-1})});
   drawer(S);sedanLayer(S,true);
  }
 }finally{Object.assign(S,original);c.restore();for(let i=begin;i<S.positions.length;i++){S.positions[i].x+=dx;S.positions[i].y+=bob;}}
}
function fireworks(c,w,h,t,z){
 for(let j=0;j<3;j++){const p=((t*.32+j*.31)%1),x=w*(.20+j*.30),y=h*(.18+(j%2)*.10),r=(20+p*106)*z;c.save();c.globalAlpha*=Math.sin(p*Math.PI)*.75;
  for(let i=0;i<20;i++){const a=i*TAU/20,xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r+p*p*27*z;line(c,xx,yy,x+Math.cos(a)*(r-12*z),y+Math.sin(a)*(r-12*z)+p*p*27*z,['#e5c685','#cca7b5','#a8c9b8'][j],1.8*z);}c.restore();}
}
function drawFestival(S){
 const{c,w,h,z,t,clock,beat}=S,scale=Math.min(w/950,h/720),floor=h*.85,step=250*scale,pan=between(t,5,12),base=floor+pan*(h*.55-(floor-3*step+65*scale)),towerW=Math.min(w*.86,1040*scale);
 if(t>12)fireworks(c,w,h,t,scale);
 const winners=S.state?.npcs?.filter(n=>S.state.wins.includes(n.id))||[];
 for(let tier=0;tier<3;tier++){const y=base-tier*step,bw=towerW*(1-tier*.15),x=(w-bw)/2;
 rect(c,x,y-step+28*scale,bw,step-20*scale,'#a56f60','#c9af7a',2);
 for(let j=0;j<14;j++)rect(c,x+j*bw/14,y-step+31*scale,bw/14,step-23*scale,j%2?'#eed6ae':'#b77564');
 rect(c,x-15*scale,y,bw+30*scale,15*scale,'#9d7853','#d7b778');line(c,x,y-19*scale,x+bw,y-19*scale,'#d7b87d',5*scale);
 if(tier<2){const count=Math.min(6,Math.max(1,winners.length-tier*6));for(let j=0;j<count;j++){const n=winners[tier*6+j];if(!n)continue;const xx=x+(j+.5)*bw/count;S.actor(n.type,xx,{y:y-6*scale,scale:.83*scale,pose:'dance',phase:(beat/2+j*.035)%1,facing:Math.floor(beat/4)%2?1:-1});}}
 else{for(const side of[-1,1])S.actor(side<0?'musician':'swordsman',w/2+side*145*scale,{y:y-6*scale,scale:.72*scale,pose:'drum',phase:beat%1,facing:-side});ellipse(c,w/2,y-75*scale,62*scale,81*scale,'#824f46','#d6b87b',5*scale);text(c,'宋',w/2,y-55*scale,49*scale,'#e8cc93');}
 for(let j=0;j<Math.ceil(bw/(58*scale));j++)S.helpers.lantern?.(c,x+23*scale+j*58*scale,y+33*scale,.5*scale,'#e7c489',clock);
 }
 const roofY=base-3*step+65*scale,roofW=towerW*.58,rx=(w-roofW)/2;
 path(c,[[rx-25*scale,roofY+40*scale],[rx+25*scale,roofY-7*scale],[rx+roofW-25*scale,roofY-7*scale],[rx+roofW+25*scale,roofY+40*scale]],'#896457','#d4b87d',3*scale);
 rect(c,w/2-89*scale,roofY-105*scale,70*scale,102*scale,'#a98265','#d8be8a',4);
 S.hero(w/2-35*scale,{y:roofY-5*scale,scale:.95*scale,pose:'sit'});table(c,w/2+91*scale,roofY+3*scale,.65*scale,130);bowl(c,w/2+91*scale,roofY-51*scale,.68*scale);
 cat(c,w/2+139*scale,roofY+2*scale,.78*scale,clock,'#aeb6a4',-1,false);
 if(t>12){for(let i=0;i<3;i++)bowl(c,w/2+(76+i*23)*scale,roofY-(56+i%2*21)*scale,.52*scale);stars(c,w*.10,h*.13,w*.8,h*.38,t);scroll(c,w*.78,h*.48,107,79,scale,'明年请早',between(t,13,16));}
}
const DRAWERS={solo:drawSolo,cat:drawCats,scholar:drawScholar,champion:drawChampion,oilSeller:drawOil,noble:drawNoble,prince:drawPrince,princess:drawPrincess,heir:drawHeir,heiress:drawHeiress,swordsman:drawSwordsman,crownPrince:drawCrownPrince,crownPrincess:drawCrownPrincess,empress:drawEmpress,consort:drawConsort,ghost:drawGhost,ghostReturn:drawGhostReturn,visitor:drawVisitor,doctor:drawDoctor,musician:drawMusician,merchant:drawMerchant,twoWorlds:drawTwoWorlds,festival:drawFestival};
function captions(S,ending){
 const{c,w,h,z,t,definition}=S,act=t<3?0:t<8?1:t<12?2:3,caption=definition.captions[act],font=clamp(w/37,18,27);
 const chars=Math.max(9,Math.floor(w*.80/font)),lines=[];for(let i=0;i<caption.length;i+=chars)lines.push(caption.slice(i,i+chars));
 const baseline=h*.895,lineH=font*1.5,top=baseline-(lines.length-1)*lineH-font-13;
 rect(c,w*.07,top,w*.86,lines.length*lineH+20,'#143b3cce','#b5a17380',5);
 lines.forEach((v,i)=>text(c,v,w/2,baseline-(lines.length-1-i)*lineH,font,'#f3e5bd'));
 const alpha=t<.7?between(t,0,.7):t>2.4?1-between(t,2.4,3.4):1;
 if(alpha>0){c.save();c.globalAlpha*=alpha;text(c,ending?.title||'上元奇缘',w/2,h*(S.portrait?.17:.12),clamp(w/29,24,40),'#f3e6bb');text(c,ending?.subtitle||'',w/2,h*(S.portrait?.17:.12)+34*z,clamp(w/49,15,22),'#d6cfaa');c.restore();}
 c.strokeStyle='#b6a075aa';c.lineWidth=1;c.strokeRect(15,15,w-30,h-30);
 return act;
}
/** All positions in canvas pixels. Helper drawCharacter must use y as planted foot/seat contact. */
export function drawEndingMovie(ctx,options,helpers){
 if(!ctx||!helpers?.drawCharacter)throw new TypeError('drawEndingMovie needs a 2D context and drawCharacter.');
 const width=Math.max(1,Number(options?.width)||1),height=Math.max(1,Number(options?.height)||1),requested=options?.ending?.scene||'solo',scene=ENDING_MOVIES[requested]?requested:'solo';
 ctx.save();
 try{
  ctx.beginPath();ctx.rect(0,0,width,height);ctx.clip();
  const S=makeStage(ctx,{...options,width,height},helpers,scene);S.state=options?.state;
  drawAtlas(ctx,width,height,S.definition.panel,S.clock,helpers,S.g);
  drawRoyalPageantry(S);
  if(scene==='ghost'||scene==='ghostReturn'){ctx.fillStyle=scene==='ghost'?'#314a7150':'#597e7040';ctx.fillRect(0,0,width,height);}
  if(scene!=='festival')petals(ctx,width,height*.77,S.clock,scene==='consort'?'#d199a4':'#dfd2ac',scene==='consort'?12:5);
  if(['prince','visitor','twoWorlds'].includes(scene))drawTransport(S,DRAWERS[scene],'boat');
  else if(['princess','heiress'].includes(scene))drawTransport(S,DRAWERS[scene],'sedan');
  else DRAWERS[scene](S);
  const act=captions(S,options?.ending),complete=Number(options?.time)>=20;
  return{scene,act,complete,egg:ENDING_EGGS[scene],actors:S.positions};
 }finally{ctx.restore();}
}
