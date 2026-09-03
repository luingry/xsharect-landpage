import { Reveal } from './Reveal';
import { DeviceFrame } from './DeviceFrame';
import { DesktopFrame } from './DesktopFrame';
import './Showcase.css';

const base = import.meta.env.BASE_URL;

const features = [
  {
    title: 'Transmissão H.264',
    body: 'Vídeo em tempo real na mesma rede, com baixa latência e reconexão automática.',
  },
  {
    title: 'Controle por toque',
    body: 'Toque remoto, voltar, início e recentes — direto do navegador.',
  },
  {
    title: 'Senha opcional',
    body: 'Proteja a sessão na LAN ou deixe aberto na rede de confiança.',
  },
  {
    title: 'Galeria e upload',
    body: 'Fotos, vídeos e envio de arquivos pelo visualizador web.',
  },
];

export function Showcase() {
  return (
    <section id="produto" className="showcase section" aria-labelledby="showcase-title">
      <div className="container">
        <Reveal className="showcase-intro span-12">
          <p className="eyebrow">Dois lados, um produto</p>
          <h2 id="showcase-title" className="section-title">
            App host e visualizador web
          </h2>
          <p className="section-lead">
            O Android captura e transmite. Qualquer navegador na LAN assiste e controla.
            Mesma identidade visual, mesma sessão.
          </p>
        </Reveal>

        <div className="showcase-frames span-12">
          <Reveal delay={0.1}>
            <DeviceFrame
              src={`${base}screens/app-host.png`}
              alt="Interface do app Xsharect no Android"
              label="App Android — host"
            />
          </Reveal>
          <Reveal delay={0.2}>
            <DesktopFrame
              videoSrc={`${base}demo/viewer-tabs.mp4`}
              alt="Visualizador web navegando entre abas Live, Fotos, Vídeos e Upload"
              label="Visualizador web — viewer"
            />
          </Reveal>
        </div>

        <div className="showcase-grid span-12">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={0.05 * i} className="showcase-card col-span-3">
              <h3 className="showcase-card-title">{f.title}</h3>
              <p className="showcase-card-body">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
