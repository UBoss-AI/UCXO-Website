import {notFound} from 'next/navigation';
import Preview from '@/views/CarouselPreview';
import Home from '@/views/Home';
import How from '@/views/HowItWorks';
import Demo from '@/views/BookADemo';
import {localeInfo} from '@/i18n/registry';
import {pageMetadata} from '@/i18n/metadata';
type Props={params:Promise<{locale:string;slug?:string[]}>};
const route=(slug?:string[])=>'/'+(slug?.join('/')??'')+(slug?.length?'/':'');
export async function generateMetadata({params}:Props){return pageMetadata(route((await params).slug));}
export default async function Page({params}:Props){const {locale,slug}=await params;if(!localeInfo(locale))notFound();const path=route(slug);if(path==='/')return <Home/>;if(path==='/how-it-works/')return <How/>;if(path==='/book-a-demo/')return <Demo/>;if(path==='/carousel-preview/')return <Preview/>;notFound();}
