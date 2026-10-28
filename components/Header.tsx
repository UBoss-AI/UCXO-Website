'use client';
import {useState} from 'react';import {ArrowUpRight,Menu,X} from 'lucide-react';
export function Brand(){return <a className="brand" href="#top" aria-label="Chief Engine home"><span className="brand-mark"><i/><i/><i/></span><span>chief<span className="brand-light">engine</span></span></a>}
export default function Header(){const[open,setOpen]=useState(false);return <header className="header"><Brand/><nav className={open?'nav open':'nav'} aria-label="Main navigation">{[['Platform','#platform'],['How it works','#how-it-works'],['Use cases','#use-cases'],['Oversight','#oversight']].map(([label,href])=><a href={href} key={href} onClick={()=>setOpen(false)}>{label}</a>)}</nav><a className="nav-cta" href="#explore">Explore the platform<ArrowUpRight size={15}/></a><button className="mobile-menu" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></header>}

