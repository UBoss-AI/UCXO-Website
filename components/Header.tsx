'use client';
import LanguageSelector from '@/i18n/LocaleProvider';
import {useLocalize} from '@/i18n/LocaleProvider';
import {useState} from 'react';import {ArrowUpRight,Menu,X} from 'lucide-react';
import './header.css';
export function Brand(){const localize=useLocalize();return localize(<a className="brand" href="/#top" aria-label="UCXO home"><span className="brand-mark"><i/><i/><i/></span><span>UCXO</span></a>)}
export default function Header(){const localize=useLocalize();const[open,setOpen]=useState(false);return localize(<header className="header"><Brand/><nav className={open?'nav open':'nav'} aria-label="Main navigation">{[['Platform','/#platform'],['How it works','/how-it-works/'],['Use cases','/#use-cases'],['Oversight','/#oversight']].map(([label,href])=><a href={href} key={href} onClick={()=>setOpen(false)}>{label}</a>)}</nav><div className="header-actions"><LanguageSelector/><a className="book-demo-button" aria-label="Book a Demo" href="/book-a-demo/"><span>Book a Demo</span><ArrowUpRight size={15}/></a><a className="sign-in-button" aria-label="Sign in" href="https://app.ubossai.com/login"><span>Sign in</span><ArrowUpRight size={15}/></a><button className="mobile-menu" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div></header>)}
