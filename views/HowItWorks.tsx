'use client';
import LocalizedLineBreak from '@/i18n/LocalizedLineBreak';
import {useLocalize,useTranslation} from '@/i18n/LocaleProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {chapters} from '@/components/story-data';
import StoryPlayer from '@/components/StoryPlayer';
import {explainerTrack} from '@/components/explainer-track';
import {ArrowUpRight} from 'lucide-react';
export default function HowItWorks(){const localize=useLocalize();const {locale}=useTranslation();const {duration:narrationDuration}=explainerTrack(locale);return localize(<><Header/><main><StoryPlayer/><section className="story-explanation section-wrap"><div className="section-top"><span className="eyebrow">FROM DIRECTION TO DELIVERY</span><span className="section-index">{`THE COMPLETE STORY · ${Math.ceil(narrationDuration)} SECONDS`}</span></div><div className="section-heading"><h2>One objective.<br/><span>Every step connected.</span></h2><p>Follow an illustrative production readiness plan.<br/>People retain the decisions that need human judgment.</p></div><details className="tour-translated-transcript"><summary>Transcript</summary>{chapters.map(c=><section key={c.label}><h3>{c.label}</h3>{c.captions.map((cue,i)=><p key={i}>{cue.text}</p>)}</section>)}</details></section><section className="closing section-wrap"><span className="eyebrow">UCXO</span><h2><LocalizedLineBreak message="Business execution, coordinated." englishPrefix="Business execution,"/></h2><p>Bring your objectives, people, and AI workforce into one shared workflow.</p><a className="button primary" href="/#platform">Explore the platform<ArrowUpRight size={17}/></a><a className="closing-secondary" href="https://app.ubossai.com/login">Sign in to UCXO<ArrowUpRight size={14}/></a></section></main><Footer/></>)}
