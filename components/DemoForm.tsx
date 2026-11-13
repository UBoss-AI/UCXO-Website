'use client';
import {useRef,useState,type FormEvent} from 'react';
import {ArrowRight,ArrowUpRight,Check,LoaderCircle,Mail,RotateCcw} from 'lucide-react';

export default function DemoForm(){
 const [state,setState]=useState<'idle'|'sending'|'success'|'error'>('idle');
 const [message,setMessage]=useState('');
 const form=useRef<HTMLFormElement>(null),success=useRef<HTMLDivElement>(null);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(state==='sending')return;
  const data=new FormData(event.currentTarget);if(data.get('_honey'))return;
  setState('sending');setMessage('');
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
  try{
   const payload=Object.fromEntries(data.entries());
   const response=await fetch('https://formsubmit.co/ajax/info@ubossai.com',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({...payload,_subject:'New UCXO demo request',_template:'table',_replyto:payload.email,source:window.location.origin+'/book-a-demo/'}),signal:controller.signal});
   const result=await response.json();
   if(/activat|confirm.*email/i.test(String(result.message??'')))throw new Error('activation');
   if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('submission');
   setState('success');requestAnimationFrame(()=>success.current?.focus());
  }catch(error){setState('error');setMessage(error instanceof Error&&error.message==='activation'?'Our enquiry form is being connected. Please email info@ubossai.com to arrange your demo.':'Your request could not be sent. Please try again, or email info@ubossai.com. Your details are still here.');}
  finally{clearTimeout(timeout);}
 }
 if(state==='success')return <div className="demo-success" ref={success} tabIndex={-1} role="status"><span className="demo-success-icon"><Check size={29}/></span><span className="eyebrow">REQUEST RECEIVED</span><h3>You’re one step closer.</h3><p>Thanks for your interest in UCXO. Our team will reach out by email to arrange your demo.</p><div className="demo-success-next"><Mail size={18}/><span><strong>Keep an eye on your inbox.</strong><br/>We’ll take the next step together.</span></div><a href="/#platform">Explore the platform<ArrowUpRight size={15}/></a><button type="button" onClick={()=>setState('idle')}><RotateCcw size={13}/>Send another request</button></div>;
 return <form ref={form} onSubmit={submit} className="demo-form" aria-label="Request a UCXO demo" aria-busy={state==='sending'}>
  <p className="demo-required">Fields marked <span>*</span> are required.</p>
  <fieldset disabled={state==='sending'}><legend className="sr-only">Your contact and company details</legend>
   <div className="demo-fields"><label>First name <span>*</span><input name="first_name" autoComplete="given-name" placeholder="Alex" required maxLength={80}/></label><label>Last name <span>*</span><input name="last_name" autoComplete="family-name" placeholder="Morgan" required maxLength={80}/></label></div>
   <label>Work email <span>*</span><input type="email" name="email" autoComplete="email" placeholder="alex@company.com" required maxLength={254}/></label>
   <div className="demo-fields"><label>Company <span>*</span><input name="company" autoComplete="organization" placeholder="Company name" required maxLength={160}/></label><label>Job title <span>*</span><input name="job_title" autoComplete="organization-title" placeholder="Your role" required maxLength={120}/></label></div>
   <div className="demo-fields"><label>Company size <span>*</span><select name="company_size" required defaultValue=""><option value="" disabled>Select team size</option>{['1–50','51–200','201–500','501–1,000','1,001–5,000','5,001–10,000','10,000+'].map(size=><option key={size}>{size}</option>)}</select></label><label>Country <span>*</span><input name="country" autoComplete="country-name" placeholder="Your country" required maxLength={100}/></label></div>
   <label>What would you like to achieve? <small>Optional</small><textarea name="goals" rows={3} maxLength={3000} placeholder="A workflow to improve, a goal to reach, or a challenge to solve…"/></label>
   <label className="demo-honey" aria-hidden="true">Leave this empty<input name="_honey" tabIndex={-1} autoComplete="off"/></label>
   <p className="demo-data-note">We’ll use your details to respond to your demo request. Please avoid including confidential information.</p>
   {state==='error'&&<p className="demo-error" role="alert">{message} <a href="mailto:info@ubossai.com">Email our team<ArrowUpRight size={12}/></a></p>}
   <button type="submit" className="demo-submit">{state==='sending'?<>Sending your request<LoaderCircle className="demo-spinner" size={18}/></>:<>Request my demo<ArrowRight size={18}/></>}</button>
   <p className="demo-form-footnote">A personal conversation. A clearer way forward.</p>
  </fieldset>
 </form>;
}
