export const tokens = {
  bg: '#14110f',
  surface: '#1c1815',
  surface2: '#241f1b',
  primary: '#c15f3c',
  outline: '#352e28',
} as const;

export type SceneConfig = {
  from: number;
  duration: number;
  image: string;
  variant?: 'phone' | 'desktop';
};

/** ~13s @ 30fps — só mocks, sem texto */
export const scenes: SceneConfig[] = [
  {
    from: 0,
    duration: 90,
    image: 'frames/app-start.png',
    variant: 'phone',
  },
  {
    from: 90,
    duration: 75,
    image: 'frames/viewer-stream.png',
    variant: 'desktop',
  },
  {
    from: 165,
    duration: 75,
    image: 'frames/viewer-photos.png',
    variant: 'desktop',
  },
  {
    from: 240,
    duration: 75,
    image: 'frames/viewer-videos.png',
    variant: 'desktop',
  },
  {
    from: 315,
    duration: 75,
    image: 'frames/viewer-upload.png',
    variant: 'desktop',
  },
];

export const TOTAL_FRAMES = 390;
