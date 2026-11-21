'use client';
import LocalizedArtwork from '@/i18n/LocalizedArtwork';
import {useLocalize} from '@/i18n/LocaleProvider';
import {useId} from 'react';
import ProductScreenLabels from './ProductScreenLabels';
import './product-screen-dark.css';
import panels from './product-screen-color-panels.json';

/** Theme the original pixels without changing text, sample data, or navigation targets. */
export default function ProductScreenImage({screen,alt='',active=false,theme='dark',navigationTone=false}:{screen:string;alt?:string;active?:boolean;theme?:'dark'|'light';navigationTone?:boolean}){const localize=useLocalize();
 const id=useId().replace(/[^a-zA-Z0-9]/g,''),body=`screen-body-${id}`,nav=`screen-nav-${id}`;
 if(theme==='light')return <><img className="product-screen-dark-image" data-theme="light" src={`/product-previews/${screen}.webp`} width="2612" height="1794" alt={alt} loading={active?'eager':'lazy'} draggable={false}/><ProductScreenLabels screen={screen}/><LocalizedArtwork screen={screen} theme={theme} navigationTone={navigationTone}/></>;
 return localize(<>
  <svg className="product-screen-filters" width="0" height="0" aria-hidden="true" focusable="false"><defs>
   <filter id={body} colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncR type="linear" slope="-.92" intercept=".97"/><feFuncG type="linear" slope="-.92" intercept=".97"/><feFuncB type="linear" slope="-.92" intercept=".97"/></feComponentTransfer><feColorMatrix type="hueRotate" values="180"/></filter>
   <filter id={nav} colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncR type="gamma" amplitude="1" exponent="2" offset="0"/><feFuncG type="gamma" amplitude="1" exponent="1.5" offset="0"/><feFuncB type="gamma" amplitude="1" exponent="5" offset="0"/></feComponentTransfer></filter>
  </defs></svg>
  <img className="product-screen-dark-image" data-theme="dark" src={`/product-previews/${screen}.webp`} width="2612" height="1794" alt={alt} loading={active?'eager':'lazy'} draggable={false} style={{filter:`url(#${body})`}}/>
  {(panels[screen as keyof typeof panels]??[]).map((panel,i)=><img key={i} className="product-screen-dark-feature" src={`/product-previews/${screen}.webp`} width="2612" height="1794" alt="" aria-hidden="true" loading={active?'eager':'lazy'} draggable={false} style={{filter:`url(#${nav})`,clipPath:`inset(${panel.top}% ${panel.right}% ${panel.bottom}% ${panel.left}% round 1cqw)`}}/>)}
  <div className="product-screen-dark-navigation" aria-hidden="true" style={{filter:`url(#${nav})`}}><img src={`/product-previews/${screen}.webp`} width="2612" height="1794" alt="" loading={active?'eager':'lazy'} draggable={false}/><ProductScreenLabels screen={screen}/></div>
 <LocalizedArtwork screen={screen} theme={theme} navigationTone={navigationTone} bodyFilter={`url(#${body})`} navFilter={`url(#${nav})`}/></>);
}
