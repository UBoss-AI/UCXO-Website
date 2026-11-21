import registry from './locales.json';
export const locales=registry;
export const localeInfo=(code:string)=>locales.find(l=>l.code===code);
export function parseLocalePath(path:string){const first=path.split('/')[1],locale=localeInfo(first);return {locale:locale?.code??'en',path:locale?path.slice(first.length+1)||'/':path};}
export function localeHref(code:string,href:string){if(!href.startsWith('/')||href.startsWith('//'))return href;const marker=href.search(/[?#]/),path=marker<0?href:href.slice(0,marker),suffix=marker<0?'':href.slice(marker);return (code==='en'?'':'/'+code)+parseLocalePath(path).path+suffix;}
