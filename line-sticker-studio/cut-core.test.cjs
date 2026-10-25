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
