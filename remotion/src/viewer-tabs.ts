export const VIEWER_TAB_FRAMES = [
  'frames/viewer-stream.png',
  'frames/viewer-photos.png',
  'frames/viewer-videos.png',
  'frames/viewer-upload.png',
] as const;

/** 2.5s @ 30fps */
export const TAB_DURATION_FRAMES = 75;

export const VIEWER_TABS_TOTAL_FRAMES = VIEWER_TAB_FRAMES.length * TAB_DURATION_FRAMES;
