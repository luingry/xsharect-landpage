import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { TAB_DURATION_FRAMES, VIEWER_TAB_FRAMES } from './viewer-tabs';
import { tokens } from './tokens';

const FADE_FRAMES = 10;

function TabSlide({ image, duration }: { image: string; duration: number }) {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, FADE_FRAMES, duration - FADE_FRAMES, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) },
  );

  return (
    <AbsoluteFill style={{ background: tokens.bg, opacity }}>
      <Img
        src={staticFile(image)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'top center',
        }}
      />
    </AbsoluteFill>
  );
}

export function ViewerTabsDemo() {
  return (
    <AbsoluteFill style={{ background: tokens.bg }}>
      {VIEWER_TAB_FRAMES.map((image, index) => (
        <Sequence
          key={image}
          from={index * TAB_DURATION_FRAMES}
          durationInFrames={TAB_DURATION_FRAMES}
        >
          <TabSlide image={image} duration={TAB_DURATION_FRAMES} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
