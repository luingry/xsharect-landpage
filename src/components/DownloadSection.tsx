import { Reveal } from './Reveal';
import { useLatestRelease } from '../hooks/useLatestRelease';
import { RELEASES_PAGE } from '../lib/release';
import { AndroidLogo } from './AndroidLogo';
import { DownloadIcon } from './DownloadIcon';
import './DownloadSection.css';

export function DownloadSection() {
  const { release, loading, error } = useLatestRelease();

  const href = release?.downloadUrl ?? RELEASES_PAGE;

  return (
    <section id="download" className="download section" aria-labelledby="download-title">
      <div className="container">
        <Reveal className="span-12">
          <div className="download-card">
            <div className="download-copy">
              <div className="download-platform">
                <AndroidLogo />
                <span>Disponível para Android</span>
              </div>
              <h2 id="download-title" className="section-title">
                Download externo
              </h2>
              <p className="section-lead download-lead">
                O Xsharect é distribuído como APK assinado nas releases do GitHub.
                Você instala manualmente no dispositivo — habilite
                &quot;Fontes desconhecidas&quot; ou permita a instalação pelo navegador
                quando solicitado.
              </p>
              <ol className="download-steps">
                <li>Baixe o APK pelo botão abaixo</li>
                <li>Abra o arquivo no Android e confirme a instalação</li>
                <li>Conceda acessibilidade e permissão de captura de tela</li>
              </ol>
            </div>

            <div className="download-cta-block">
              {loading ? (
                <div className="download-skeleton" aria-busy="true" aria-label="Carregando release">
                  <div className="skeleton-line skeleton-line-lg" />
                  <div className="skeleton-line" />
                </div>
              ) : (
                <>
                  <a
                    href={href}
                    className="btn-primary download-btn"
                    download={!error && release ? true : undefined}
                    rel="noopener noreferrer"
                    target={error ? '_blank' : undefined}
                  >
                    <DownloadIcon />
                    <span>Download</span>
                  </a>
                  {error && (
                    <p className="download-fallback" role="status">
                      Não foi possível resolver o link direto. Abrindo a página de releases.
                    </p>
                  )}
                  {!error && release?.version && (
                    <p className="download-version" role="status">
                      Release {release.version}
                    </p>
                  )}
                </>
              )}
              <a
                href={RELEASES_PAGE}
                className="btn-ghost download-secondary"
                rel="noopener noreferrer"
                target="_blank"
              >
                Ver todas as releases
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
