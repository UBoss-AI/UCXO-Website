'use client';
import {useLocalize} from '@/i18n/LocaleProvider';
import labels from './product-screen-labels.json';
import './product-screen-labels.css';

export default function ProductScreenLabels({screen}:{screen:string}){const localize=useLocalize();
 const items=labels[screen as keyof typeof labels]??[];
 return localize(<div className="product-screen-labels" aria-hidden="true">{items.map(item=><span key={`${item.text}-${item.y}`} style={{left:`${item.x}%`,top:`${item.y}%`,background:item.bg}}>{item.text}</span>)}</div>);
}
