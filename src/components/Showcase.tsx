import { useEffect, useRef } from "react";
import { DesktopFrame } from "./DesktopFrame";
import { DeviceFrame } from "./DeviceFrame";
import { Reveal } from "./Reveal";
import "./Showcase.css";

const base = import.meta.env.BASE_URL;

const readouts = [
  [
    "01",
    "Transmissão contínua",
    "Transmissão H.264 pela rede local, com baixa latência e reconexão automática.",
  ],
  [
    "02",
    "Controle remoto",
    "Controle o Android por toques e pelos botões de navegação quando a permissão estiver ativa.",
  ],
  [
    "03",
    "Acesso protegido",
    "Use uma senha opcional para proteger a sessão local quando necessário.",
  ],
  [
    "04",
    "Mídias e arquivos",
    "Veja fotos e vídeos ou envie arquivos pelo próprio visualizador.",
  ],
];

export function Showcase() {
  const routeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const route = routeRef.current;
    if (!route || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let inView = false;
    const update = () =>
      route.classList.toggle("route-is-active", inView && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        update();
      },
      { threshold: 0.16 },
    );
    observer.observe(route);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <section
      id="produto"
      className="showcase section"
      aria-labelledby="showcase-title"
      ref={routeRef}
    >
      <div className="container">
        <Reveal className="showcase-intro span-12">
          <p className="eyebrow">Uma sessão na rede local</p>
          <h2 id="showcase-title" className="section-title">
            O Android inicia. O navegador acompanha.
          </h2>
          <p className="section-lead">
            Inicie no telefone, abra o endereço mostrado e acompanhe em outro
            dispositivo da mesma rede, sem criar uma conta.
          </p>
        </Reveal>

        <div className="signal-route span-12">
          <svg
            className="route-wire"
            viewBox="0 0 1000 400"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="route-line"
              d="M112 150 C260 150 298 84 440 84 S650 286 884 286"
            />
            <path
              className="route-pulse"
              d="M112 150 C260 150 298 84 440 84 S650 286 884 286"
              pathLength="1"
            />
          </svg>
          <article className="route-station route-station-android">
            <p className="station-index">[ A ]</p>
            <h3>
              Android
              <br />
              inicia a sessão
            </h3>
            <p>O aplicativo mostra o endereço e inicia a transmissão.</p>
            <DeviceFrame
              src={`${base}screens/app-host.png`}
              alt="Tela inicial do Xsharect com o endereço de acesso local"
              label="host Android"
            />
          </article>
          <aside
            className="route-station route-station-lan"
            aria-label="Etapa LAN"
          >
            <span className="lan-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <p className="station-index">[ B ]</p>
            <h3>
              Rede local
              <br />
              conecta os dispositivos
            </h3>
            <p>
              Digite o endereço em outro dispositivo conectado à mesma rede.
            </p>
            <code>http://IP:9240</code>
          </aside>
          <article className="route-station route-station-browser">
            <p className="station-index">[ C ]</p>
            <h3>
              Navegador
              <br />
              exibe a transmissão
            </h3>
            <p>
              Transmissão ao vivo, fotos, vídeos e envio de arquivos na mesma
              sessão.
            </p>
            <DesktopFrame
              videoSrc={`${base}demo/viewer-tabs.mp4`}
              alt="Visualizador web com abas de transmissão, fotos, vídeos e upload"
              label="visualizador web"
            />
          </article>
        </div>

        <div className="readout-heading span-12" aria-hidden="true">
          <span>Capacidades na mesma sessão</span>
        </div>
        <dl className="route-readouts span-12">
          {readouts.map(([number, title, body]) => (
            <Reveal
              key={number}
              className={`route-readout route-readout-${number}`}
            >
              <span className="route-readout-mark" aria-hidden="true">
                {number}
              </span>
              <dt>
                <span className="tap-number">{number}</span>
                <strong>{title}</strong>
              </dt>
              <dd>{body}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
