import { DownloadIcon } from "./DownloadIcon";
import "./Hero.css";

export function Hero() {
  const demoSrc = `${import.meta.env.BASE_URL}demo/xsharect-demo.mp4`;

  return (
    <section className="hero" aria-labelledby="hero-title">
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
            <div className="hero-demo-wrap">
              <div className="hero-demo-mask">
                <video
                  className="hero-demo-video"
                  src={demoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Demonstração do app Xsharect e do visualizador web"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
