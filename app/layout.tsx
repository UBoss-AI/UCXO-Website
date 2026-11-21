import './globals.css';
import './responsive.css';
import '@/i18n/localization.css';
import {LocaleProvider} from '@/i18n/LocaleProvider';
import {getCatalogue,requestLocale} from '@/i18n/server';
import {localeInfo} from '@/i18n/registry';
export const dynamic='force-dynamic';
export default async function RootLayout({children}:{children:React.ReactNode}){const locale=await requestLocale(),messages=await getCatalogue(locale);return <html lang={locale} dir={localeInfo(locale)?.dir as 'rtl'|'ltr'}><body><LocaleProvider locale={locale} messages={messages}>{children}</LocaleProvider></body></html>;}
