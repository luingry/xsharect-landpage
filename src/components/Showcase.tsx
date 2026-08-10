import { useEffect, useRef } from "react";
import { DesktopFrame } from "./DesktopFrame";
import { DeviceFrame } from "./DeviceFrame";
import { Reveal } from "./Reveal";
import "./Showcase.css";

const base = import.meta.env.BASE_URL;

const readouts = [
  [
    "01",
    "Fluxo contínuo",
    "Vídeo H.264 na LAN, pensado para baixa latência e reconexão automática.",
  ],
  [
    "02",
    "Ação remota",
    "Toque e a navegação do Android entram pelo visualizador com a permissão de controle ativada.",
  ],
  [
    "03",
    "Acesso dosado",
    "Senha opcional para a sessão local quando a sua rede pedir uma camada a mais.",
  ],
  [
    "04",
    "Mídias no mesmo lugar",
    "Acesse fotos e vídeos, ou envie arquivos pelo próprio visualizador.",
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
          <p className="eyebrow">Uma sessão, uma rota local</p>
          <h2 id="showcase-title" className="section-title">
            O Android abre a porta. O navegador entra na sessão.
          </h2>
          <p className="section-lead">
            Inicie no telefone, use o endereço exibido e acompanhe em outro
            dispositivo da mesma rede. Sem conta como etapa intermediária.
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
              hospeda
            </h3>
            <p>O app exibe o endereço da sessão e inicia a transmissão.</p>
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
              LAN
              <br />
              mantém perto
            </h3>
            <p>O endereço é aberto por outro dispositivo na mesma rede.</p>
            <code>http://IP:9240</code>
          </aside>
          <article className="route-station route-station-browser">
            <p className="station-index">[ C ]</p>
            <h3>
              Navegador
              <br />
              assume a visão
            </h3>
            <p>Live, fotos, vídeos e upload ficam na mesma sessão web.</p>
            <DesktopFrame
              videoSrc={`${base}demo/viewer-tabs.mp4`}
              alt="Visualizador web com abas de transmissão, fotos, vídeos e upload"
              label="visualizador web"
            />
          </article>
        </div>

        <div className="readout-heading span-12" aria-hidden="true">
          <span>Capacidades na mesma sessão</span>
          <i />
        </div>
        <dl className="route-readouts span-12">
          <svg
            className="readout-trace"
            viewBox="0 0 1200 180"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path className="readout-trace-line" d="M28 44 H1172" />
            <path
              className="readout-trace-pulse"
              d="M28 44 H1172"
              pathLength="1"
            />
            <circle cx="28" cy="44" r="4" />
            <circle cx="410" cy="44" r="4" />
            <circle cx="790" cy="44" r="4" />
            <circle cx="1172" cy="44" r="4" />
          </svg>
          {readouts.map(([number, title, body]) => (
            <Reveal
              key={number}
              className={`route-readout route-readout-${number}`}
            >
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
