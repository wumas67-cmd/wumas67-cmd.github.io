// Shared prompt and browser typography options. Existing IDs retain their meaning.
const StudioOptions = (() => {
 const fonts = {"bold": {"label": "粗黑體", "description": "筆畫厚實、結構清楚，縮小後仍容易閱讀。", "family": "sans-serif"}, "round": {"label": "圓體", "description": "圓潤筆端與均勻筆畫，親切柔和。", "family": "sans-serif"}, "bubble": {"label": "圓潤泡泡字", "description": "飽滿圓鼓的泡泡造型，保留清楚的字內空間。", "family": "sans-serif"}, "natural": {"label": "自然手寫體", "description": "舊式墨水鋼筆寫法，筆端有收放與少量墨色不均，古樸而清楚。", "family": "cursive"}, "marker": {"label": "毛筆字", "description": "自然毛筆粗細變化，筆畫完整易辨認。", "family": "serif"}, "retro": {"label": "復古印刷字", "description": "復古印刷字形，輕微質感但不破壞筆畫。", "family": "serif"}, "pixel": {"label": "像素字", "description": "整齊方格像素構成文字，避免筆畫黏連。", "family": "monospace"}, "upright": {"label": "立體字", "description": "有厚度的立體字面，立體效果限制在文字區域內。", "family": "sans-serif"}, "street": {"label": "街頭塗鴉字", "description": "活潑自由的街頭字形，文字結構仍須正確清晰。", "family": "sans-serif"}, "pop": {"label": "Pop Art 粗體", "description": "漫畫式厚重字形與鮮明色塊，強烈節奏且輪廓清楚。", "family": "sans-serif"}, "sign": {"label": "復古招牌字", "description": "傳統招牌手寫味，橫豎筆畫富有節奏，端正清楚。", "family": "serif"}, "cartoon": {"label": "卡通粗體", "description": "有彈性的卡通粗字，字形生動但不扭曲筆畫。", "family": "sans-serif"}, "heavyround": {"label": "厚胖圓體", "description": "厚胖且圓滑的筆畫，保留字間距與內部留白。", "family": "sans-serif"}, "crayon": {"label": "蠟筆塗鴉字", "description": "蠟筆顆粒只出現在筆畫內，線條完整且有童趣。", "family": "cursive"}, "felt": {"label": "麥克筆手寫字", "description": "寬頭麥克筆自然書寫，粗細適中、清楚有力。", "family": "cursive"}, "journal": {"label": "少女手帳字", "description": "輕盈整齊的手帳手寫感，不額外加入符號。", "family": "cursive"}, "sketch": {"label": "塗鴉速寫字", "description": "隨性的快速手寫線條，筆畫不省略、不連成難辨字。", "family": "cursive"}, "child": {"label": "童趣手寫字", "description": "稚趣活潑的手寫字，略有不規則但字形正確。", "family": "cursive"}, "pen": {"label": "鋼筆手寫字", "description": "鋼筆筆尖的精細轉折與收筆，筆畫乾淨完整。", "family": "cursive"}, "vintagepen": {"label": "復古鋼筆字", "description": "舊式鋼筆的收放筆觸與輕微墨色變化，古樸易讀。", "family": "cursive"}, "kaishu": {"label": "毛筆楷書", "description": "端正毛筆楷書，起收筆清楚、結構平衡。", "family": "serif"}, "cursive": {"label": "毛筆草書", "description": "流動毛筆草書風格，但保留所有可辨識筆畫，不使用難辨連筆。", "family": "cursive"}, "ming": {"label": "細長明體", "description": "細長明體字形與清晰襯線，縮小後仍保有足夠筆畫厚度。", "family": "serif"}, "chalk": {"label": "粉筆黑板字", "description": "粉筆乾燥質感限於字內，不畫黑板或底板。", "family": "cursive"}, "comic": {"label": "漫畫標語字", "description": "有張力的漫畫標語字，筆畫粗壯、字距清楚。", "family": "sans-serif"}, "hardpen": {"label": "粗獷硬筆字", "description": "硬筆的俐落稜角與厚實力度，筆畫不破碎。", "family": "sans-serif"}, "minimal": {"label": "現代簡約手寫字", "description": "簡潔自然的手寫字，減少裝飾，清楚呈現每個字。", "family": "cursive"}, "custom": {"label": "自訂字體風格", "description": "", "family": "sans-serif"}};
 const styles = ["韓系Q版", "童趣手繪貼紙風", "可愛 Q 版", "3D 公仔", "清新水彩", "扁平插畫", "照片級寫實", "日系 Chibi", "黑白線稿", "柔和水彩", "美式卡通", "簡筆火柴人", "高質感3D手繪貼圖風"];

 // 主角色調：寫入提示詞，並在網頁預覽的角色示意上色
 const tones={auto:{label:'不指定（依角色描述或參考圖）'},cream:{label:'奶油白',hex:'#F5ECD7',desc:'柔和奶油白，乾淨溫暖'},caramel:{label:'焦糖奶茶棕',hex:'#C08A5B',desc:'溫暖的焦糖奶茶色，親切療癒'},honey:{label:'蜂蜜黃',hex:'#F3C64F',desc:'明亮蜂蜜黃，活潑有朝氣'},peach:{label:'蜜桃粉',hex:'#F7A8A0',desc:'甜美蜜桃粉，柔和可愛'},sakura:{label:'櫻花粉',hex:'#F5B5CB',desc:'淡雅櫻花粉，少女感'},coral:{label:'珊瑚橘',hex:'#FF8A65',desc:'鮮明珊瑚橘，熱情醒目'},mint:{label:'薄荷綠',hex:'#9ADBC5',desc:'清爽薄荷綠，舒服自然'},matcha:{label:'抹茶綠',hex:'#93B464',desc:'沉穩抹茶綠，日系文青'},sky:{label:'天空藍',hex:'#8CC8EE',desc:'乾淨天空藍，輕快明亮'},haze:{label:'霧灰藍',hex:'#8E9FB8',desc:'低彩度霧灰藍，簡約耐看'},lavender:{label:'薰衣草紫',hex:'#B8A2E3',desc:'夢幻薰衣草紫，溫柔浪漫'},mono:{label:'黑白雙色',hex:'#3A3A3A',desc:'以黑、白兩色為主（如熊貓、邊牧），小面積亮色點綴'},custom:{label:'自訂顏色…'}};
 const positions={bottom:'下方',top:'上方',side:'角色側邊（右側）',auto:'自動避開臉部'};
 const strokes={double:'雙層描邊（內淺外深・模切貼紙感）',auto:'非白色高對比描邊',dark:'深灰黑色描邊',black:'黑色描邊',white:'白色描邊（僅文字）',none:'不描邊'};
 const frames={none:'無外框',round:'圓角對話框',burst:'爆炸對話框（驚訝、激動）',cloud:'雲朵思考框',note:'手寫便條紙'};
 const frameText={round:'圓角對話框：圓潤邊角、尾巴指向角色',burst:'爆炸對話框：鋸齒放射狀外框，表現驚訝或激動',cloud:'雲朵思考框：蓬鬆雲朵外形，尾巴用兩三個小圓點連向角色',note:'手寫便條紙：略微傾斜的小紙片，上方貼一小段紙膠帶'};
 const decors={none:'不加點綴',auto:'依句子情緒自動選擇',heart:'固定：愛心',sparkle:'固定：閃光星星'};
 // 依關鍵字判斷句子情緒，對應日式漫畫符號（漫符）
 const moods=[
  {id:'angry',label:'怒氣符號',color:'#ef454f',kw:['生氣','氣死','不爽','可惡','哼','怒','煩','討厭','火大']},
  {id:'sad',label:'淚滴',color:'#318dcc',kw:['哭','嗚','難過','傷心','委屈','好慘','崩潰']},
  {id:'surprise',label:'驚嘆放射線',color:'#e6a42a',kw:['傻眼','真的假的','嚇','蛤','什麼','天啊','救命','驚','誇張']},
  {id:'sweat',label:'汗滴',color:'#5aa9e6',kw:['對不起','抱歉','尷尬','糟糕','無言','歹勢','sorry','緊張','慘了']},
  {id:'sleep',label:'ZZZ 睡覺符號',color:'#7544a2',kw:['睡','晚安','睏','好累','累了','想睡','休息']},
  {id:'love',label:'愛心',color:'#eb70ac',kw:['謝謝','感謝','感恩','愛','喜歡','抱抱','想你','親親','麼麼','啾','生日','心']},
  {id:'sun',label:'小太陽',color:'#f2a33a',kw:['早安','早啊','早上好','起床','早']},
  {id:'music',label:'音符',color:'#36a56b',kw:['哈','開心','耶','週末','下班','快樂','好棒','嘻','唱','旅途','出發','放假']},
  {id:'sparkle',label:'閃光星星',color:'#e6a42a',kw:['讚','加油','棒','恭喜','太好','衝','沒問題','好的','收到','可以','了解','OK','ok','辛苦','厲害','成功','處理','確認']}
 ];
 const moodById=Object.fromEntries(moods.map(m=>[m.id,m]));
 function moodFor(text){const t=String(text||'');for(const m of moods)if(m.kw.some(k=>t.includes(k)))return m;return t.trim()?{id:'motion',label:'動感短線',color:'#e6a42a'}:null}
 function decorFor(mode,text){if(!String(text||'').trim()||mode==='none'||!mode)return null;if(mode==='auto')return moodFor(text);return moodById[mode==='heart'?'love':mode]||null}
 function motherLayout(cols,rows=4){return {width:cols*400,height:rows*400,cell:400,safe:20,gap:40}}
 function regions(position,ratio){
  const p=positions[position]?position:'bottom',r=Math.max(.25,Math.min(.70,Number(ratio)/100||.25)),x=18,y=18,w=334,h=284,gap=10;
  if(p==='side'){const tw=w*r;return {text:{x:x+w-tw,y,w:tw,h},character:{x,y,w:w-tw-gap,h}}}
  const th=h*r,top=p==='top';return {text:{x,y:top?y:y+h-th,w,h:th},character:{x,y:top?y+th+gap:y,w,h:h-th-gap}};
 }
 function wrap(ctx,text,width){const lines=[];let line='';for(const ch of Array.from(text)){if(ch==='\n'){lines.push(line);line='';continue}if(line&&ctx.measureText(line+ch).width>width){lines.push(line);line=ch}else line+=ch}if(line)lines.push(line);return lines}
 return {fonts,styles,tones,frames,frameText,decors,moods,moodFor,decorFor,positions,strokes,motherLayout,regions,wrap};
})();
if(typeof module!=='undefined')module.exports=StudioOptions;
