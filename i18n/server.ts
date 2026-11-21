import 'server-only';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {headers} from 'next/headers';
import {localeInfo} from './registry';
const catalogues=new Map<string,{version:string;messages:Record<string,string>}>();
export async function getCatalogue(code:string){
 if(!localeInfo(code))throw Error('Unsupported locale');
 const base=path.join(process.cwd(),'i18n/catalogues'),sourceFile=path.join(base,'en.json'),targetFile=code==='en'?sourceFile:path.join(base,code+'.locale.json');
 const [sourceStat,targetStat]=await Promise.all([stat(sourceFile),stat(targetFile)]),version=sourceStat.mtimeMs+':'+targetStat.mtimeMs;
 const cached=catalogues.get(code);if(cached?.version===version)return cached.messages;
 const source=JSON.parse(await readFile(sourceFile,'utf8')) as Record<string,string>;
 const messages:Record<string,string>={};
 if(code==='en'){for(const text of Object.values(source))messages[text]=text;}
 else{const draft=JSON.parse(await readFile(targetFile,'utf8'));for(const[key,text]of Object.entries(source)){const entry=draft.entries[key];if(!entry?.text?.trim()||entry.source!==text)throw Error('Incomplete catalogue '+code+': '+key);const placeholders=(s:string)=>(s.match(/\{[^}]+\}/g)??[]).sort().join('|');if(placeholders(text)!==placeholders(entry.text))throw Error('Invalid placeholders '+code+': '+key);messages[text]=entry.text;}}
 catalogues.set(code,{version,messages});return messages;
}
export async function requestLocale(){return localeInfo((await headers()).get('x-ucxo-locale')??'en')?.code??'en';}