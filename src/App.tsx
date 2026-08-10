import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Showcase } from "./components/Showcase";
import { HowItWorks } from "./components/HowItWorks";
import { DownloadSection } from "./components/DownloadSection";
import { Footer } from "./components/Footer";
import { useSmoothAnchorScroll } from "./hooks/useSmoothAnchorScroll";

export default function App() {
  useSmoothAnchorScroll();

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className="mesh-bg" aria-hidden="true" />
      <Nav />
      <main id="conteudo">
        <Hero />
        <Showcase />
        <HowItWorks />
        <DownloadSection />
      </main>
      <Footer />
    </>
  );
}
