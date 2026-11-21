
import fs from 'node:fs/promises';
const root='i18n/catalogues/';
const source=JSON.parse(await fs.readFile(root+'en.json','utf8'));
const locales=JSON.parse(await fs.readFile('i18n/locales.json','utf8')).map(x=>x.code).filter(x=>x!=='en');
const protect=/UUsers|UAvatar|UAvator|UCXO\.AI|\{[A-Za-z0-9_]+\}|{{\s*\w+\s*}}|UDashview|U&Me|USpace|UMaster|UPingme|UApprove|UForms|URecords|UTraining|UDO|U-Engine|UEngine|Engine Planner|UCXO|UBOSS|[\w.+-]+@ubossai\.com|\+917303089502/gi;
const digit=s=>s.replace(/[٠-٩۰-۹０-９]/g,c=>String(c.codePointAt(0)%16<10?c.codePointAt(0)%16:c.codePointAt(0)-0x6f0));
const brandByLower=new Map(Object.entries(JSON.parse(await fs.readFile('i18n/glossary.json','utf8'))).map(([source,target])=>[source.toLowerCase(),target]));
const target=code=>({'zh-Hans':'zh-CN','zh-Hant':'zh-TW',nb:'no',fil:'tl'}[code]||code);
const gap=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function translate(q,code){
 await gap(525);
 const params=new URLSearchParams({client:'gtx',sl:'en',tl:target(code),dt:'t',q});
 const r=await fetch('https://translate.googleapis.com/translate_a/single?'+params,{signal:AbortSignal.timeout(30000)});
 if(r.status===429||r.status===403) throw Error('Translation service refused further requests (HTTP '+r.status+')');
 if(!r.ok)throw Error('HTTP '+r.status);
 return (await r.json())[0].map(x=>x[0]||'').join('');
}
function prepare(text){
 const protectedValues=[];
 const input=text.replace(protect,x=>{protectedValues.push(brandByLower.get(x.toLowerCase())??x);return '⟪'+String(701+protectedValues.length-1)+'⟫';});
 return {input,protectedValues};
}
function restore(text,values){
 if(!text)return '';
 const used=new Set();
 const result=text.trim().replace(/[⟪〈《«]\s*([0-9٠-٩۰-۹０-９]{3})\s*[⟫〉》»]/g,(all,index)=>{
   index=Number(digit(index))-701;
   if(used.has(index)||values[index]===undefined)return all;
   used.add(index);return values[index];
 });
 return used.size===values.length&&!/[⟪⟫]/.test(result)?result:'';
}
function parse(text){
 const tagged=[...text.matchAll(/⟦\s*([0-9٠-٩۰-۹０-９]{3})\s*⟧?/g)];
 const index=new Map();
 for(const [n,match] of tagged.entries()){
   const id=Number(digit(match[1]))-100;
   if(index.has(id))return new Map();
   index.set(id,text.slice(match.index+match[0].length,tagged[n+1]?.index).trim());
 }
 return index;
}
async function getCatalog(code){
 try{return JSON.parse(await fs.readFile(root+code+'.locale.json','utf8'));}
 catch(e){if(e.code!=='ENOENT')throw e;return {status:'draft',entries:{}};}
}
async function generate(code){
 const catalog=await getCatalog(code);
 if(catalog.status==='reviewed')for(const entry of Object.values(catalog.entries))entry.reviewed=true;
 const entries=Object.entries(source).filter(([key,text])=>catalog.entries[key]?.source!==text||!catalog.entries[key]?.text);
 const batches=[];let current=[],size=0;
 for(const [key,text] of entries){
   const job={key,text,...prepare(text)};
   const bytes=encodeURIComponent(job.input).length+35;
   if(current.length&&(size+bytes>3700||current.length>=27)){batches.push(current);current=[];size=0;}
   current.push(job);size+=bytes;
 }
 if(current.length)batches.push(current);
 for(const batch of batches){
   const payload=batch.map((job,index)=>'⟦'+(100+index)+'⟧\n'+job.input).join('\n');
   const parts=parse(await translate(payload,code));
   for(const [index,job] of batch.entries()){
     let text=restore(parts.get(index),job.protectedValues);
     if(text&&!/\n\d{3}[.\s⟧]|[⟦⟧⟪⟫]|ZXQKEEP/.test(text)) catalog.entries[job.key]={source:job.text,text};
   }
   catalog.status='draft';
   await fs.writeFile(root+code+'.locale.json',JSON.stringify(catalog,null,2)+'\n');
 }
 const remaining=Object.entries(source).filter(([key,text])=>catalog.entries[key]?.source!==text||!catalog.entries[key]?.text);
 console.log(code+' '+(Object.keys(source).length-remaining.length)+'/'+Object.keys(source).length);
}
const todo=process.argv.length>2?process.argv.slice(2):locales;
let cursor=0, failure;
const workers=Array.from({length:2},async()=>{
 while(!failure&&cursor<todo.length){
   try{await generate(todo[cursor++]);}
   catch(error){failure=error;throw error;}
 }
});
const results=await Promise.allSettled(workers);
if(failure){console.error(failure.message);process.exitCode=1;}
