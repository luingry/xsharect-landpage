import { useEffect, useRef } from 'react';
import './DeviceFrame.css';

type DeviceFrameProps = {
  videoSrc: string;
  alt: string;
  label: string;
};

export function DeviceFrame({ videoSrc, alt, label }: DeviceFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startTimer = window.setTimeout(() => {
      void videoRef.current?.play();
    }, 2_000);

    return () => {
      window.clearTimeout(startTimer);
    };
  }, [videoSrc]);

  const replayImmediately = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play();
  };

  return (
    <figure className="device-frame" aria-label={label}>
      <div className="device-shell">
        <div className="device-notch" aria-hidden="true" />
        <div className="device-screen">
          <video
            ref={videoRef}
            src={videoSrc}
            aria-label={alt}
            muted
            onEnded={replayImmediately}
            playsInline
            preload="metadata"
          />
        </div>
        <div className="device-bar" aria-hidden="true" />
      </div>
      <figcaption className="device-caption">{label}</figcaption>
    </figure>
  );
}
