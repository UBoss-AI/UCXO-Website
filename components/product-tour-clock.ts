export type TourTiming = readonly {start:number;duration:number;steps:readonly {start:number;duration:number}[]}[];
export function tourStepPosition(time:number,steps:TourTiming[number]['steps']){
  let step=0;const at=Math.round(time*1000);
  steps.forEach((item,index)=>{if(at>=Math.round(item.start*1000))step=index;});
  return {step,stepTime:Math.max(0,time-steps[step].start)};
}
export function tourPosition(time:number,timing:TourTiming){
  let chapter=0;const at=Math.round(time*1000);
  timing.forEach((item,index)=>{if(at>=Math.round(item.start*1000))chapter=index;});
  const current=timing[chapter];
  return {chapter,chapterTime:Math.max(0,time-current.start),...tourStepPosition(time,current.steps)};
}
