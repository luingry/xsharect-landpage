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
              Transmita a tela do Android para qualquer navegador da mesma rede
              local, sem conta, sem nuvem e sem enviar o trÃ¡fego para fora dela.
            </p>
            <div className="hero-actions">
              <a href="#download" className="btn-primary">
                <DownloadIcon />
                Baixar APK
              </a>
              <a href="#produto" className="hero-link">
                Ver o produto <span aria-hidden="true">{"\u2193"}</span>
              </a>
            </div>          </div>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
