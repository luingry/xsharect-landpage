import { Reveal } from './Reveal';
import './HowItWorks.css';

const steps = [
  {
    n: '01',
    title: 'Instale no Android',
    body: 'Baixe o APK, conceda acessibilidade e permissões de captura de tela.',
  },
  {
    n: '02',
    title: 'Inicie a transmissão',
    body: 'Toque em Transmitir. O app exibe a URL local — http://IP:9240/.',
  },
  {
    n: '03',
    title: 'Abra no navegador',
    body: 'No PC ou outro celular na mesma rede, conecte e assista ao vivo.',
  },
  {
    n: '04',
    title: 'Controle quando precisar',
    body: 'Ative o toque remoto e use a barra de navegação do visualizador.',
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="how section"
      aria-labelledby="how-title"
    >
      <div className="container">
        <Reveal className="span-12">
          <p className="eyebrow">Fluxo na LAN</p>
          <h2 id="how-title" className="section-title">
            Quatro passos na sua rede
          </h2>
        </Reveal>

        <ol className="how-steps span-12">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={0.08 * i} className="how-step">
              <span className="how-num" aria-hidden="true">
                {s.n}
              </span>
              <div>
                <h3 className="how-step-title">{s.title}</h3>
                <p className="how-step-body">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
