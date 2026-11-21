const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'../i18n'),locales=JSON.parse(fs.readFileSync(path.join(root,'locales.json'))),source=JSON.parse(fs.readFileSync(path.join(root,'catalogues/en.json'))),glossary=JSON.parse(fs.readFileSync(path.join(root,'glossary.json')));
const placeholders=s=>(s.match(/\{[^}]+\}/g)||[]).sort().join('|');
const report={sourceMessages:Object.keys(source).length,locales:[],structuralErrors:[],reviewRequired:[]};
for(const locale of locales){
 if(locale.code==='en')continue;let c;
 try{c=JSON.parse(fs.readFileSync(path.join(root,'catalogues',locale.code+'.locale.json')));}catch{report.structuralErrors.push({locale:locale.code,kind:'catalogue-missing'});continue;}
 const row={locale:locale.code,missing:[],stale:[],placeholders:[],artifacts:[],identical:[],extra:Object.keys(c.entries).filter(k=>!source[k])};
 for(const[key,text]of Object.entries(source)){
  const entry=c.entries[key];if(!entry?.text?.trim()){row.missing.push(key);continue;}
  if(entry.source!==text)row.stale.push(key);
  if(/\n\d{3}[.\s⟧]|[⟦⟧⟪⟫]|ZXQKEEP/.test(entry.text))row.artifacts.push(key);
  if(placeholders(text)!==placeholders(entry.text))row.placeholders.push(key);
  if(entry.text===text&&!glossary[text]&&!(typeof entry.identicalApproved==='string'&&entry.identicalApproved.trim().length>=5)&&/[A-Za-z]{2}/.test(text))row.identical.push({key,source:text});
 }
 report.locales.push(row);
 for(const kind of ['missing','stale','placeholders','artifacts','extra'])if(row[kind].length)report.structuralErrors.push({locale:locale.code,kind,keys:row[kind]});
 if(c.status!=='reviewed'||row.identical.length)report.reviewRequired.push({locale:locale.code,status:c.status,unreviewedIdentical:row.identical.length});
}
fs.writeFileSync(path.join(root,'validation-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({locales:locales.length,messages:report.sourceMessages,structuralErrors:report.structuralErrors.map(e=>({locale:e.locale,kind:e.kind,count:e.keys?.length})),fluentReview:report.reviewRequired.length},null,2));
if(report.structuralErrors.length||(process.argv.includes('--release')&&report.reviewRequired.length))process.exitCode=1;