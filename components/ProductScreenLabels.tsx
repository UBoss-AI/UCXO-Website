import labels from './product-screen-labels.json';
import './product-screen-labels.css';

export default function ProductScreenLabels({screen}:{screen:string}){
 const items=labels[screen as keyof typeof labels]??[];
 return <div className="product-screen-labels" aria-hidden="true">{items.map(item=><span key={`${item.text}-${item.y}`} style={{left:`${item.x}%`,top:`${item.y}%`,background:item.bg}}>{item.text}</span>)}</div>;
}
