import { DownloadIcon } from "./DownloadIcon";
import { HeroShader } from "./HeroShader";
import "./Hero.css";

export function Hero() {
  const base = import.meta.env.BASE_URL;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroShader />
      <div className="container">
        <div className="hero-grid span-12">
          <div className="hero-copy">
            <p className="eyebrow">Espelhamento Android pela rede local</p>
            <h1 id="hero-title" className="hero-title">
              Seu Android.
              <br />
              <span>Na tela certa.</span>
            </h1>
            <p className="hero-lead">
              O Xsharect transmite a tela do seu Android para qualquer navegador
              da mesma LAN — sem conta, sem nuvem e sem desviar o tráfego da sua
              rede.
            </p>
            <div className="hero-actions">
              <a href="#download" className="btn-primary">
                <DownloadIcon />
                Baixar APK
              </a>
              <a href="#produto" className="hero-link">
                Ver o produto <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="hero-proof">Android → Wi-Fi local → navegador</p>
          </div>
          <div className="hero-visual">
            <div className="hero-orbit" aria-hidden="true" />
            <p className="hero-address" aria-hidden="true">
              http://192.168.0.24:9240
            </p>
            <div className="hero-product-stage">
              <div className="hero-monitor">
                <div className="hero-monitor-chrome" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="hero-demo-mask">
                  <video
                    className="hero-demo-video"
                    src={`${base}demo/viewer-tabs.mp4`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label="Visualizador web Xsharect"
                  />
                </div>
                <div className="hero-monitor-stand" aria-hidden="true" />
              </div>
              <div className="hero-phone" aria-hidden="true">
                <span className="hero-phone-speaker" />
                <img
                  src={`${base}screens/app-host.png`}
                  alt=""
                  width={390}
                  height={844}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
