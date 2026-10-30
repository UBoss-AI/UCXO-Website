const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {narrationTimeline,narrationDuration,narrationPosition}=require('../components/narration-timeline.ts');
const wave=fs.readFileSync(require('node:path').join(__dirname,'../public/narration/chief-engine-explainer.wav'));
const bytesPerSecond=wave.readUInt32LE(28);
function loudness(start,seconds=1){let total=0,count=0;const from=44+Math.round(start*bytesPerSecond/2)*2,to=Math.min(wave.length,from+seconds*bytesPerSecond);for(let p=from;p<to;p+=2){total+=Math.abs(wave.readInt16LE(p));count++;}return total/count;}
test('the complete narration contains audible speech at 18 seconds and in every chapter',()=>{
 assert.ok(narrationDuration>=60&&narrationDuration<=80);
 assert.ok(Math.abs((wave.length-44)/bytesPerSecond-narrationDuration)<.001);
 assert.ok(loudness(18)>100,'18 seconds must contain real speech, not the previous padded silence');
 for(const chapter of narrationTimeline)assert.ok(loudness(chapter.start,2)>100,'each chapter must contain spoken audio');
});
test('one global audio timeline selects the next slide at each chapter boundary',()=>{
 for(let i=1;i<4;i++){const boundary=narrationTimeline[i].start;assert.equal(narrationPosition(boundary-.01).chapter,i-1);assert.equal(narrationPosition(boundary+.01).chapter,i);}
 assert.equal(narrationPosition(18).chapter,1);
});
