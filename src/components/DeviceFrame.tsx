import './DeviceFrame.css';

type DeviceFrameProps = {
  src: string;
  alt: string;
  label: string;
};

export function DeviceFrame({ src, alt, label }: DeviceFrameProps) {
  return (
    <figure className="device-frame" aria-label={label}>
      <div className="device-shell">
        <div className="device-notch" aria-hidden="true" />
        <div className="device-screen">
          <img src={src} alt={alt} loading="lazy" width={390} height={844} />
        </div>
        <div className="device-bar" aria-hidden="true" />
      </div>
      <figcaption className="device-caption">{label}</figcaption>
    </figure>
  );
}
