const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const {chapters}=require('../components/story-data.ts');
const timingFile=path.join(root,'components/narration-timing.ts');
const previous=fs.existsSync(timingFile)?require(timingFile).narrationTiming:null;
function readWave(file){const b=fs.readFileSync(file);let format,data;for(let p=12;p+8<=b.length;){const size=b.readUInt32LE(p+4),name=b.toString('ascii',p,p+4);if(name==='fmt ')format=b.subarray(p+8,p+8+size);if(name==='data')data=b.subarray(p+8,p+8+size);p+=8+size+(size%2);}if(!format||!data||format.readUInt16LE(0)!==1||format.readUInt16LE(14)!==16)throw Error('Expected PCM16 WAV');return{format,data};}
const metadata=chapters.map((chapter,i)=>{
 const file=path.join(root,`public/narration/chapter-${i+1}-heart.wav`),{format,data}=readWave(file),bytesPerSecond=format.readUInt32LE(8),rate=format.readUInt32LE(4),channels=format.readUInt16LE(2);
 const prior=previous?.[i],fileDuration=data.length/bytesPerSecond;
 const speechDuration=prior&&Math.abs(fileDuration-prior.duration)<.001?prior.points[prior.points.length-1].at:fileDuration;
 // Sentence pauses align the continuous recording to the existing visual beats.
 const gaps=[];let start=null;const window=Math.round(rate*.02)*channels*2;
 for(let p=0;p<data.length;p+=window){let sum=0,count=0;for(let k=p;k<Math.min(p+window,data.length);k+=2){sum+=Math.abs(data.readInt16LE(k));count++;}if(sum/count<130){if(start===null)start=p/bytesPerSecond;}else if(start!==null){const end=p/bytesPerSecond;if(end-start>=.12&&start>.3)gaps.push((start+end)/2);start=null;}}
 const weights=chapter.captions.map(c=>c.text.split(/\s+/).length),total=weights.reduce((a,b)=>a+b,0);let words=0,previous=0;
 const points=chapter.captions.map((cue,j)=>{const target=words/total*speechDuration;words+=weights[j];let at=j?target:0;const nearby=gaps.filter(g=>g>previous+.5&&Math.abs(g-target)<1.1).sort((a,b)=>Math.abs(a-target)-Math.abs(b-target));if(j&&nearby.length)at=nearby[0];previous=at;return{at:Number(at.toFixed(3)),storyAt:cue.at};});
 points.push({at:Number(speechDuration.toFixed(3)),storyAt:chapter.duration});
 const duration=Math.max(chapter.duration,Math.ceil((speechDuration+.2)*10)/10),pcm=Buffer.alloc(Math.ceil(duration*rate)*channels*2);data.copy(pcm);
 const header=Buffer.alloc(44);header.write('RIFF');header.writeUInt32LE(36+pcm.length,4);header.write('WAVEfmt ',8);header.writeUInt32LE(16,16);format.copy(header,20,0,16);header.write('data',36);header.writeUInt32LE(pcm.length,40);fs.writeFileSync(file,Buffer.concat([header,pcm]));
 console.log({chapter:i+1,speechDuration,duration,cueStarts:points.map(p=>p.at)});return{duration,points};
});
fs.writeFileSync(path.join(root,'components/narration-timing.ts'),`// Kokoro Heart, official hexgrad demo, speed 1.0. Original Chief Engine script.\nexport const narrationTiming=${JSON.stringify(metadata,null,2)} as const;\nexport function narrationStoryTime(chapter:number,time:number){const points=narrationTiming[chapter].points;for(let i=1;i<points.length;i++){if(time<points[i].at){const a=points[i-1],b=points[i];return a.storyAt+(b.storyAt-a.storyAt)*Math.max(0,(time-a.at)/(b.at-a.at));}}return points[points.length-1].storyAt;}\n`);
