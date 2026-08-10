import { DeviceFrame } from "./DeviceFrame";
import { DesktopFrame } from "./DesktopFrame";
import "./Showcase.css";

const base = import.meta.env.BASE_URL;
const features = [
  [
    "Vídeo H.264 na LAN",
    "Transmissão em tempo real, baixa latência e reconexão automática.",
  ],
  [
    "Toque remoto",
    "Toque, voltar, início e recentes diretamente no navegador.",
  ],
  [
    "Senha opcional",
    "Proteja a sessão quando a rede pedir; mantenha simples quando não precisar.",
  ],
  [
    "Galeria e upload",
    "Veja mídias e envie arquivos sem trocar de ferramenta.",
  ],
];

export function Showcase() {
  return (
    <section
      id="produto"
      className="showcase section"
      aria-labelledby="showcase-title"
    >
      <div className="container">
        <div className="showcase-intro span-12">
          <p className="eyebrow">Um endereço. Dois dispositivos.</p>
          <h2 id="showcase-title" className="section-title">
            O Android abre a porta. O navegador assume a visão.
          </h2>
          <p className="section-lead">
            O app hospeda a transmissão na rede local. Qualquer dispositivo com
            navegador entra pelo endereço mostrado na tela — sem criar conta no
            meio do caminho.
          </p>
        </div>
        <div className="connection-line span-12" aria-hidden="true">
          <span>Android</span>
          <i />
          <span>LAN</span>
          <i />
          <span>Navegador</span>
        </div>
        <div className="showcase-frames span-12">
          <DeviceFrame
            src={`${base}screens/app-host.png`}
            alt="Interface do app Xsharect no Android"
            label="01 — host Android"
          />
          <DesktopFrame
            videoSrc={`${base}demo/viewer-tabs.mp4`}
            alt="Visualizador web entre Live, Fotos, Vídeos e Upload"
            label="02 — visualizador web"
          />
        </div>
        <dl className="feature-list span-12">
          {features.map(([title, body], index) => (
            <div className="feature-row" key={title}>
              <dt>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {title}
              </dt>
              <dd>{body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
