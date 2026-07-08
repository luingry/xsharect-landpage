import { Composition } from 'remotion';
import { XSharectDemo } from './XSharectDemo';
import { ViewerTabsDemo } from './ViewerTabsDemo';
import { TOTAL_FRAMES } from './tokens';
import { VIEWER_TABS_TOTAL_FRAMES } from './viewer-tabs';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="XSharectDemo"
        component={XSharectDemo}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ViewerTabs"
        component={ViewerTabsDemo}
        durationInFrames={VIEWER_TABS_TOTAL_FRAMES}
        fps={30}
        width={960}
        height={600}
      />
    </>
  );
};
