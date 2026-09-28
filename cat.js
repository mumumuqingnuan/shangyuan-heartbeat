let atlas=null,companions=null,loading=null;
export const CAT_FRAMES=Object.freeze([[33,47,557,545],[43,58,559,522],[29,36,577,526],[46,12,514,558]].map(Object.freeze));
export async function loadCatAssets(){
 if(atlas&&companions)return atlas;if(loading)return loading;
 const load=(name)=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('猫咪画像尚未加载，请重试。'));img.src=new URL('./assets/'+name,import.meta.url).href;});
 loading=Promise.all([load('hu-xiaohua.png'),load('cat-companions.png')]).then(([a,b])=>{atlas=a;companions=b;return atlas;}).catch(e=>{loading=null;throw e;});return loading;
}
export function drawHuXiaohua(c,{x=0,y=0,scale=1,facing=1,time=0,phase=time*3,walking=false,sitting=false}={}){
 if(!atlas)return;
 const index=sitting?3:walking?(Math.floor(((phase%1)+1)%1*2)?2:1):0;
 const cell=atlas.width/2,box=CAT_FRAMES[index]||[0,0,cell,cell],maxHeight=Math.max(...CAT_FRAMES.map(b=>b?b[3]:cell)),unit=88/maxHeight;
 const [sx,sy,sw,sh]=box,w=sw*unit,h=sh*unit;
 c.save();c.translate(x,y);c.scale(scale*facing,scale);c.drawImage(atlas,(index%2)*cell+sx,Math.floor(index/2)*cell+sy,sw,sh,-w/2,-h,w,h);c.restore();
}

// Each friend has her own coat and two poses; Hu Xiaohua keeps the original atlas.
export const COMPANION_FRAMES=Object.freeze([[184,231,346,293],[177,238,221,292],[183,162,348,288],[177,168,219,286]].map(Object.freeze));
export function drawCompanionCat(c,{coat='black',x=0,y=0,scale=1,facing=1,walking=false}={}){
 if(!companions)return;
 const row=coat==='white'?1:0,index=row*2+(walking?0:1),cell=companions.width/2;
 const [sx,sy,sw,sh]=COMPANION_FRAMES[index],unit=88/Math.max(COMPANION_FRAMES[row*2][3],COMPANION_FRAMES[row*2+1][3]);
 c.save();c.translate(x,y);c.scale(scale*facing,scale);c.drawImage(companions,(index%2)*cell+sx,row*cell+sy,sw,sh,-sw*unit/2,-sh*unit,sw*unit,sh*unit);c.restore();
}
