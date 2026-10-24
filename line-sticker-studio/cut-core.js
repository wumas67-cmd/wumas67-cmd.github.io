/* Pure pixel operations, shared by the editor and regression checks. */
(function(root){
function background(data,w,h,mode,color){
 if(mode==='keep')return null;if(mode==='green')return [0,255,0];if(mode==='white')return [255,255,255];if(mode==='custom')return color;
 const bins=new Map();let transparent=0,total=0;
 for(let k=0;k<400;k++){const side=k%4,t=Math.floor(k/4)/99,x=side<2?Math.round(t*(w-1)):(side===2?0:w-1),y=side<2?(side===0?0:h-1):Math.round(t*(h-1));const i=(y*w+x)*4;total++;if(data[i+3]<20){transparent++;continue}const key=[data[i]>>4,data[i+1]>>4,data[i+2]>>4].join(',');const b=bins.get(key)||{n:0,c:[0,0,0]};b.n++;for(let j=0;j<3;j++)b.c[j]+=data[i+j];bins.set(key,b)}
 if(transparent>total*.4)return null;const b=[...bins.values()].sort((a,b)=>b.n-a.n)[0];return b?b.c.map(v=>Math.round(v/b.n)):null;
}
function mask(data,w,h,bg,tolerance){
 const n=w*h,keep=new Uint8Array(n),seen=new Uint8Array(n),q=new Int32Array(n);let head=0,tail=0;
 for(let i=0;i<n;i++)keep[i]=data[i*4+3]>20?1:0;
 if(!bg)return keep;
 const visit=i=>{if(seen[i])return;seen[i]=1;const p=i*4;if(!keep[i]||Math.max(Math.abs(data[p]-bg[0]),Math.abs(data[p+1]-bg[1]),Math.abs(data[p+2]-bg[2]))<=tolerance){keep[i]=0;q[tail++]=i}};
 for(let x=0;x<w;x++){visit(x);visit((h-1)*w+x)}for(let y=0;y<h;y++){visit(y*w);visit(y*w+w-1)}
 while(head<tail){const p=q[head++],x=p%w;if(x)visit(p-1);if(x<w-1)visit(p+1);if(p>=w)visit(p-w);if(p<n-w)visit(p+w)}return keep;
}
function detect(mask,w,h,gap,minArea){
 const seen=new Uint8Array(w*h),q=new Int32Array(w*h),parts=[];
 for(let p=0;p<mask.length;p++){if(!mask[p]||seen[p])continue;let a=0,b=0,count=0,x0=w,y0=h,x1=0,y1=0;q[b++]=p;seen[p]=1;while(a<b){const i=q[a++],x=i%w,y=Math.floor(i/w);count++;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy,j=yy*w+xx;if(xx>=0&&xx<w&&yy>=0&&yy<h&&mask[j]&&!seen[j]){seen[j]=1;q[b++]=j}}}if(count>=3)parts.push({x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,area:count})}
 // Tiny dust cannot consume unbounded merge time.
 if(parts.length>3000)parts.sort((a,b)=>b.area-a.area).splice(3000);
 let changed=true;while(changed){changed=false;outer:for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++){const a=parts[i],b=parts[j];if(a.x<=b.x+b.w+gap&&b.x<=a.x+a.w+gap&&a.y<=b.y+b.h+gap&&b.y<=a.y+a.h+gap){const x=Math.min(a.x,b.x),y=Math.min(a.y,b.y);parts[i]={x,y,w:Math.max(a.x+a.w,b.x+b.w)-x,h:Math.max(a.y+a.h,b.y+b.h)-y,area:a.area+b.area};parts.splice(j,1);changed=true;break outer}}}
 const boxes=parts.filter(b=>b.area>=w*h*minArea/100).sort((a,b)=>a.y-b.y),rows=[];
 for(const b of boxes){let row=rows.find(r=>Math.abs((b.y+b.h/2)-r.cy)<Math.min(r.h,b.h)*.45);if(!row){row={cy:b.y+b.h/2,h:b.h,boxes:[]};rows.push(row)}row.boxes.push(b)}return rows.flatMap(r=>r.boxes.sort((a,b)=>a.x-b.x));
}
const api={background,mask,detect};if(typeof module!=='undefined')module.exports=api;else root.CutCore=api;
})(typeof window!=='undefined'?window:this);
