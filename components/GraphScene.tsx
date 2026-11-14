'use client';
import WorkflowCanvas from './WorkflowCanvas';
export default function GraphScene({index,active,reduced,paused=false}:{index:number;active:boolean;reduced:boolean;paused?:boolean}){return <div className="reference-home-canvas"><WorkflowCanvas chapter={index} active={active} reduced={reduced} paused={paused}/></div>;}
