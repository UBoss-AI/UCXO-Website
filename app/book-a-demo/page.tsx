import type {Metadata} from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DemoForm from '../../components/DemoForm';
import {ArrowUpRight,Check,Mail} from 'lucide-react';
import './demo.css';

export const metadata:Metadata={title:'Book a demo — UCXO',description:'See how UCXO connects your objectives, people, and AI workforce. Tell us about your business and request a personal demo.'};

export default function BookADemo(){return <><Header/><main className="demo-page" id="top">
 <div className="demo-layout">
  <section className="demo-intro" aria-labelledby="demo-heading">
   <div className="eyebrow"><span className="mini-dot"/>LET’S MOVE YOUR BUSINESS FORWARD</div>
   <h1 id="demo-heading">Your ambition.<br/>Our platform.<br/><span>See it in motion.</span></h1>
   <p className="demo-lead">A closer look at how your people and AI workforce can turn objectives into outcomes.</p>
   <div className="demo-journey" aria-hidden="true"><span>YOUR OBJECTIVE</span><i/><span>PEOPLE + AI</span><i/><span>OUTCOME<Check size={12}/></span></div>
   <div className="demo-expect"><h2>A conversation built around your business.</h2>{[
    ['01','Start with your goals','Tell us where work gets stuck and what you want to achieve.'],
    ['02','Explore the possibilities','See connected workflows, AI agents, and human oversight in action.'],
    ['03','Find your next step','Discuss how UCXO could fit into the way your team works.'],
   ].map(([number,title,copy])=><div className="demo-expect-row" key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></div>)}</div>
   <a className="demo-email" href="mailto:info@ubossai.com"><Mail size={15}/><span>Prefer email? <strong>info@ubossai.com</strong></span><ArrowUpRight size={14}/></a>
  </section>
  <section className="demo-form-panel" aria-labelledby="demo-form-title"><div className="demo-form-top"><span className="demo-tag"><span/>PERSONAL DEMO</span><span>LET’S CONNECT</span></div><h2 id="demo-form-title">Let’s talk about your goals.</h2><p>Share a little about your team. We’ll be in touch to arrange your demo.</p><DemoForm/></section>
 </div>
 <p className="demo-bottom-note">Human-led. AI-powered. Accountable by design.</p>
 </main><Footer/></>}
