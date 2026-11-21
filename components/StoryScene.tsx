'use client';
import {useLocalize} from '@/i18n/LocaleProvider';
import WorkflowCanvas from './WorkflowCanvas';
export default function StoryScene({chapter,time,reduced,paused}:{chapter:number;time:number;reduced:boolean;paused:boolean}){const localize=useLocalize();return localize(<div className="reference-story-canvas"><WorkflowCanvas chapter={chapter} time={time} reduced={reduced} paused={paused} narrated/></div>);}
