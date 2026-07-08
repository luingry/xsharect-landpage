import { AbsoluteFill, Sequence } from 'remotion';
import { SceneBlock } from './SceneBlock';
import { scenes } from './tokens';

export function XSharectDemo() {
  return (
    <AbsoluteFill style={{ background: '#14110f' }}>
      {scenes.map((scene) => (
        <Sequence key={`${scene.image}-${scene.from}`} from={scene.from} durationInFrames={scene.duration}>
          <SceneBlock scene={scene} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
