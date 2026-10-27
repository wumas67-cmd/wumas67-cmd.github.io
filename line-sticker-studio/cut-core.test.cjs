const assert=require('node:assert/strict'),C=require('./cut-core.js');
const w=120,h=80,d=new Uint8ClampedArray(w*h*4);for(let i=0;i<w*h;i++)d.set([0,255,0,255],i*4);
function rect(x,y,r,b,color){for(let j=y;j<y+b;j++)for(let i=x;i<x+r;i++)d.set(color,(j*w+i)*4)}
rect(10,10,25,20,[240,80,20,255]);rect(70,40,25,20,[70,20,240,255]);
let bg=C.background(d,w,h,'auto');assert.deepEqual(bg,[0,255,0]);let mask=C.mask(d,w,h,bg,30),boxes=C.detect(mask,w,h,0,.18);assert.equal(boxes.length,2);assert.equal(boxes[0].w,25);assert.equal(mask[0],0);assert.equal(mask[11*w+11],1);
rect(12,34,12,4,[0,0,0,255]);mask=C.mask(d,w,h,bg,30);assert.equal(C.detect(mask,w,h,0,.01).length,3);assert.equal(C.detect(mask,w,h,5,.01).length,2);
// Enclosed white sticker detail is protected from edge-connected white removal.
const white=new Uint8ClampedArray(20*20*4).fill(255);for(let y=4;y<16;y++)for(let x=4;x<16;x++){if(x===4||x===15||y===4||y===15)white.set([0,0,0,255],(y*20+x)*4)}
const m=C.mask(white,20,20,[255,255,255],20);assert.equal(m[0],0);assert.equal(m[10*20+10],1);
assert.equal(C.detect(new Uint8Array(100),10,10,0,.01).length,0);
assert.deepEqual(C.background(new Uint8Array(400),10,10,'auto'),null);
// An anti-aliased black outline and white fur must lose green spill without losing white detail.
const fw=18,fh=9,fringe=new Uint8ClampedArray(fw*fh*4);for(let i=0;i<fw*fh;i++)fringe.set([0,255,0,255],i*4);
const put=(x,y,c)=>fringe.set([...c,255],(y*fw+x)*4);
for(let y=2;y<=6;y++)for(let x=3;x<=6;x++)put(x,y,[0,0,0]);
for(let y=2;y<=6;y++)for(let x=11;x<=14;x++)put(x,y,[255,255,255]);
put(1,4,[0,160,0]);put(2,4,[0,100,0]);put(10,4,[128,255,128]);
const fm=C.flatMask(fringe,fw,fh,[0,255,0],25);C.despill(fringe,fw,fh,[0,255,0],fm,70);
assert.equal(fringe[(4*fw+0)*4+3],0);
assert.ok(fringe[(4*fw+2)*4+1]<15);
assert.ok(fringe[(4*fw+2)*4+3]>100&&fringe[(4*fw+2)*4+3]<200);
assert.ok(fringe[(4*fw+1)*4+1]<15);
assert.ok(fringe[(4*fw+10)*4]>240&&fringe[(4*fw+10)*4+1]>240);
assert.ok(fringe[(4*fw+10)*4+3]>90&&fringe[(4*fw+10)*4+3]<190);
assert.deepEqual([...fringe.slice((4*fw+12)*4,(4*fw+12)*4+4)],[255,255,255,255]);
console.log('PASS: background inference, edge flood, component bounds, gap merge, white detail, empty image, green fringe');

// Physical atlas geometry: 20px between frames in both directions, even LINE dimensions.
for(const cols of [4,5]){
 const layout=C.sheetLayout(cols,4);assert.equal(layout.width,cols*390);assert.equal(layout.height,1360);
 assert.equal(layout.frames[0].x,10);assert.equal(layout.frames[0].y,10);
 for(let i=0;i<layout.frames.length;i++){
  const b=layout.frames[i];assert.equal(b.w,370);assert.equal(b.h,320);
  if(i%cols)assert.equal(b.x-(layout.frames[i-1].x+370),20);
  if(i>=cols)assert.equal(b.y-(layout.frames[i-cols].y+320),20);
 }
}
// Whole composition fits with safety margins, including thin and high-resolution source frames.
for(const [sw,sh] of [[1402,1122],[800,30],[30,800],[370,320]])for(const pad of [10,20,50]){
 const r=C.fitRect(sw,sh,370,320,pad);assert.ok(r.x>=pad&&r.y>=pad);assert.ok(r.x+r.w<=370-pad&&r.y+r.h<=320-pad);
 assert.ok(Math.abs(r.w/r.h-sw/sh)<=sw/sh/r.h+1/r.h);
}
// Disconnected text stays with its character, blank cells are omitted, touching edges are flagged.
const g=new Uint8ClampedArray(80*40*4),pixel=(x,y,a=255)=>g[(y*80+x)*4+3]=a;
pixel(5,3);pixel(16,15);pixel(42,4);pixel(52,14);pixel(1,29,1);pixel(19,30);
let grouped=C.gridBounds(g,80,40,4,2);assert.equal(grouped.boxes.length,3);assert.deepEqual(grouped.boxes[0],{x:5,y:3,w:12,h:13});assert.deepEqual(grouped.edgeCells,[5]);
assert.equal(C.gridBounds(new Uint8ClampedArray(80*40*4),80,40,4,2).boxes.length,0);
assert.equal(C.alphaBounds(new Uint8ClampedArray(16),2,2),null);
console.log('PASS: 20px sheet gutters, 370x320 frames, safety padding, disconnected text grouping, empty cells, edge warnings');

// Exercise the actual generated prompts, including batch 2 (17–32) of a 48-sticker 4x4 project.
const vm=require('node:vm'),fs=require('node:fs'),source=fs.readFileSync(__dirname+'/app.js','utf8');
const extract=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end,source.indexOf(start)));
const promptState={grid:'4x4',count:48,texts:Array.from({length:50},(_,i)=>'文字'+(i+1)),characterSource:'reference',style:'童趣手繪貼紙風',palette:'柔和粉嫩',textMode:'ai',design:{textRatio:'25',fontStyle:'natural',fontColorPreset:'auto',textStroke:'auto'}};
const ctx=vm.createContext({state:promptState,CutCore:C});
vm.runInContext(extract('function gridSpec()', 'function resetSheets()')+extract('const fontLabels=', 'function renderDesignPreview()')+extract('function promptFor(batch)', 'function renderPrompts()'),ctx);
for(const background of ['transparent','green']){
 promptState.promptBackground=background;
 const prompt=vm.runInContext('promptFor(batches()[1])',ctx);
 for(const expected of ['第 2 批（共 3 批）','17–32','4 欄 × 4 列，共 16 格','1560 × 1360px','370 × 320px','水平與垂直淨間距均為 20px','距圖框四邊至少 10px','350 × 300px'])assert.ok(prompt.includes(expected),expected);
 assert.ok(!prompt.includes('1950'));assert.ok(prompt.includes('「文字17」')&&prompt.includes('「文字32」'));assert.ok(!prompt.includes('「文字33」'));
}
promptState.count=18;let last=vm.runInContext('promptFor(batches()[1])',ctx);assert.ok(last.includes('第 3–16 格保持純 #00FF00 綠色空白'));assert.ok(last.includes('1560 × 1360px'));
promptState.grid='5x4';assert.ok(vm.runInContext('promptFor(batches()[0])',ctx).includes('1950 × 1360px'));
console.log('PASS: actual 4x4 prompts, batch 17-32, transparent and green spacing, partial final batch, 5x4 compatibility');
