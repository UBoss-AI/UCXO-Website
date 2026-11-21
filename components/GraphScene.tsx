'use client';
import {useLocalize} from '@/i18n/LocaleProvider';
import WorkflowCanvas from './WorkflowCanvas';
export default function GraphScene({index,active,reduced,paused=false}:{index:number;active:boolean;reduced:boolean;paused?:boolean}){const localize=useLocalize();return localize(<div className="reference-home-canvas"><WorkflowCanvas chapter={index} active={active} reduced={reduced} paused={paused}/></div>);}
