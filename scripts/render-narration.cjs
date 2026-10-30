// Original narration generated with the installed Windows English voice. No remote service.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process');
const {chapters}=require('../components/story-data.ts');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'chief-narration-'));
const cues=chapters.flatMap((c,i)=>c.captions.map((cue,j)=>({id:`${i}-${j}`,text:cue.text})));
fs.writeFileSync(path.join(temp,'cues.json'),JSON.stringify(cues));
const synth=fs.readFileSync(path.join(__dirname,'synthesize-cues.ps1'),'utf8');
const quote=s=>String(s).replaceAll("'","''");
execFileSync('powershell.exe',['-NoProfile','-Command',"& {"+synth+"} -CueFile '"+quote(path.join(temp,'cues.json'))+"' -OutputDirectory '"+quote(temp)+"'"]);
function readWave(file){const b=fs.readFileSync(file);let format,data;for(let p=12;p+8<=b.length;){const size=b.readUInt32LE(p+4),name=b.toString('ascii',p,p+4);if(name==='fmt ')format=b.subarray(p+8,p+8+size);if(name==='data')data=b.subarray(p+8,p+8+size);p+=8+size+(size%2);}if(!format||!data)throw Error('Invalid WAV');return{format,data};}
const output=path.join(__dirname,'../public/narration');fs.mkdirSync(output,{recursive:true});
for(const[c,cIndex]of chapters.map((c,i)=>[c,i])){let format,pcm;for(let j=0;j<c.captions.length;j++){const wave=readWave(path.join(temp,`${cIndex}-${j}.wav`));format=wave.format;const rate=format.readUInt32LE(8),block=format.readUInt16LE(12);if(!pcm)pcm=Buffer.alloc(c.duration*rate);const cue=c.captions[j],end=c.captions[j+1]?.at??c.duration;const available=(end-cue.at)*rate;if(wave.data.length>available)throw Error(`Speech exceeds cue ${cIndex}-${j}: ${wave.data.length/rate}s > ${end-cue.at}s`);wave.data.copy(pcm,Math.floor(cue.at*rate/block)*block);}
 const header=Buffer.alloc(44);header.write('RIFF');header.writeUInt32LE(36+pcm.length,4);header.write('WAVEfmt ',8);header.writeUInt32LE(16,16);format.copy(header,20,0,16);header.write('data',36);header.writeUInt32LE(pcm.length,40);fs.writeFileSync(path.join(output,`chapter-${cIndex+1}.wav`),Buffer.concat([header,pcm]));console.log(`Chapter ${cIndex+1}: ${c.duration}s, ${pcm.length} PCM bytes`);
}
