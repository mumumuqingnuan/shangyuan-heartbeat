/** 电眼美女·大宋上元篇。规则只管理状态、时间和事件，不依赖 DOM 或 Three.js。 */
export const OUTFITS = [
  { id: 'jade', name: '青玉春衫', color: '#79bea5', description: '竹青罗衫，玉簪映月。', bonus: '书生与医师更易倾心。' },
  { id: 'scarlet', name: '绛霞披帛', color: '#ef786f', description: '绛红披帛，把心意写进灯火。', bonus: '侠客、商家公子与波斯来客更易倾心。' },
  { id: 'moon', name: '月白流光', color: '#b8b5ed', description: '月白衣裙，银光随步生辉。', bonus: '笛师、神秘公子与灯下幽客更易倾心。' },
];

const BASE_CHARACTERS = [
  { id: 'scholar', name: '温砚白', title: '翰林书生', color: '#83b6c4', spriteIndex: 0, score: 120, difficulty: 0.95, preferredOutfit: 'jade', description: '二十六岁。满腹文章，偏偏答不出你的一眼。', egg: '他把情诗写反了，还认真请你指正。' },
  { id: 'swordsman', name: '裴照夜', title: '江湖侠客', color: '#ec947c', spriteIndex: 1, score: 145, difficulty: 1.04, preferredOutfit: 'scarlet', description: '二十八岁。见惯刀光，却躲不开你的电眼。', egg: '剑穗突然打了个结，侠客红着耳朵说是风。' },
  { id: 'musician', name: '谢听澜', title: '临水楼笛师', color: '#c7a5d9', spriteIndex: 2, score: 135, difficulty: 1, preferredOutfit: 'moon', description: '二十五岁。笛声正好，你的目光却让他漏了一拍。', egg: '他吹出一声走调，索性把新曲叫作《心乱》。' },
  { id: 'doctor', name: '陆怀仁', title: '杏林医师', color: '#9dc6a6', spriteIndex: 3, score: 120, difficulty: 0.94, preferredOutfit: 'jade', description: '三十岁。能辨百般脉象，偏说自己只是夜风吹热了脸。', egg: '他给自己写了张方子：明日再见你一次。' },
  { id: 'merchant', name: '顾云舟', title: '锦绣行少东家', color: '#edbd75', spriteIndex: 4, score: 150, difficulty: 1.02, preferredOutfit: 'scarlet', description: '二十七岁。珍宝看过万千，今夜只顾追着你走。', egg: '算盘拨了三遍，算来算去都是“想你”。' },
  { id: 'prince', name: '赵景珩', title: '微服王爷', color: '#acace5', spriteIndex: 5, score: 190, difficulty: 1.08, preferredOutfit: 'moon', description: '二十九岁。微服出游的王爷，今夜愿先听你把话说完。', egg: '他的随从追来喊了一声“殿——”，被他塞了满嘴汤圆。' },
  { id: 'visitor', name: '阿迪勒', title: '波斯来客', color: '#d4a571', spriteIndex: 6, score: 180, difficulty: 1.06, preferredOutfit: 'scarlet', description: '二十七岁。不留胡须的年轻旅人，想学会用汴京话说“再见一面”。', egg: '他送你一颗琉璃珠，却把刚学会的“心上人”喊得整条街都听见。' },
  { id: 'ghost', name: '晏青', title: '灯下幽客', color: '#92d5d1', spriteIndex: 7, score: 210, difficulty: 1.10, preferredOutfit: 'moon', description: '生前二十四岁。借上元灯火重游幽园，没想到魂也会被一眼勾走。', egg: '他想潇洒穿过梅枝，回头看你时却忘了施法，轻轻撞出一声“哎呀”。' },
];

export const STAGES = [
  { id: 'market', name: '御街灯市', hint: '灯火照人，先把心动抢到手。', range: [0, 26], spawn: ['scholar', 'merchant', 'swordsman', 'doctor'] },
  { id: 'bridge', name: '相国寺灯会', hint: '寺前笛声起，异乡来客也来赴约。', range: [0, 26], spawn: ['musician', 'visitor', 'doctor', 'swordsman'] },
  { id: 'garden', name: '梅影幽园', hint: '梅影深处，幽客与隐姓公子正等着你。', range: [0, 26], spawn: ['prince', 'scholar', 'visitor', 'ghost'] },
];

const PREVIOUS_ENDINGS = [
  { id: 'v2-all-twelve', title: '上元十二心', subtitle: '今夜全城，都追随你的脚步', icon: '🏮', hint: '一局结缘全部十二位来客', text: '十二道身影排成一支热闹的队伍，从御街走过相国寺灯会，又绕回梅影幽园。你回眸一笑，连收灯的掌柜都说：今夜的头彩，归你了。' },
  { id: 'v2-eight-wonders', title: '八方倾心', subtitle: '八种奇遇，一眼收藏', icon: '✨', hint: '一局结缘全部八种人物', text: '书香、剑气、笛声与异乡故事，连月下幽魂也有一份。你收下八种不同的心动，把下一回相见留给更长的春天。' },
  { id: 'v2-two-worlds', title: '天涯与彼岸', subtitle: '远方有人，月下有魂', icon: '🌙', hint: '同一局结缘波斯来客和幽客', text: '阿迪勒讲起海上的星，晏青记得旧日的月。你站在两段故事之间，忽然觉得：山海与阴阳，都拦不住上元夜的一场相逢。' },
  { id: 'v2-grand-parade', title: '心动大巡游', subtitle: '走过一条街，留下一串心', icon: '🎉', hint: '一局结缘至少六人', text: '身后的队伍越走越长，花灯都被笑声惊得晃了起来。你不急着选下一站，只想让这段热闹的良宵再多停留一会儿。' },
  { id: 'v2-spring-company', title: '满街春信', subtitle: '每一次回眸，都有回响', icon: '🌸', hint: '一局结缘三至五人', text: '好几封邀约同时递到面前，你把它们仔细收进袖中。春光很长，心意也很真；接下来的故事，仍由你决定。' },
  { id: 'v2-scholar-letter', title: '灯下寄书', subtitle: '温砚白 · 字里行间皆是你', icon: '📜', hint: '让书生成为本局最倾心的人', text: '温砚白把未写完的灯谜翻过来，认真写下重逢的日期。你问他为何这样郑重，他说：这一页，值得一生慢慢读。' },
  { id: 'v2-swordsman-road', title: '仗剑同游', subtitle: '裴照夜 · 山河有伴', icon: '⚔️', hint: '让侠客成为本局最倾心的人', text: '裴照夜把剑换到另一边，只为让你走得更近一些。城外还有春色，你们约好，下一程也并肩看。' },
  { id: 'v2-musician-song', title: '一曲知音', subtitle: '谢听澜 · 此曲只赠你', icon: '🎵', hint: '让笛师成为本局最倾心的人', text: '谢听澜终于吹对了那支新曲，却又在你微笑时漏了一拍。你说这样也很好，他便把这一拍留作你们的暗号。' },
  { id: 'v2-doctor-spring', title: '杏林春暖', subtitle: '陆怀仁 · 一笑便回春', icon: '🌿', hint: '让医师成为本局最倾心的人', text: '陆怀仁递来温热花茶，却不再替自己的心跳找借口。他认真约你明日看花，你也认真地点了点头。' },
  { id: 'v2-merchant-promise', title: '千金一诺', subtitle: '顾云舟 · 珍重不以价量', icon: '💛', hint: '让商家公子成为本局最倾心的人', text: '顾云舟挑遍满街珍宝，最后亲手为你做了一盏小灯。最珍贵的礼物没有价签，只有一句“明年还来”。' },
  { id: 'v2-prince-moon', title: '月下之约', subtitle: '赵景珩 · 身份之外的真心', icon: '👑', hint: '让隐姓公子成为本局最倾心的人', text: '赵景珩把身世留作下回的谜，却把心意说得明白。你们约好不带随从，再来走一遍这条灯街。' },
  { id: 'v2-visitor-stars', title: '海路星书', subtitle: '阿迪勒 · 远方也有归处', icon: '⭐', hint: '让波斯来客成为本局最倾心的人', text: '阿迪勒把星图展开，指了许多遥远的港口，最后轻轻点向汴京。你问为什么，他笑着说：这里有想再见的人。' },
  { id: 'v2-ghost-lantern', title: '灯留故人', subtitle: '晏青 · 一盏灯，一次重逢', icon: '👻', hint: '在梅影幽园与灯下幽客倾心相逢', text: '晏青的身影随月色渐淡，你却为他留住一盏小灯。来年上元，他许诺循着灯火，再来赴你的约。' },
  { id: 'v2-carefree-moon', title: '自在赏月', subtitle: '一个人，也能玩得尽兴', icon: '🍡', hint: '自在逛完灯会，未与任何人结缘', text: '你吃了汤圆，逛过三处灯市，还看了许多有趣的热闹。今夜没有收下谁的心意，快乐却一件也没少。' },
];

const FIRST_ENDINGS = [
  ['six-lanterns', '六灯映月'], ['city-of-affection', '满城春信'], ['scholar-letter', '灯下寄书'],
  ['swordsman-road', '仗剑同游'], ['musician-song', '一曲知音'], ['doctor-spring', '杏林春暖'],
  ['merchant-promise', '千金一诺'], ['prince-moon', '月下之约'], ['carefree-moon', '自在赏月'],
].map(([id, title]) => ({ id, title }));


const EXTRA_CHARACTERS = [
  {id:'oilSeller',name:'秦守诚',title:'卖油郎',kind:'oilSeller',color:'#bd9a62',score:175,difficulty:1.02,preferredOutfit:'jade',age:27,description:'二十七岁。挑担走街串巷，一滴油也舍不得辜负。',egg:'他练了一辈子稳手，给你盛汤圆时却抖出了两颗。'},
  {id:'champion',name:'许承章',title:'新科状元郎',kind:'champion',color:'#d95161',score:235,difficulty:1.1,preferredOutfit:'jade',age:28,description:'二十八岁。御笔钦点的状元，愿将红花赠给替他解谜的人。',egg:'状元郎写了一纸漂亮骈文，你只圈出最后两个字：想你。'},
  {id:'noble',name:'谢玉衡',title:'世家公子',kind:'noble',color:'#cda6d8',score:225,difficulty:1.09,preferredOutfit:'moon',age:26,description:'二十六岁。规矩学得周全，第一次亲手把门第放在身后。',egg:'他带了十二封拜帖，真到门前却只会说“我来了”。'},
  {id:'heir',name:'赵承璟',title:'平宁王府世子',kind:'heir',color:'#79a4d8',score:255,difficulty:1.12,preferredOutfit:'scarlet',age:25,description:'二十五岁。成年世子，爱纵马看山河，也肯停下来认真听你说话。',egg:'世子把马牵到了街口，你却选了旁边的驴车。'},
  {id:'crownPrince',name:'赵承熙',title:'微服太子',kind:'crownPrince',color:'#d89e4b',score:285,difficulty:1.16,preferredOutfit:'moon',age:27,description:'二十七岁。藏身寺前听民声的太子，愿听你说一个不同的明日。',egg:'太子背了半宿告白，张口却问你今年米价。'},
  {id:'emperor',name:'赵怀珩',title:'微服天子',kind:'emperor',color:'#e7c251',score:340,difficulty:1.19,preferredOutfit:'jade',age:34,description:'三十四岁。循民间灯火而来的天子，看重你的眼光，也看重你的心。',egg:'天子说要赏你金灯，你先替御街的猫讨了一处避雨棚。'},
];
export const CHARACTERS = BASE_CHARACTERS.map((c)=>({...c,kind:c.id,age:c.id==='doctor'?30:c.id==='ghost'?24:c.id==='prince'?29:27,beard:c.id==='visitor'?false:undefined})).concat(EXTRA_CHARACTERS.map((c,i)=>({...c,spriteIndex:8+i})));

export const CLUES = [
  {id:'riddle',name:'状元灯谜',stage:0,x:7,token:'riddle',icon:'谜',hint:'御街灯谜留下了金榜的落款。',requires:{}},
  {id:'oil',name:'扶稳油担',stage:0,x:10,token:'oil',icon:'油',hint:'帮一帮快倒的油担，挑担人会回来道谢。',requires:{}},
  {id:'food',name:'猫猫鱼丸',stage:0,x:14,token:'food',icon:'丸',hint:'买一小包鱼丸，幽园似乎传来猫叫。',requires:{}},
  {id:'silk',name:'世家请帖',stage:0,x:20,token:'silk',icon:'帖',hint:'锦绣行少东家知道世家的灯会在哪儿。',requires:{wins:['merchant']}},
  {id:'templeSeal',name:'寺前赐福',stage:1,x:6,token:'templeSeal',icon:'福',hint:'寺前留一枚福印，也许有人认得。',requires:{}},
  {id:'medicine',name:'济世药方',stage:1,x:16,token:'medicine',icon:'药',hint:'请医师把药方留给寺前需要的人。',requires:{wins:['doctor']}},
  {id:'courtPetition',name:'为民陈情',stage:1,x:23,token:'courtPetition',icon:'笺',hint:'状元与医者同在，才写得出这封百姓的陈情。',requires:{wins:['champion','doctor']}},
  {id:'cat',name:'胡小花同行',stage:2,x:5,token:'cat',icon:'猫',hint:'带鱼丸来幽园，让猫猫自己走近你。',requires:{tokens:['food']}},
  {id:'royalPromise',name:'月下承诺',stage:2,x:12,token:'royalPromise',icon:'珏',hint:'王爷倾心后，月下还有一个需要亲口回答的约定。',requires:{wins:['prince']}},
  {id:'moonLamp',name:'留魂心灯',stage:2,x:20,token:'moonLamp',icon:'灯',hint:'结缘幽客后，为他亲手留下一盏心灯。',requires:{wins:['ghost']}},
];
const RARE_SPAWNS = [
  {id:'rare-oil-seller',type:'oilSeller',stage:0,x:18,requires:{tokens:['oil']}},
  {id:'rare-champion',type:'champion',stage:0,x:22,requires:{wins:['scholar'],tokens:['riddle']}},
  {id:'rare-noble',type:'noble',stage:1,x:18,requires:{wins:['merchant'],tokens:['silk']}},
  {id:'rare-heir',type:'heir',stage:2,x:15,requires:{wins:['noble'],tokens:['royalPromise']}},
  {id:'rare-crown-prince',type:'crownPrince',stage:1,x:22,requires:{wins:['champion'],tokens:['templeSeal']}},
  {id:'rare-emperor',type:'emperor',stage:2,x:23,requires:{wins:['crownPrince'],tokens:['cat'],visited:3}},
];
const ending = (id,scene,title,subtitle,text,hint)=>({id:'v4-'+id,scene,title,subtitle,text,hint,icon:'✧'});
export const ENDINGS = [
  ending('solo','solo','独身也自在','一城灯火，尽归你看','你谢过递来的心意，独自走向最亮的灯街。汤圆要两份，明年的路，也由自己选。','任何一局都可以选择把今夜留给自己。'),
  ending('cat','cat','和猫猫一起','胡小花选中了你的衣摆','你把鱼丸放在掌心，三花猫胡小花便一路跟到家门。公子们还在排队，它已经占了你的软枕。','在御街备好鱼丸，再亲自到幽园喂猫。'),
  ending('scholar','scholar','书生的灯下书','温砚白 · 字字皆有回音','温砚白把半卷书放进你的手中。你添一行，他写一行，往后的春天便有了共同的落款。','与一位书生结缘。'),
  ending('champion','champion','状元郎迎你过长街','许承章 · 金榜之外另有欢喜','许承章解下新科红花，郑重放到你手里。满街人贺他金榜题名，他却先贺自己遇见了你。','解开御街灯谜，结缘书生，再争取闻讯而来的新科状元。'),
  ending('oil-seller','oilSeller','卖油郎的长情','秦守诚 · 一担烟火，一世认真','秦守诚将油担稳稳放下，为你撑起一盏灯。他说日子或许平常，却愿把每一天都过得认真。','亲手扶稳御街的油担，再结缘回街道谢的卖油郎。'),
  ending('noble','noble','世家公子登门','谢玉衡 · 门第之外，自有真心','谢玉衡收起华贵拜帖，先问你想去哪里。你们并肩走出高门，春光原来不必隔着院墙看。','结缘商家公子、取得请帖，再到寺前遇见世家公子。'),
  ending('prince','prince','王爷的知己','赵景珩 · 不论身份，只谈心事','赵景珩换回普通衣衫，与你坐在街边分一碗汤圆。你们约好先做最懂彼此的人，往后的答案慢慢说。','结缘微服王爷，选择保留自在的相处。'),
  ending('princess','princess','王妃的上元灯','赵景珩 · 此后与你共看灯火','你亲口应下月下之约。赵景珩牵你走过王府门槛，先许诺的却是：每年上元，都陪你到街上来。','结缘王爷后，亲赴幽园取下月下承诺。'),
  ending('heir','heir','与世子策马同游','赵承璟 · 先看山河，再谈归期','赵承璟把缰绳递来，问你先去看山还是看海。你说先去城外吃热饼，他便笑着调转了马头。','通过世家公子与王府月下承诺，引来平宁世子，再赢得他的心。'),
  ending('heiress','heiress','世子妃的新春约','赵承璟 · 王府也留一扇看世界的窗','你把寺前福印系在赵承璟的佩剑上。成礼那日，你们约定王府有家，山河也仍是两人的天地。','结缘世子，并带着寺前福印回应他的约定。'),
  ending('swordsman','swordsman','侠客与你同路','裴照夜 · 江湖不再一人走','裴照夜把剑穗换成你的灯结。城门将开，你们约好行侠时并肩，歇脚时也分同一壶热茶。','与一位江湖侠客结缘。'),
  ending('crown-prince','crownPrince','太子与灯下知音','赵承熙 · 先知民声，再知心意','赵承熙合上记着民情的册子，认真记下你的话。他想见的天下里，从此多了与你相逢的这一盏灯。','状元郎与寺前福印，会引来微服太子；还须赢下他的三方争夺。'),
  ending('crown-princess','crownPrincess','太子妃的同心笺','赵承熙 · 并肩走向更长的春天','你带着月下的王府承诺走进东宫。赵承熙把新写的同心笺展开，第一页不是礼制，是你们共同想做的事。','结缘太子，同时取得王爷的月下承诺。'),
  ending('empress','empress','隐藏结局 · 皇后','赵怀珩 · 愿与你同担万家灯火','你递上为百姓写的陈情，也说清自己的心意。赵怀珩郑重相迎：愿与你相知相守，也一同照看这万家灯火。','结缘隐藏天子，带济世药方与百姓陈情；对天子的争夺中不使用回眸一笑。'),
  ending('consort','consort','隐藏结局 · 贵妃','赵怀珩 · 深宫也记得最初的笑','宫灯映着你熟悉的笑容。赵怀珩请人留住御街的桂花香，而你仍记得最初相逢时那份轻快的心情。','找到并结缘隐藏天子，可选择宫中的相守；皇后另有更深的条件。'),
  ending('ghost','ghost','灯留幽客','晏青 · 今夜有缘，来年再见','晏青的身影渐淡，你却记住了他的声音。每逢上元，你们都到梅影下相见，把短短良宵过成很长的牵念。','在幽园与晏青结缘。'),
  ending('ghost-return','ghostReturn','幽魂归来在人间','晏青 · 从此也能等到天亮','药方记下续命的旧法，心灯留住将散的魂。第一缕晨光照来时，晏青第一次握住了你温热的手。','结缘幽客，亲点留魂灯，再备好医师的济世药方。'),
  ending('visitor','visitor','异乡来客的归处','阿迪勒 · 远方有海，眼前有你','阿迪勒把星图折成一只小船，停在你的掌心。他还想看很远的世界，却已知道愿意回来见谁。','与清秀的异乡旅人结缘。'),
  ending('doctor','doctor','杏林春暖','陆怀仁 · 心事也有回音','陆怀仁留下温茶与花笺，不再替自己的心跳找借口。你们一同去看春花，也一同为街坊留一盏夜灯。','与一位医者结缘。'),
  ending('musician','musician','笛声知音','谢听澜 · 那一拍，只留给你','谢听澜终于吹对了整支新曲，却故意留出一个空拍。你轻轻应和，那一拍便从此有了名字。','与寺前的笛师结缘。'),
  ending('merchant','merchant','千金一诺','顾云舟 · 珍重不以价量','顾云舟亲手糊了一盏小灯，没有价签，只有重逢的日子。他说再大的生意，也不如这份约定值得认真。','与商家公子结缘。'),
  ending('two-worlds','twoWorlds','天涯与彼岸同行','远方的人与月下的魂，都有归路','异乡旅人讲起海上的星，幽客想起旧日的月。你点亮心灯，让两段遥远的故事坐到了同一张茶桌前。','同时结缘异乡来客与幽客，并亲点留魂灯。'),
  ending('festival','festival','满城灯火为你开','十二份心意，三条街都在等你','你走过三处灯会，赢下十二份不同的心意。今夜谁也不催你作答，整条灯街先为这份热闹开宴。','走过三景，结缘至少十二人，并取得三种线索。'),
];
export const LEGACY_ENDINGS = FIRST_ENDINGS.concat(PREVIOUS_ENDINGS.map(({id,title})=>({id,title})));
export const COLLECTION_KEY = 'song-lantern-game.collection.v4';
export const PREVIOUS_COLLECTION_KEY = 'song-lantern-game.collection.v2';
export const LEGACY_COLLECTION_KEY = 'song-lantern-game.collection.v1';
export const TUNING = Object.freeze({duration:150,maxStep:.05,walkSpeed:6.2,engageRange:8.4,boostCooldown:.15,boostPower:4.4,duelLimit:8,transition:.8,beautyDuration:8,clueRange:1.3});
const ROUTE_REQUIREMENTS = {
  'v4-solo':{},'v4-cat':{tokens:['cat']},'v4-scholar':{wins:['scholar']},'v4-champion':{wins:['champion']},
  'v4-oil-seller':{wins:['oilSeller']},'v4-noble':{wins:['noble']},'v4-prince':{wins:['prince']},
  'v4-princess':{wins:['prince'],tokens:['royalPromise']},'v4-heir':{wins:['heir']},
  'v4-heiress':{wins:['heir'],tokens:['templeSeal']},'v4-swordsman':{wins:['swordsman']},
  'v4-crown-prince':{wins:['crownPrince']},'v4-crown-princess':{wins:['crownPrince'],tokens:['royalPromise']},
  'v4-empress':{wins:['emperor'],tokens:['medicine','courtPetition'],skillFreeWin:'emperor'},
  'v4-consort':{wins:['emperor']},'v4-ghost':{wins:['ghost']},
  'v4-ghost-return':{wins:['ghost'],tokens:['moonLamp','medicine']},'v4-visitor':{wins:['visitor']},
  'v4-doctor':{wins:['doctor']},'v4-musician':{wins:['musician']},'v4-merchant':{wins:['merchant']},
  'v4-two-worlds':{wins:['visitor','ghost'],tokens:['moonLamp']},'v4-festival':{count:12,visited:3,tokenCount:3},
};
function buildRoutePath(requirements,seen=new Set()){
  const path=[];
  function add(kind,id,label,requirements){
    const key=kind+':'+id;if(seen.has(key))return;seen.add(key);
    if(requirements)path.push(...buildRoutePath(requirements,seen));
    path.push({kind,id,label});
  }
  for(const type of requirements.wins||[]){const c=CHARACTERS.find(c=>c.id===type),rare=RARE_SPAWNS.find(n=>n.type===type);add('win',type,'与'+c.title+'结缘',rare?.requires);}
  for(const token of requirements.tokens||[]){const c=CLUES.find(c=>c.token===token);add('token',token,'到'+STAGES[c.stage].name+'取得「'+c.name+'」',c.requires);}
  if(requirements.visited)add('visited',requirements.visited,'走过三处灯会');
  if(requirements.count)add('count',requirements.count,'结缘至少'+requirements.count+'位来客');
  if(requirements.tokenCount)add('tokenCount',requirements.tokenCount,'取得至少'+requirements.tokenCount+'种线索');
  if(requirements.skillFreeWin)add('skillFreeWin',requirements.skillFreeWin,'对天子的成功争夺中不使用回眸一笑');
  return path;
}
export const ROUTES = ENDINGS.map(e=>{const requires=ROUTE_REQUIREMENTS[e.id],path=buildRoutePath(requires);return{id:e.id,endingId:e.id,title:e.title,hidden:['empress','consort'].includes(e.scene),hint:e.hint,steps:path.map(p=>p.label),path,requires};});
export const RIVALS = [
  {id:'hongxiao',name:'红绡姑娘',color:'#e26396',kind:'rival'},
  {id:'jinse',name:'锦瑟才女',color:'#b394e8',kind:'rival2'},
  {id:'yueyao',name:'月瑶郡主',color:'#e5b947',kind:'rival3'},
  {id:'qingluo',name:'青萝女侠',color:'#5eafa7',kind:'rival4'},
  {id:'huazhi',name:'花枝娘子',color:'#ef995c',kind:'rival5'},
  {id:'yunshang',name:'云裳姑娘',color:'#74b8bb',kind:'rival6'},
];
export const DUEL_PROFILES=[null,{"count":1,"first":1.45,"gap":0,"uncontested":32,"hold":14,"rivalRate":15.5},{"count":2,"first":1.2,"gap":0.55,"uncontested":31,"hold":10,"rivalRate":18},{"count":3,"first":1,"gap":0.5,"uncontested":29,"hold":8.8,"rivalRate":20.5},{"count":4,"first":0.95,"gap":0.45,"uncontested":27,"hold":7.6,"rivalRate":22.5},{"count":5,"first":0.9,"gap":0.4,"uncontested":25,"hold":6.8,"rivalRate":24},{"count":6,"first":0.85,"gap":0.35,"uncontested":24,"hold":6,"rivalRate":26}];
export const DUEL_TIERS={"scholar":1,"oilSeller":1,"doctor":2,"musician":2,"merchant":2,"swordsman":3,"visitor":3,"ghost":3,"champion":4,"noble":4,"prince":5,"heir":5,"crownPrince":5,"emperor":6};
const TYPES=new Map(CHARACTERS.map(c=>[c.id,c])), ENDING_MAP=new Map(ENDINGS.map(e=>[e.id,e]));
const LEGACY_IDS=new Set(LEGACY_ENDINGS.map(e=>e.id));
const EGG_IDS=new Set(ENDINGS.map(e=>'egg-'+e.id).concat(['v2-egg-prince','v2-egg-visitor','v2-egg-ghost','v2-egg-two-worlds','v2-egg-eight-wonders','v2-egg-twelve']));
const EPS=1e-8,clamp=(n,a,b)=>Math.min(b,Math.max(a,n)),subtract=(n,d)=>n-d<EPS?0:n-d;
const npcById=(s,id)=>s.npcs.find(n=>n.id===id);
const wonType=(s,type)=>s.npcs.some(n=>n.type===type&&s.wins.includes(n.id));
function random(s){try{const n=Number(s._rng());return Number.isFinite(n)?clamp(n,0,.999999):.5;}catch{return .5;}}
function emit(s,type,details={}){const event={serial:++s.eventSerial,type,...details};s.events.push(event);return event;}
export function drainEvents(s){const events=s.events;s.events=[];return events;}
function requirementChecks(s,r={}) {
  const checks=[];
  for(const type of r.wins||[])checks.push({done:wonType(s,type),hint:'与'+TYPES.get(type).title+'结缘'});
  for(const token of r.tokens||[])checks.push({done:s.tokens.includes(token),hint:'取得'+CLUES.find(c=>c.token===token).name});
  if(r.count)checks.push({done:s.wins.length>=r.count,hint:'结缘至少'+r.count+'位来客'});
  if(r.visited)checks.push({done:s.visitedStages.length>=r.visited,hint:'走过三处灯会'});
  if(r.tokenCount)checks.push({done:s.tokens.length>=r.tokenCount,hint:'取得至少'+r.tokenCount+'种线索'});
  if(r.skillFreeWin)checks.push({done:s.encounterHistory.some(e=>e.result==='win'&&e.charId===r.skillFreeWin&&!e.skillUsed),hint:'对天子的成功争夺中不使用回眸一笑'});
  return checks;
}
const meets=(s,r)=>requirementChecks(s,r).every(c=>c.done);
function updateUnlocks(s){
  for(const c of s.clues)c.unlocked=meets(s,c.requires);
  for(const spec of RARE_SPAWNS){const n=npcById(s,spec.id);if(!n.unlocked&&meets(s,spec.requires)){n.unlocked=true;n.status='roam';emit(s,'unlock',{npcId:n.id,charId:n.type,name:n.name,stage:n.stage,text:n.title+'来到了'+STAGES[n.stage].name+'。'});}}
  s.routeProgress=ROUTES.map(route=>{
    const checks=route.path.map(p=>({hint:p.label,done:p.kind==='win'?wonType(s,p.id):p.kind==='token'?s.tokens.includes(p.id):p.kind==='visited'?s.visitedStages.length>=p.id:p.kind==='count'?s.wins.length>=p.id:p.kind==='tokenCount'?s.tokens.length>=p.id:s.encounterHistory.some(e=>e.result==='win'&&e.charId===p.id&&!e.skillUsed)}));
    const blocked=Boolean(route.requires.skillFreeWin&&wonType(s,route.requires.skillFreeWin)&&!meets(s,{skillFreeWin:route.requires.skillFreeWin}));
    return{id:route.id,endingId:route.id,eligible:meets(s,route.requires),blocked,completed:checks.filter(c=>c.done).length,total:checks.length,hint:route.hint,nextHint:blocked?'本局对天子使用过回眸一笑；下局不用技能赢下天子，才能争取皇后。':checks.find(c=>!c.done)?.hint||'已可在散场时选择这段归宿'};
  });
}
function makeNpc(id,type,stage,x,index=0,extra={}){
  const c=TYPES.get(type);
  return{id,type,kind:c.kind,stage,x,baseX:x,name:c.name,title:c.title,description:c.description,age:c.age,
    facing:index%2?-1:1,status:'roam',unlocked:true,rare:false,cooldown:0,stunLeft:0,shockLeft:0,walking:false,patrolPhase:index*1.7+stage*.9,earnedScore:0,...extra};
}
export function createGame(outfitId='jade',rng=Math.random){
  const seen=new Set(),variants={doctor:{name:'宋怀春',title:'游方医者',age:29},swordsman:{name:'孟逐风',title:'少年游侠',age:24},scholar:{name:'沈明修',title:'书院才子',age:25},visitor:{name:'萨米尔',title:'丝路旅人',age:28}};
  const npcs=STAGES.flatMap((stage,si)=>stage.spawn.map((type,i)=>{const variant=seen.has(type)?variants[type]:{};seen.add(type);const n=makeNpc(stage.id+'-'+type+'-'+(i+1),type,si,5+i*6,i,variant);n.x+=Math.sin(n.patrolPhase)*1.8;return n;}));
  for(const spec of RARE_SPAWNS)npcs.push(makeNpc(spec.id,spec.type,spec.stage,spec.x,0,{rare:true,unlocked:false,status:'locked'}));
  const s={phase:'playing',stage:0,hero:{x:3,facing:1,targetX:null,walking:false},npcs,outfitId:OUTFITS.some(o=>o.id===outfitId)?outfitId:'jade',
    score:0,duration:TUNING.duration,timeLeft:TUNING.duration,elapsed:0,timeElapsed:0,wins:[],losses:0,perfects:0,encounter:null,pendingNpc:null,pendingMode:null,pendingClue:null,
    transitionLeft:0,stunLeft:0,beautyLeft:0,beautyActivations:0,energy:0,skillCharges:3,skillUses:0,combo:0,maxCombo:0,typeScores:{},eggs:[],endingEgg:null,ending:null,availableEndings:[],endingConfirmed:false,parade:[],
    tokens:[],clues:CLUES.map(c=>({...c,collected:false,unlocked:false})),routeProgress:[],visitedStages:[0],encounterHistory:[],rivalsDefeated:0,
    encounterCount:0,eventSerial:0,events:[],_rng:typeof rng==='function'?rng:Math.random};
  updateUnlocks(s);return s;
}
const canAct=s=>s.phase==='playing'&&s.timeLeft>0&&s.transitionLeft<=0&&s.stunLeft<=0;
function clearPending(s){s.pendingNpc=null;s.pendingMode=null;s.pendingClue=null;s.hero.targetX=null;}
function syncRivals(e){const active=e.rivals.filter(r=>r.active);e.hasRival=active.length>0;e.rivalProgress=active.length?Math.max(...active.map(r=>r.progress)):0;e.rivalName=active.slice().sort((a,b)=>b.progress-a.progress)[0]?.name||e.rivals[0].name;e.freezeLeft=active.length?Math.max(...active.map(r=>r.freezeLeft)):0;}
function beginEncounter(s,n){
  const c=TYPES.get(n.type),number=s.encounterCount++,tier=DUEL_TIERS[n.type]||1,profile=DUEL_PROFILES[tier],count=profile.count;
  clearPending(s);s.hero.walking=false;s.hero.facing=n.x>=s.hero.x?1:-1;n.walking=false;
  const start=Math.floor(random(s)*RIVALS.length),first=profile.first+(tier<=2&&number===0?.2:0);
  const rivals=Array.from({length:count},(_,i)=>({...RIVALS[(start+i)%RIVALS.length],progress:0,active:false,warned:false,arrivesAt:first+i*profile.gap,warningAt:Math.max(.15,first+i*profile.gap-.65),freezeLeft:0,side:i%2? -1:1}));
  s.encounter={id:'duel-'+number,npcId:n.id,charId:n.type,progress:0,rivalProgress:0,hasRival:false,rivalName:rivals[0].name,rivals,age:0,elapsed:0,rivalAt:first,willHaveRival:true,
    freezeLeft:0,boostCooldown:0,hitCooldown:0,pulseLeft:0,boosts:0,releasedTime:0,skillUsed:false,rivalRate:profile.rivalRate,tier,profile};
  emit(s,'encounter',{encounterId:s.encounter.id,npcId:n.id,charId:n.type,rivalCount:count});
}
export function startEncounter(s,id){
  const n=npcById(s,id);if(!canAct(s)||s.encounter||!n||n.stage!==s.stage||n.status!=='roam'||n.cooldown>0)return false;
  clearPending(s);
  if(Math.abs(n.x-s.hero.x)>TUNING.engageRange){s.pendingNpc=id;s.pendingMode='approach';s.hero.facing=n.x>s.hero.x?1:-1;s.hero.targetX=n.x;emit(s,'approach',{npcId:id,charId:n.type});}
  else beginEncounter(s,n);return true;
}
function takeClue(s,c){
  if(c.collected||!c.unlocked)return false;c.collected=true;s.tokens.push(c.token);clearPending(s);s.hero.walking=false;
  emit(s,'clue',{clueId:c.id,token:c.token,name:c.name,stage:c.stage,text:c.id==='cat'?'胡小花吃完鱼丸，主动蹭了蹭你的衣摆，决定跟你回家。':'你获得了「'+c.name+'」。'});
  updateUnlocks(s);return true;
}
export function collectClue(s,id){
  const c=s.clues.find(c=>c.id===id);if(!canAct(s)||s.encounter||!c||c.stage!==s.stage||!c.unlocked||c.collected)return false;
  clearPending(s);
  if(Math.abs(c.x-s.hero.x)<=TUNING.clueRange)return takeClue(s,c);
  s.pendingClue=id;s.hero.targetX=c.x;s.hero.facing=c.x>s.hero.x?1:-1;emit(s,'clueApproach',{clueId:id,stage:c.stage});return true;
}
function record(s,e,result,reason){const entry={npcId:e.npcId,charId:e.charId,result,reason,duration:e.age,boosts:e.boosts,skillUsed:e.skillUsed,rivalCount:e.rivals.filter(r=>r.active).length,releasedTime:e.releasedTime};s.encounterHistory.push(entry);return entry;}
function duelReaction(s,e,outcome,reason=null){
 const active=e.rivals.filter(r=>r.active),winner=outcome==='lose'&&reason==='rival'?active.reduce((a,b)=>!a||b.progress>a.progress?b:a,null):null;
 emit(s,'duelReaction',{encounterId:e.id,stage:s.stage,npcId:e.npcId,charId:e.charId,outcome,reason,winnerRivalId:winner?.id||null,
 hero:{actorId:'hero',expression:outcome==='win'?'win':'lose',duration:1.35},
 rivals:active.map((r,slot)=>({actorId:'rival:'+e.id+':'+r.id,rivalId:r.id,kind:r.kind,name:r.name,slot,
 expression:outcome==='win'?(slot%2?'stomp':'pout'):r.id===winner?.id?'smug':'sweat',duration:1.35}))});
}
function winEncounter(s){
  const e=s.encounter;if(!e)return;const n=npcById(s,e.npcId),c=TYPES.get(n.type);if(s.wins.includes(n.id))return;
  duelReaction(s,e,'win');
  const result=record(s,e,'win'),perfect=e.releasedTime<=.25&&e.age<=5.5,multiplier=s.beautyLeft>0?2:1;
  const earned=Math.round((c.score+result.rivalCount*35+(perfect?20:0))*(1+Math.min(s.combo,5)*.1)*multiplier);
  s.wins.push(n.id);s.score+=earned;s.combo++;s.maxCombo=Math.max(s.maxCombo,s.combo);s.rivalsDefeated+=result.rivalCount;s.typeScores[n.type]=(s.typeScores[n.type]||0)+earned;if(perfect)s.perfects++;
  Object.assign(n,{status:'won',shockLeft:0,cooldown:0,earnedScore:earned,winRecord:result});s.encounter=null;s.hero.walking=false;
  emit(s,'win',{npcId:n.id,charId:n.type,charName:n.name,earned,perfect,combo:s.combo,beauty:multiplier===2,duration:e.age,rivalCount:result.rivalCount});
  if(['visitor','ghost','prince','emperor'].includes(n.type))emit(s,'egg',{id:'capture-'+n.type,text:c.egg,charId:n.type,kind:'capture'});
  s.energy=Math.min(100,s.energy+34);if(s.energy>=100){s.energy=0;s.beautyLeft=8;s.beautyActivations++;emit(s,'beauty',{duration:8,text:'Beauty Time · 八秒倾城！'});}
  updateUnlocks(s);if(s.npcs.every(n=>n.status==='won'))finishGame(s);
}
function loseEncounter(s,reason){const e=s.encounter,n=npcById(s,e.npcId);record(s,e,'lose',reason);duelReaction(s,e,'lose',reason);Object.assign(n,{status:'stunned',stunLeft:2,cooldown:5,shockLeft:0});s.stunLeft=2;s.losses++;s.combo=0;s.encounter=null;s.hero.walking=false;emit(s,'lose',{npcId:n.id,charId:n.type,reason,stun:2,cooldown:5});}
function abandon(s){if(s.encounter){const e=s.encounter;record(s,e,'abandon');npcById(s,e.npcId).shockLeft=0;s.encounter=null;s.combo=0;emit(s,'abandon',{npcId:e.npcId,charId:e.charId});}clearPending(s);}
export function moveTo(s,x){if(s.phase!=='playing'||!Number.isFinite(x))return false;abandon(s);s.hero.targetX=clamp(x,-1,27);return true;}
export function boost(s){
  const e=s.encounter;if(!canAct(s)||!e||e.boostCooldown>EPS||!e.hasRival)return false;e.boostCooldown=TUNING.boostCooldown;e.boosts++;
  e.progress=Math.min(100,e.progress+TUNING.boostPower);e.pulseLeft=.30;for(const r of e.rivals)if(r.active)r.progress=Math.max(0,r.progress-2);
  npcById(s,e.npcId).shockLeft=.18;syncRivals(e);emit(s,'boost',{npcId:e.npcId,charId:e.charId,progress:e.progress});if(e.progress>=100)winEncounter(s);return true;
}
export function useSkill(s){
  const e=s.encounter;if(!canAct(s)||!e||s.skillCharges<=0)return false;s.skillCharges--;s.skillUses++;e.skillUsed=true;e.progress=Math.min(100,e.progress+22);
  for(const r of e.rivals)r.freezeLeft=Math.max(r.freezeLeft,2);syncRivals(e);npcById(s,e.npcId).shockLeft=.3;
  emit(s,'skill',{npcId:e.npcId,charId:e.charId,chargesLeft:s.skillCharges,freeze:2});if(e.progress>=100)winEncounter(s);return true;
}
function positionFollowers(s,instant=false,dt=0){s.wins.forEach((id,i)=>{const n=npcById(s,id),goal=s.hero.x-s.hero.facing*(1.85+i*1.46),old=n.x;n.x=instant?goal:goal+(n.x-goal)*Math.exp(-dt*6);n.facing=s.hero.facing;n.walking=s.hero.walking||Math.abs(n.x-old)>.002;});}
export function changeStage(s,direction){const dir=Math.sign(Number(direction));if(!canAct(s)||s.encounter||!Number.isFinite(dir)||!dir)return false;const from=s.stage;s.stage=(from+dir+3)%3;s.hero.x=dir>0?2:24;s.hero.facing=dir;s.hero.walking=false;clearPending(s);s.transitionLeft=TUNING.transition;if(!s.visitedStages.includes(s.stage))s.visitedStages.push(s.stage);positionFollowers(s,true);emit(s,'stage',{from,to:s.stage,stageId:STAGES[s.stage].id,direction:dir,duration:TUNING.transition});updateUnlocks(s);return true;}
function updateRoaming(s,dt){for(const n of s.npcs){n.cooldown=subtract(n.cooldown,dt);n.stunLeft=subtract(n.stunLeft,dt);n.shockLeft=subtract(n.shockLeft,dt);if(n.status==='stunned'&&n.stunLeft===0)n.status='roam';if(n.status!=='roam'||n.stage!==s.stage||n.id===s.encounter?.npcId){if(n.status!=='won')n.walking=false;continue;}const before=n.x,angle=s.elapsed*.38+n.patrolPhase;n.x=n.baseX+Math.sin(angle)*(n.rare?.9:1.8);n.facing=Math.cos(angle)>=0?1:-1;n.walking=Math.abs(n.x-before)>EPS;}}
function advanceEncounter(s,dt,holding){
  const e=s.encounter,c=TYPES.get(e.charId),start=e.age,end=start+dt;e.age=end;e.elapsed=end;e.boostCooldown=subtract(e.boostCooldown,dt);e.hitCooldown=subtract(e.hitCooldown,dt);
  for(let i=0;i<e.rivals.length;i++){const r=e.rivals[i],details={npcId:e.npcId,charId:e.charId,rivalId:r.id,rivalName:r.name,rivalIndex:i,count:e.rivals.length};
    if(!r.warned&&end>=r.warningAt){r.warned=true;emit(s,'rivalWarning',{...details,arrivesIn:Math.max(0,r.arrivesAt-end)});}
    if(!r.active&&end>=r.arrivesAt){r.active=true;emit(s,'rivalArrival',details);emit(s,'rival',details);}
  }
  // Integrate arrival and freeze boundaries exactly, so rivals behave consistently at 20/60/120fps.
  const edges=[start,end];for(const r of e.rivals){if(r.arrivesAt>start&&r.arrivesAt<end)edges.push(r.arrivesAt);if(r.freezeLeft>0&&start+r.freezeLeft<end)edges.push(start+r.freezeLeft);}if(e.pulseLeft>0&&start+e.pulseLeft<end)edges.push(start+e.pulseLeft);edges.sort((a,b)=>a-b);
  for(let i=1;i<edges.length;i++){const a=edges[i-1],b=edges[i],span=b-a,mid=(a+b)/2,active=e.rivals.filter(r=>r.arrivesAt<=mid),threats=active.filter(r=>r.freezeLeft<=mid-start),count=threats.length;
    if(holding||mid-start<e.pulseLeft){const rate=count?e.profile.hold/(1+.04*(count-1)):e.profile.uncontested;e.progress+=span*rate/c.difficulty*(c.preferredOutfit===s.outfitId?1.07:1)*(s.beautyLeft>0?1.65:1);}
    else{e.releasedTime+=span;e.progress-=span*5;}
    for(const r of threats)r.progress+=span*e.rivalRate*(1+.05*Math.min(5,count-1));
  }
  for(const r of e.rivals){r.freezeLeft=subtract(r.freezeLeft,dt);r.progress=clamp(r.progress,0,100);}
  if((holding||e.pulseLeft>0)&&e.hitCooldown<=EPS){e.hitCooldown=.16;npcById(s,e.npcId).shockLeft=.18;emit(s,'hit',{npcId:e.npcId,charId:e.charId,contested:e.rivals.some(r=>r.active)});}e.pulseLeft=subtract(e.pulseLeft,dt);
  e.progress=clamp(e.progress,0,100);syncRivals(e);
  if(e.progress>=100-EPS)winEncounter(s);else if(e.rivalProgress>=100-EPS)loseEncounter(s,'rival');else if(e.age>=TUNING.duelLimit-EPS)loseEncounter(s,'timeout');
}
function walk(s,x,dt){const diff=x-s.hero.x;if(Math.abs(diff)<EPS){s.hero.targetX=null;return;}s.hero.facing=Math.sign(diff);s.hero.walking=true;s.hero.x+=Math.sign(diff)*Math.min(Math.abs(diff),TUNING.walkSpeed*(s.beautyLeft>0?2:1)*dt);if(s.hero.x<=0||s.hero.x>=26)changeStage(s,s.hero.facing);else if(Math.abs(x-s.hero.x)<EPS)s.hero.targetX=null;}
export function stepGame(s,dt,{move=0,holding=false}={}){
  if(s.phase!=='playing')return s;const value=Number(dt),step=Number.isFinite(value)?Math.min(clamp(value,0,TUNING.maxStep),s.timeLeft):0;if(step<=0)return s;
  const locked=s.transitionLeft>0||s.stunLeft>0;s.timeLeft=subtract(s.timeLeft,step);s.elapsed=s.duration-s.timeLeft;s.timeElapsed=s.elapsed;s.transitionLeft=subtract(s.transitionLeft,step);s.stunLeft=subtract(s.stunLeft,step);
  const beauty=s.beautyLeft;s.beautyLeft=subtract(s.beautyLeft,step);if(beauty>0&&!s.beautyLeft)emit(s,'beautyEnd');updateRoaming(s,step);s.hero.walking=false;
  if(!locked){const dir=Number.isFinite(Number(move))?clamp(Number(move),-1,1):0;
    if(Math.abs(dir)>EPS){abandon(s);s.hero.facing=Math.sign(dir);s.hero.walking=true;s.hero.x+=dir*TUNING.walkSpeed*(s.beautyLeft>0?2:1)*step;if(s.hero.x<=0||s.hero.x>=26)changeStage(s,s.hero.facing);}
    else{
      if(s.pendingNpc){const n=npcById(s,s.pendingNpc);if(!n||n.stage!==s.stage||n.status!=='roam'||n.cooldown>0)clearPending(s);else if(Math.abs(n.x-s.hero.x)<=TUNING.engageRange)beginEncounter(s,n);else{walk(s,n.x,step);if(Math.abs(n.x-s.hero.x)<=TUNING.engageRange)beginEncounter(s,n);}}
      else if(s.pendingClue){const c=s.clues.find(c=>c.id===s.pendingClue);if(!c||c.stage!==s.stage||!c.unlocked||c.collected)clearPending(s);else{if(Math.abs(c.x-s.hero.x)>TUNING.clueRange)walk(s,c.x,step);if(Math.abs(c.x-s.hero.x)<=TUNING.clueRange)takeClue(s,c);}}
      else if(!s.encounter&&s.hero.targetX!==null){const x=Number(s.hero.targetX);if(Number.isFinite(x))walk(s,x,step);else s.hero.targetX=null;}
      if(s.encounter)advanceEncounter(s,step,Boolean(holding));
    }
  }
  positionFollowers(s,false,step);if(!s.timeLeft&&s.phase==='playing')finishGame(s);return s;
}
function featuredNpc(s,type){return s.npcs.filter(n=>n.type===type&&s.wins.includes(n.id)).sort((a,b)=>b.earnedScore-a.earnedScore)[0];}
function personalized(s,e){const out={...e};for(const type of ROUTE_REQUIREMENTS[e.id].wins||[]){const n=featuredNpc(s,type),base=TYPES.get(type);if(n&&n.name!==base.name)for(const key of ['title','subtitle','text'])out[key]=out[key].split(base.name).join(n.name);}return out;}
function eligibleEndings(s){return ENDINGS.filter(e=>meets(s,ROUTE_REQUIREMENTS[e.id])).map(e=>personalized(s,e));}
const ENDING_PRIORITY=['v4-empress','v4-consort','v4-crown-princess','v4-crown-prince','v4-heiress','v4-heir','v4-princess','v4-champion','v4-festival','v4-ghost-return','v4-two-worlds','v4-noble','v4-oil-seller','v4-prince','v4-ghost','v4-visitor','v4-swordsman','v4-scholar','v4-doctor','v4-musician','v4-merchant','v4-cat','v4-solo'];
export function selectEnding(s){const options=eligibleEndings(s);return options.find(e=>e.id===s.ending?.id)||options.slice().sort((a,b)=>ENDING_PRIORITY.indexOf(a.id)-ENDING_PRIORITY.indexOf(b.id))[0];}
function assignEnding(s,e){s.ending={...e};s.endingEgg={id:'egg-'+e.id,text:e.text,scene:e.scene};}
export function finishGame(s){if(s.phase==='ended')return s;s.phase='ended';s.transitionLeft=0;s.encounter=null;clearPending(s);s.hero.walking=false;updateUnlocks(s);s.availableEndings=eligibleEndings(s);assignEnding(s,selectEnding(s));s.parade=[...s.wins];emit(s,'end',{endingId:s.ending.id,ending:s.ending,availableEndings:s.availableEndings,parade:s.parade,egg:s.endingEgg,score:s.score});return s;}
export function chooseEnding(s,id){if(s.phase!=='ended'||s.endingConfirmed)return false;const e=s.availableEndings.find(e=>e.id===id);if(!e)return false;assignEnding(s,e);emit(s,'endingChoice',{endingId:id,ending:s.ending,egg:s.endingEgg});return true;}

const emptyCollection=()=>({version:4,endings:[],eggs:[],best:0,legacyEndings:[]});
let memoryCollection=emptyCollection();const storageMemories=new WeakMap();
function resolveStorage(storage){if(storage!==undefined)return storage;try{return globalThis.localStorage||null;}catch{return null;}}
function readJSON(storage,key){try{const raw=storage?.getItem?.(key);return raw?JSON.parse(raw):null;}catch{return null;}}
function mergeCollection(a,b){
  const ids=new Set([...(Array.isArray(a?.endings)?a.endings:[]),...(Array.isArray(b?.endings)?b.endings:[])]);
  const eggs=new Set([...(Array.isArray(a?.eggs)?a.eggs:[]),...(Array.isArray(b?.eggs)?b.eggs:[])]);
  const legacy=new Set([...(Array.isArray(a?.legacyEndings)?a.legacyEndings:[]),...(Array.isArray(b?.legacyEndings)?b.legacyEndings:[])]);
  const best=Math.max(...[a?.best,b?.best,0].map(n=>typeof n==='number'&&Number.isFinite(n)&&n>=0?Math.floor(n):0));
  return{version:4,endings:ENDINGS.filter(e=>ids.has(e.id)).map(e=>e.id),eggs:[...EGG_IDS].filter(id=>eggs.has(id)),best,legacyEndings:LEGACY_ENDINGS.filter(e=>legacy.has(e.id)).map(e=>e.id)};
}
function remember(target,c){const copy=mergeCollection(c,null);if(target&&(typeof target==='object'||typeof target==='function'))storageMemories.set(target,copy);else memoryCollection=copy;}
export function getCollection(storage){
  const target=resolveStorage(storage),memory=target&&(typeof target==='object'||typeof target==='function')?storageMemories.get(target):memoryCollection;
  let collection=mergeCollection(memory,readJSON(target,COLLECTION_KEY));
  const old=readJSON(target,PREVIOUS_COLLECTION_KEY),first=readJSON(target,LEGACY_COLLECTION_KEY);
  collection=mergeCollection(collection,{legacyEndings:[...(Array.isArray(old?.endings)?old.endings:[]),...(Array.isArray(old?.legacyEndings)?old.legacyEndings:[]),...(Array.isArray(first)?first:[])].filter(id=>LEGACY_IDS.has(id)),best:old?.best,eggs:old?.eggs});
  remember(target,collection);return collection;
}
export function saveEnding(s,storage){
  const target=resolveStorage(storage),existing=getCollection(target);if(s.phase!=='ended'||!s.availableEndings.some(e=>e.id===s.ending?.id))return existing;
  s.endingConfirmed=true;s.eggs=['egg-'+s.ending.id];const collection=mergeCollection(existing,{endings:[s.ending.id],eggs:s.eggs,best:s.score});remember(target,collection);
  try{target?.setItem?.(COLLECTION_KEY,JSON.stringify(collection));}catch{}
  return mergeCollection(collection,null);
}
