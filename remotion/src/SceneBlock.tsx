import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { SceneConfig } from './tokens';
import { tokens } from './tokens';

const PHONE_MOCK_W = 260;
const DESKTOP_MOCK_W = 840;

type SceneBlockProps = {
  scene: SceneConfig;
};

export function SceneBlock({ scene }: SceneBlockProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { duration, variant = 'desktop' } = scene;
  const isPhone = variant === 'phone';

  const enter = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 110, mass: 0.75 },
  });

  const fadeIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const fadeOut = interpolate(frame, [duration - 14, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const opacity = Math.min(fadeIn, fadeOut);

  const scale = interpolate(enter, [0, 1], [0.9, 1]);
  const blur = interpolate(enter, [0, 1], [10, 0]);
  const slideY = interpolate(enter, [0, 1], [24, 0]);

  return (
    <AbsoluteFill
      style={{
        background: tokens.bg,
        opacity,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 55% 50% at 50% 48%, rgba(193,95,60,0.12), transparent 70%)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            transform: `translateY(${slideY}px) scale(${scale})`,
            filter: `blur(${blur}px)`,
          }}
        >
          {isPhone ? (
            <div
              style={{
                width: PHONE_MOCK_W,
                padding: '10px 8px 12px',
                borderRadius: 32,
                background: `linear-gradient(155deg, ${tokens.surface2}, ${tokens.surface})`,
                boxShadow: '0 24px 48px -16px rgba(0,0,0,0.55)',
              }}
            >
              <div
                style={{
                  width: 68,
                  height: 6,
                  margin: '2px auto 8px',
                  borderRadius: 999,
                  background: tokens.bg,
                }}
              />
              <div
                style={{
                  borderRadius: 22,
                  overflow: 'hidden',
                  background: tokens.bg,
                  aspectRatio: '9 / 19.5',
                }}
              >
                <Img
                  src={staticFile(scene.image)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>
          ) : (
            <div
              style={{
                width: DESKTOP_MOCK_W,
                maxHeight: 620,
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 24px 52px -18px rgba(0,0,0,0.65)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  background: tokens.surface2,
                }}
              >
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: tokens.primary, opacity: 0.75 }} />
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: tokens.outline }} />
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: tokens.outline }} />
              </div>
              <div
                style={{
                  background: tokens.bg,
                  aspectRatio: '16 / 10',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}
              >
                <Img
                  src={staticFile(scene.image)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'top' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
}
