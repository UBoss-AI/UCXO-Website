'use client';
import {memo} from 'react';
import {useTranslation} from './LocaleProvider';
/** Translate the complete message; line breaks remain a presentation concern. */
function LocalizedLineBreak({message,englishPrefix,emphasis=false}:{message:string;englishPrefix:string;emphasis?:boolean}){
 const {locale,t}=useTranslation(),text=t(message);
 let boundary=englishPrefix.length;
 if(locale!=='en'){
  const desired=text.length*englishPrefix.length/message.length;
  const segments=Array.from(new Intl.Segmenter(locale,{granularity:'word'}).segment(text));
  const candidates=segments.filter(s=>s.isWordLike&&s.index+s.segment.length<text.length).map(s=>s.index+s.segment.length);
  boundary=candidates.length?candidates.reduce((best,n)=>Math.abs(n-desired)<Math.abs(best-desired)?n:best,candidates[0]):text.length;
 }
 const first=text.slice(0,boundary).trim(),last=text.slice(boundary).trim();
 return <>{first}{last&&<><br/>{emphasis?<span>{last}</span>:last}</>}</>;
}
export default memo(LocalizedLineBreak);
