import './Footer.css';
import { GitHubLogo } from './GitHubLogo';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner span-12">
        <div className="footer-brand">
          <img src={`${import.meta.env.BASE_URL}icon-512.png`} alt="" width={28} height={28} />
          <span>Xsharect</span>
        </div>
        <nav className="footer-links" aria-label="Links">
          <a
            className="footer-link-with-icon"
            href="https://github.com/luingry/xsharect"
            rel="noopener noreferrer"
            target="_blank"
          >
            <GitHubLogo />
            Código-fonte
          </a>
          <a
            href="https://github.com/luingry/xsharect/releases/latest"
            rel="noopener noreferrer"
            target="_blank"
          >
            Releases
          </a>
        </nav>
        <p className="footer-copy">
          {year} — tráfego local, sem nuvem.
        </p>
        </div>
      </div>
    </footer>
  );
}
