import View from '@/views/Home';
import {pageMetadata} from '@/i18n/metadata';
export const generateMetadata=()=>pageMetadata('/');
export default function Page(){return <View/>;}
