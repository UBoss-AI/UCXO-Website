import localizedTiming from './localized-tour-timing.json';
import {
  productTourAnnouncements, productTourDuration, productTourIntroTiming, productTourTiming,
} from './product-tour-timing';
import type {TourTiming} from './product-tour-clock';

type Clip = {start: number; duration: number};
type TourTrack = {
  intro: Clip;
  announcements: readonly (Clip & {label: string})[];
  timeline: TourTiming;
  duration: number;
};

export function productTourTrack(locale: string): TourTrack & {src: string} {
  if (locale === 'en') {
    return {
      src: '/narration/product-tour.wav',
      intro: productTourIntroTiming,
      announcements: productTourAnnouncements,
      timeline: productTourTiming,
      duration: productTourDuration,
    };
  }
  const track = (localizedTiming as Record<string, TourTrack>)[locale];
  if (!track) throw new Error('Missing homepage tour narration for ' + locale);
  return {...track, src: '/narration/localized/tour/' + locale + '.mp3'};
}
