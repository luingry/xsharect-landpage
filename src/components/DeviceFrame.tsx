import './DeviceFrame.css';

type DeviceFrameProps = {
  videoSrc: string;
  alt: string;
  label: string;
};

export function DeviceFrame({ videoSrc, alt, label }: DeviceFrameProps) {
  return (
    <figure className="device-frame" aria-label={label}>
      <div className="device-shell">
        <div className="device-notch" aria-hidden="true" />
        <div className="device-screen">
          <video
            src={videoSrc}
            aria-label={alt}
            autoPlay
            loop
            muted
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
