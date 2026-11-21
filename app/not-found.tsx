import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {getCatalogue,requestLocale} from '@/i18n/server';
import {localeHref} from '@/i18n/registry';
export default async function NotFound(){const locale=await requestLocale(),m=await getCatalogue(locale);return <><Header/><main className="localized-not-found"><h1>{m['Page not found']}</h1><p>{m['The page you requested could not be found.']}</p><a className="button primary" href={localeHref(locale,'/')}>{m['Return home']}</a></main><Footer/></>;}
