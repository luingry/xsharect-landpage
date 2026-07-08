import './DesktopFrame.css';

type DesktopFrameProps = {
  src?: string;
  videoSrc?: string;
  alt: string;
  label: string;
};

export function DesktopFrame({ src, videoSrc, alt, label }: DesktopFrameProps) {
  return (
    <figure className="desktop-frame" aria-label={label}>
      <div className="desktop-shell">
        <div className="desktop-chrome" aria-hidden="true">
          <span className="desktop-dot" />
          <span className="desktop-dot" />
          <span className="desktop-dot" />
          <span className="desktop-url">http://192.168.x.x:9240</span>
        </div>
        <div className="desktop-screen">
          {videoSrc ? (
            <video
              className="desktop-screen-media"
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={alt}
            />
          ) : (
            <img
              className="desktop-screen-media"
              src={src}
              alt={alt}
              loading="lazy"
              width={960}
              height={600}
            />
          )}
        </div>
        <div className="desktop-stand" aria-hidden="true">
          <div className="desktop-neck" />
          <div className="desktop-base" />
        </div>
      </div>
      <figcaption className="desktop-caption">{label}</figcaption>
    </figure>
  );
}
