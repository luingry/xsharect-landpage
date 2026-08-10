import { DownloadIcon } from "./DownloadIcon";
import "./Nav.css";

export function Nav() {
  return (
    <header className="nav">
      <div className="container">
        <div className="nav-inner span-12">
          <a href="#" className="nav-brand" aria-label="Xsharect, início">
            <img
              src={`${import.meta.env.BASE_URL}icon-512.png`}
              alt=""
              width={32}
              height={32}
            />
            <span className="nav-title">Xsharect</span>
          </a>
          <nav className="nav-links" aria-label="Navegação principal">
            <a href="#produto">Produto</a>
            <a href="#como-funciona">Como funciona</a>
          </nav>
          <a href="#download" className="btn-primary nav-cta">
            <DownloadIcon />
            <span className="nav-cta-label">Baixar APK</span>
          </a>
        </div>
      </div>
    </header>
  );
}
