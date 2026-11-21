import {NextResponse,type NextRequest} from 'next/server';
import {localeInfo,localeHref,parseLocalePath} from './i18n/registry';
const routes=new Set(['/','/how-it-works/','/book-a-demo/','/carousel-preview/','/localized-404/']);
export function proxy(request:NextRequest){
 const pathname=request.nextUrl.pathname,explicit=localeInfo(pathname.split('/')[1]),saved=request.cookies.get('ucxo-language')?.value;
 const respond=(response:NextResponse)=>{if(explicit&&saved!==explicit.code)response.cookies.set('ucxo-language',explicit.code,{path:'/',maxAge:31536000,sameSite:'lax',secure:request.nextUrl.protocol==='https:'});return response;};
 if(!explicit&&saved&&saved!=='en'&&localeInfo(saved)&&pathname!=='/localized-404/'){
  const url=request.nextUrl.clone();url.pathname=localeHref(saved,pathname);const response=NextResponse.redirect(url);response.headers.set('Cache-Control','private, no-store');return response;
 }
 const parsed=parseLocalePath(pathname),normalized=parsed.path.endsWith('/')?parsed.path:parsed.path+'/';
 if(!routes.has(normalized)){const url=request.nextUrl.clone();url.pathname='/localized-404/';url.searchParams.set('locale',parsed.locale);return respond(NextResponse.rewrite(url));}
 const headers=new Headers(request.headers);headers.set('x-ucxo-locale',parsed.locale);return respond(NextResponse.next({request:{headers}}));
}
export const config={matcher:['/((?!_next/|api/|partners/|product-previews/|narration/|sitemap.xml|robots.txt).*)']};