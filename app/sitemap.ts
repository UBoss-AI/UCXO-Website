import type {MetadataRoute} from 'next';
import {locales,localeHref} from '@/i18n/registry';
export default function sitemap():MetadataRoute.Sitemap{return locales.flatMap(l=>['/','/how-it-works/','/book-a-demo/'].map(path=>({url:'https://chief-engine.vercel.app'+localeHref(l.code,path)})));}
