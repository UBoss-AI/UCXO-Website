import type {Metadata} from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoryPlayer from '@/components/StoryPlayer';
import {narrationDuration} from '@/components/narration-timeline';
import {ArrowUpRight} from 'lucide-react';
export const metadata:Metadata={title:'How it works — UCXO',description:'Follow one business objective from a proposed workflow to human approval and a reviewed outcome.'};
export default function HowItWorks(){return <><Header/><main><StoryPlayer/><section className="story-explanation section-wrap"><div className="section-top"><span className="eyebrow">FROM DIRECTION TO DELIVERY</span><span className="section-index">THE COMPLETE STORY · {Math.ceil(narrationDuration)} SECONDS</span></div><div className="section-heading"><h2>One objective.<br/><span>Every step connected.</span></h2><p>Follow an illustrative production readiness plan.<br/>People retain the decisions that need human judgment.</p></div></section><section className="closing section-wrap"><span className="eyebrow">UCXO</span><h2>Business execution,<br/>coordinated.</h2><p>Bring your objectives, people, and AI workforce into one shared workflow.</p><a className="button primary" href="/#platform">Explore the platform<ArrowUpRight size={17}/></a><a className="closing-secondary" href="https://app.ubossai.com/login">Sign in to UCXO<ArrowUpRight size={14}/></a></section></main><Footer/></>}
