import { useEffect, useRef } from "react";
import { Reveal } from "./Reveal";
import "./HowItWorks.css";

const steps = [
  {
    n: "01",
    stage: "HOST",
    title: "Instale no Android",
    body: "Baixe o APK, instale no telefone e permita acessibilidade e captura de tela.",
  },
  {
    n: "02",
    stage: "STREAM",
    title: "Inicie a transmissão",
    body: "Toque em Transmitir e confira o endereço local mostrado pelo app.",
  },
  {
    n: "03",
    stage: "VIEWER",
    title: "Abra no navegador",
    body: "No navegador, abra o endereço. Confirme a mesma rede Wi-Fi e evite rede de convidados.",
  },
  {
    n: "04",
    stage: "CONTROL",
    title: "Controle quando precisar",
    body: "Ative a permissão de controle quando precisar tocar ou navegar remotamente.",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (
      !section ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    let inView = false;
    const update = () =>
      section.classList.toggle("how-is-active", inView && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        update();
      },
      { threshold: 0.12 },
    );

    observer.observe(section);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <section
      id="como-funciona"
      className="how section"
      aria-labelledby="how-title"
      ref={sectionRef}
    >
      <div className="container">
        <Reveal className="span-12">
          <p className="eyebrow">Fluxo na LAN</p>
          <h2 id="how-title" className="section-title">
            Quatro passos na sua rede
          </h2>
        </Reveal>
        <div className="how-protocol span-12">
          <svg
            className="how-backbone"
            viewBox="0 0 40 1000"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path className="how-backbone-line" d="M20 0 V1000" />
            <path
              className="how-backbone-pulse"
              d="M20 0 V1000"
              pathLength="1"
            />
          </svg>
          <ol className="how-steps">
            {steps.map((step) => (
              <li key={step.n}>
                <Reveal className="how-step">
                  <span className="how-num" aria-hidden="true">
                    {step.n}
                  </span>
                  <div>
                    <p className="how-stage">{step.stage}</p>
                    <h3 className="how-step-title">{step.title}</h3>
                    <p className="how-step-body">{step.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
