import { motion, useReducedMotion } from 'framer-motion';
import { DownloadIcon } from './DownloadIcon';
import { Reveal } from './Reveal';import './Hero.css';

export function Hero() {
  const reduce = useReducedMotion();
  const base = import.meta.env.BASE_URL;
  const demoSrc = `${base}demo/xsharect-demo.mp4`;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-grid span-12">
          <motion.div
            className="hero-visual"
            initial={reduce ? false : { opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 22, delay: 0.15 }}
          >
            <div className="hero-glow" aria-hidden="true" />
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
          </motion.div>

          <Reveal className="hero-copy">
            <h1 id="hero-title" className="hero-title">
              Sua tela Android,
              <span className="hero-title-accent"> ao vivo na LAN</span>
            </h1>
            <p className="hero-lead">
              Transmita a tela do celular na rede local e controle o dispositivo pelo
              navegador — vídeo em tempo real, toque remoto e navegação, tudo no seu Wi-Fi.
            </p>
            <div className="hero-actions">
              <a href="#download" className="btn-primary">
                <DownloadIcon />
                Download
              </a>              <a href="#produto" className="btn-ghost">
                Saiba mais
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
