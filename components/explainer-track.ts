import localizedTiming from './localized-explainer-timing.json';
import {narrationDuration, narrationTimeline} from './narration-timeline';
import {narrationTiming} from './narration-timing';

type Timing = {
  start: number;
  duration: number;
  points: {at: number; storyAt: number}[];
};

export function explainerTrack(locale: string) {
  const localized = (localizedTiming as Record<string, Timing[]>)[locale];
  if (localized) {
    const last = localized[localized.length - 1];
    return {
      src: '/narration/localized/' + locale + '.mp3',
      timeline: localized,
      timing: localized,
      duration: last.start + last.duration,
    };
  }

  if (locale !== 'en') throw new Error('Missing explainer narration for ' + locale);
  return {
    src: '/narration/ucxo-explainer.wav',
    timeline: narrationTimeline,
    timing: narrationTiming,
    duration: narrationDuration,
  };
}
