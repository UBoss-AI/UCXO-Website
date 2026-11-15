const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {tourChapters}=require('../components/product-tour-data.ts');
const {productTourTiming,productTourDuration}=require('../components/product-tour-timing.ts');
const {tourPosition,tourStepPosition}=require('../components/product-tour-clock.ts');

test('all five tours have complete narration timings and original screen assets',()=>{
 assert.equal(tourChapters.length,5);assert.equal(productTourTiming.length,5);
 let end=0;
 tourChapters.forEach((chapter,i)=>{
  const timing=productTourTiming[i];assert.equal(chapter.steps.length,timing.steps.length);
  assert.ok(Math.abs(timing.start-end)<.003);
  chapter.steps.forEach((step,j)=>{
   assert.ok(fs.existsSync(path.join(__dirname,'../public/product-previews',step.screen+'.webp')),step.screen);
   assert.ok(timing.steps[j].duration>=5);assert.ok(timing.steps[j].speechDuration>0);
   assert.ok(step.focus.x>=0&&step.focus.y>=0&&step.focus.x+step.focus.w<=100&&step.focus.y+step.focus.h<=100);
   if(step.click){assert.ok(j>0,'clicks need a real source screen');assert.ok(step.click.every(n=>n>=0&&n<=100));}
  });end=timing.start+timing.duration;
 });assert.ok(Math.abs(end-productTourDuration)<.003);
});
test('one continuous clock crosses every explanation and carousel boundary correctly',()=>{
 productTourTiming.forEach((chapter,c)=>chapter.steps.forEach((step,s)=>{
  const at=tourPosition(step.start+.01,productTourTiming);assert.equal(at.chapter,c);assert.equal(at.step,s);
  const exact=tourPosition(step.start-Number.EPSILON*Math.max(1,step.start),productTourTiming);assert.equal(exact.chapter,c);assert.equal(exact.step,s);
  if(s>0||c>0){const before=tourPosition(step.start-.01,productTourTiming);assert.ok(before.chapter!==c||before.step!==s);}
 }));
 const last=tourPosition(productTourDuration-.001,productTourTiming);assert.equal(last.chapter,4);assert.equal(last.step,tourChapters[4].steps.length-1);
 productTourTiming.forEach(chapter=>assert.equal(tourStepPosition(productTourDuration,chapter.steps).step,chapter.steps.length-1,'outgoing cards keep their last screen during a horizontal transition'));
});
test('the master narration contains audible speech in every explanation',()=>{
 const wav=fs.readFileSync(path.join(__dirname,'../public/narration/product-tour.wav'));
 assert.equal(wav.toString('ascii',0,4),'RIFF');const rate=wav.readUInt32LE(24);
 assert.ok(Math.abs((wav.length-44)/2/rate-productTourDuration)<.01);
 for(const chapter of productTourTiming)for(const step of chapter.steps){let energy=0,count=0;const start=Math.floor((step.start+.25)*rate),stop=Math.floor((step.start+Math.min(step.speechDuration-.1,3))*rate);for(let i=start;i<stop;i+=12){const x=wav.readInt16LE(44+i*2)/32768;energy+=x*x;count++;}assert.ok(count>0&&Math.sqrt(energy/count)>.004,`silent narration at ${step.start}`);}
});
