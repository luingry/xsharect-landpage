import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Showcase } from './components/Showcase';
import { HowItWorks } from './components/HowItWorks';
import { DownloadSection } from './components/DownloadSection';
import { Footer } from './components/Footer';
import { OverlayScrollbar } from './components/OverlayScrollbar';
import { useSmoothAnchorScroll } from './hooks/useSmoothAnchorScroll';

export default function App() {
  useSmoothAnchorScroll();

  return (
    <>
      <OverlayScrollbar />
      <div className="mesh-bg" aria-hidden="true" />
      <Nav />
      <main className="overflow-x-hidden w-full max-w-full">
        <Hero />
        <Showcase />
        <HowItWorks />
        <DownloadSection />
      </main>
      <Footer />
    </>
  );
}
