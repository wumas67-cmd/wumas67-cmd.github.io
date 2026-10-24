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
console.log('PASS: background inference, edge flood, component bounds, gap merge, white detail, empty image, transparency');
