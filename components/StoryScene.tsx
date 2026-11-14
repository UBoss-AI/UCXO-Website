'use client';
import WorkflowCanvas from './WorkflowCanvas';
export default function StoryScene({chapter,time,reduced,paused}:{chapter:number;time:number;reduced:boolean;paused:boolean}){return <div className="reference-story-canvas"><WorkflowCanvas chapter={chapter} time={time} reduced={reduced} paused={paused} narrated/></div>;}
