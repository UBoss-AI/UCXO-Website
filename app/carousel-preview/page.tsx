import type {Metadata} from 'next';
import {ArrowLeft,ArrowDown,ArrowUpRight,Check} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductPreviewCard from '../../components/ProductPreviewCard';
import {productPreviews} from '../../components/product-preview-data';
import './preview.css';

export const metadata:Metadata={title:'Five homepage previews — UCXO',robots:{index:false,follow:false}};
export default function CarouselPreview(){return <><Header/><main className="product-preview-page" id="top">
  <section className="product-preview-intro"><a className="product-preview-back" href="/"><ArrowLeft size={14}/>Back to the website</a><div className="product-preview-review-label"><i/>HOMEPAGE CAROUSEL · LOCAL DESIGN REVIEW</div><h1>One workspace.<br/><span>Five ways to move forward.</span></h1><p>Five proposed homepage cards. Real software screens, clear explanations, and a closer look at each part of UCXO.</p><div className="product-preview-review-notes"><span><Check size={13}/>Original screens from your design PDF</span><span><Check size={13}/>Static previews for review</span></div><a href="#udashview" className="product-preview-jump">Explore the five previews<ArrowDown size={15}/></a></section>
  <nav className="product-preview-nav" aria-label="Five homepage previews">{productPreviews.map((p,i)=><a href={`#${p.id}`} key={p.id}><span>0{i+1}</span>{p.label}</a>)}</nav>
  <div className="product-preview-cards">{productPreviews.map((p,i)=><ProductPreviewCard preview={p} index={i} key={p.id}/>)}</div>
  <section className="product-preview-review-footer"><span>FIVE STATIC PREVIEWS · READY FOR YOUR REVIEW</span><h2>The software leads.<br/><em>The story makes it clear.</em></h2><p>Choose any screen selector to inspect the related module. Open a screen at full size to compare it with the PDF. These previews retain the original sample data and empty or draft states.</p><a href="#top">Back to the five-preview overview<ArrowUpRight size={14}/></a></section>
 </main><Footer/></>}
