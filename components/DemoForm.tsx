'use client';
import {useEffect} from 'react';
import {useTranslation} from '@/i18n/LocaleProvider';
import {useLocalize} from '@/i18n/LocaleProvider';
import type {FormEvent} from 'react';
import {ArrowRight} from 'lucide-react';
import {buildDemoEmail} from './demo-email';

export default function DemoForm(){const localize=useLocalize();const {t}=useTranslation();useEffect(()=>{try{const saved=JSON.parse(sessionStorage.getItem('ucxo-demo-draft')??'null');if(saved){const form=document.querySelector<HTMLFormElement>('.demo-form');for(const[key,value]of Object.entries(saved)){const input=form?.elements.namedItem(key);if(input instanceof HTMLInputElement||input instanceof HTMLTextAreaElement||input instanceof HTMLSelectElement)input.value=String(value);}sessionStorage.removeItem('ucxo-demo-draft');}}catch{}},[]);
 function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  const data=new FormData(event.currentTarget);if(data.get('_honey'))return;
  const details=Object.fromEntries(Array.from(data.entries()).map(([key,value])=>[key,String(value).trim()]));
  const email=buildDemoEmail(details,t);
  window.location.href=email.href;
 }
 return localize(<form onInvalid={event=>{const field=event.target as HTMLInputElement;field.setCustomValidity(t(field.validity.valueMissing?'Please complete this field.':field.validity.typeMismatch?'Please enter a valid email address.':'Please check this value.'));}} onInput={event=>(event.target as HTMLInputElement).setCustomValidity('')} onSubmit={submit} className="demo-form" aria-label="Request a UCXO demo">
  <p className="demo-required">Fields marked <span>*</span> are required.</p>
  <fieldset><legend className="sr-only">Your contact and company details</legend>
   <div className="demo-fields"><label>First name <span>*</span><input name="first_name" autoComplete="given-name" placeholder="Alex" required maxLength={80}/></label><label>Last name <span>*</span><input name="last_name" autoComplete="family-name" placeholder="Morgan" required maxLength={80}/></label></div>
   <label>Work email <span>*</span><input type="email" name="email" autoComplete="email" placeholder="alex@company.com" required maxLength={254}/></label>
   <div className="demo-fields"><label>Company <span>*</span><input name="company" autoComplete="organization" placeholder="Company name" required maxLength={160}/></label><label>Job title <span>*</span><input name="job_title" autoComplete="organization-title" placeholder="Your role" required maxLength={120}/></label></div>
   <div className="demo-fields"><label>Company size <span>*</span><select name="company_size" required defaultValue=""><option value="" disabled>Select team size</option>{['1–50','51–200','201–500','501–1,000','1,001–5,000','5,001–10,000','10,000+'].map(size=><option key={size}>{size}</option>)}</select></label><label>Country <span>*</span><input name="country" autoComplete="country-name" placeholder="Your country" required maxLength={100}/></label></div>
   <label>What would you like to achieve? <small>Optional</small><textarea name="goals" rows={3} maxLength={3000} placeholder="A workflow to improve, a goal to reach, or a challenge to solve…"/></label>
   <label className="demo-honey" aria-hidden="true">Leave this empty<input name="_honey" tabIndex={-1} autoComplete="off"/></label>
   <p className="demo-data-note">We’ll use your details to respond to your demo request. Please avoid including confidential information.</p>
   <button type="submit" className="demo-submit">Request my demo<ArrowRight size={18}/></button>   <p className="demo-form-footnote">Opens your email app with your details prefilled.</p>
  </fieldset>
 </form>);
}
