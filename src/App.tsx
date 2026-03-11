import { useState, useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════════ */
const globalCSS = `
  @import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .marquee-track { animation: marquee 36s linear infinite; }
  .marquee-track:hover { animation-play-state: paused; }

  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.72s cubic-bezier(0.22,1,0.36,1),
                transform 0.72s cubic-bezier(0.22,1,0.36,1);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.10s; }
  .reveal-delay-2 { transition-delay: 0.22s; }
  .reveal-delay-3 { transition-delay: 0.34s; }
  .reveal-delay-4 { transition-delay: 0.46s; }
  .reveal-delay-5 { transition-delay: 0.58s; }

  /* ── Glass card ── */
  .glass-card {
    background: linear-gradient(180deg, rgba(245,245,245,0.035) 0%, rgba(245,245,245,0.01) 100%);
    border: 1px solid rgba(245,245,245,0.07);
    box-shadow: inset 0 1px 0 rgba(245,245,245,0.09);
    border-radius: 16px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    position: relative;
    overflow: hidden;
    transition: transform 0.38s cubic-bezier(0.22,1,0.36,1),
                border-color 0.38s ease, box-shadow 0.38s ease;
  }
  .glass-card::before {
    content: '';
    position: absolute; top: 0; left: -60%; width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(245,245,245,0.05), transparent);
    transform: skewX(-18deg);
    transition: left 0.6s cubic-bezier(0.22,1,0.36,1);
    pointer-events: none;
  }
  .glass-card:hover::before { left: 120%; }
  .glass-card:hover {
    transform: translateY(-4px) scale(1.01);
    border-color: rgba(245,245,245,0.16);
    box-shadow: inset 0 1px 0 rgba(245,245,245,0.15),
                0 28px 72px rgba(0,0,0,0.52),
                0 0 48px rgba(245,245,245,0.045);
  }

  /* ── Buttons ── */
  .btn-primary {
    background: #f5f5f5; color: #2c2c2c; border: none;
    border-radius: 9999px; font-family: 'Inter', sans-serif; font-weight: 500;
    cursor: pointer; position: relative; overflow: hidden;
    transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease, background 0.2s ease;
    white-space: nowrap;
  }
  .btn-primary::after {
    content: ''; position: absolute; top: 0; left: -70%; width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
    transform: skewX(-18deg);
    transition: left 0.52s cubic-bezier(0.22,1,0.36,1); pointer-events: none;
  }
  .btn-primary:hover::after { left: 130%; }
  .btn-primary:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 0 42px rgba(245,245,245,0.32), 0 8px 28px rgba(0,0,0,0.38);
    background: #ffffff;
  }

  .btn-glass {
    background: rgba(245,245,245,0.07); color: #f5f5f5;
    border: 1px solid rgba(245,245,245,0.16); border-radius: 9999px;
    font-family: 'Inter', sans-serif; font-weight: 500; cursor: pointer;
    position: relative; overflow: hidden;
    transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease,
                background 0.2s ease, border-color 0.2s ease;
    white-space: nowrap;
  }
  .btn-glass::after {
    content: ''; position: absolute; top: 0; left: -70%; width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(245,245,245,0.14), transparent);
    transform: skewX(-18deg);
    transition: left 0.52s cubic-bezier(0.22,1,0.36,1); pointer-events: none;
  }
  .btn-glass:hover::after { left: 130%; }
  .btn-glass:hover {
    transform: translateY(-2px) scale(1.02);
    background: rgba(245,245,245,0.12);
    border-color: rgba(245,245,245,0.32);
    box-shadow: 0 0 30px rgba(245,245,245,0.10), 0 8px 28px rgba(0,0,0,0.28);
  }

  /* ── Gradient text ── */
  .gradient-text {
    background: linear-gradient(144.5deg, #f5f5f5 28%, rgba(245,245,245,0.12) 115%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Chess grid pattern ── */
  .chess-pattern {
    background-image:
      linear-gradient(rgba(245,245,245,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(245,245,245,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    -webkit-mask-image: radial-gradient(ellipse 85% 65% at 50% 50%, black 35%, transparent 100%);
    mask-image: radial-gradient(ellipse 85% 65% at 50% 50%, black 35%, transparent 100%);
  }

  /* ── Nav link ── */
  .nav-link {
    color: rgba(245,245,245,0.72); font-size: 14px; font-weight: 500;
    text-decoration: none; font-family: 'Inter', sans-serif;
    transition: color 0.2s ease; cursor: pointer;
  }
  .nav-link:hover { color: #f5f5f5; }

  /* ── Comparison table ── */
  .compare-table { width: 100%; border-collapse: collapse; }
  .compare-table th, .compare-table td {
    padding: 14px 20px; text-align: left; font-size: 14px;
    border-bottom: 1px solid rgba(245,245,245,0.05);
    font-family: 'Inter', sans-serif;
  }
  .compare-table th {
    font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: rgba(245,245,245,0.38);
    padding-bottom: 16px;
  }
  .compare-table td:first-child { color: rgba(245,245,245,0.50); font-weight: 500; }
  .compare-table td:not(:first-child) { color: rgba(245,245,245,0.72); }
  .compare-table td.highlight { color: #f5f5f5; font-weight: 500; }
  .compare-table tr:last-child td { border-bottom: none; }
  .compare-table tr:hover td { background: rgba(245,245,245,0.02); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #2c2c2c; }
  ::-webkit-scrollbar-thumb { background: rgba(245,245,245,0.12); border-radius: 9999px; }

  .noise::after {
    content: ''; position: absolute; inset: 0; border-radius: inherit; opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    pointer-events: none;
  }
  .traffic-dot { width: 12px; height: 12px; border-radius: 9999px; }

  @media (max-width: 768px) {
    .nav-links        { display: none !important; }
    .hero-heading     { font-size: 34px !important; }
    .hero-ctas        { flex-direction: column !important; align-items: center !important; }
    .problem-grid     { grid-template-columns: 1fr !important; }
    .phases-grid      { grid-template-columns: 1fr !important; }
    .pillars-grid     { grid-template-columns: 1fr !important; }
    .testi-grid       { grid-template-columns: 1fr !important; }
    .metrics-grid     { flex-direction: column !important; gap: 32px !important; }
    .metrics-divider  { display: none !important; }
    .footer-inner     { flex-direction: column !important; gap: 24px !important; align-items: center !important; text-align: center !important; }
    .hero-pad         { padding-top: 200px !important; }
    .nav-pad          { padding-left: 24px !important; padding-right: 24px !important; }
    .section-pad      { padding-left: 24px !important; padding-right: 24px !important; }
    .compare-table th, .compare-table td { padding: 10px 12px; font-size: 12px; }
    .hide-mobile      { display: none !important; }
  }
`

/* ─── ICONS ─────────────────────────────────────────────────────── */
const BishopIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    style={{ opacity: 0.16, flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3C10.9 3 10 3.9 10 5C10 5.7 10.4 6.3 11 6.7L8.5 12H7C6.4 12 6 12.4 6 13V14H7.5L6 19H5V21H19V21H18L16.5 14H18V13C18 12.4 17.6 12 17 12H15.5L13 6.7C13.6 6.3 14 5.7 14 5C14 3.9 13.1 3 12 3Z"
      fill="rgba(245,245,245,1)" />
  </svg>
)

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, marginTop: 2 }}>
    <path d="M2 7.5L6 11.5L13 3.5" stroke="rgba(245,245,245,0.7)" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CrossIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, marginTop: 2 }}>
    <path d="M2 2L11 11M11 2L2 11" stroke="rgba(245,245,245,0.25)" strokeWidth="1.5"
      strokeLinecap="round"/>
  </svg>
)

/* ─── SCROLL REVEAL ─────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/* ─── SECTION LABEL ─────────────────────────────────────────────── */
function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'rgba(245,245,245,0.06)', border: '1px solid rgba(245,245,245,0.12)',
      borderRadius: 9999, padding: '5px 16px', marginBottom: 24,
    }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'rgba(245,245,245,0.60)' }}>
        {children}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   1. NAVBAR
═══════════════════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className="nav-pad" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 80px',
      transition: 'background 0.45s ease, backdrop-filter 0.45s ease, border-color 0.45s ease',
      background: scrolled ? 'rgba(44,44,44,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px) saturate(1.5)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.5)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(245,245,245,0.07)' : '1px solid transparent',
    }}>
      <img
  src="/images/logo_white.png"
  alt="Checkmate Partners"
  style={{ height: 28, width: 'auto', objectFit: 'contain' }}
/>

      <div className="nav-links" style={{ display: 'flex', gap: 28 }}>
        {['O Problema', 'Como Entramos', 'O Que Construímos', 'Resultados'].map((l) => (
          <a key={l} className="nav-link">{l}</a>
        ))}
      </div>

      <button className="btn-glass" style={{ fontSize: 13, padding: '10px 20px', flexShrink: 0 }}>
        Agendar Diagnóstico
      </button>
    </nav>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   2. HERO
═══════════════════════════════════════════════════════════════════ */
function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    const handleCanPlay = () => {
      setVideoReady(true)
      video.play().catch(() => {})
    }
    video.addEventListener('canplaythrough', handleCanPlay)
    return () => video.removeEventListener('canplaythrough', handleCanPlay)
  }, [])

  return (
    <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Placeholder escuro */}
      <div style={{
        position: 'absolute', inset: 0, background: '#1a1a1a', zIndex: 1,
        transition: 'opacity 1s ease', opacity: videoReady ? 0 : 1, pointerEvents: 'none',
      }} />

      {/* Vídeo local */}
      <video ref={videoRef} muted loop playsInline preload="auto" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center center',
        transition: 'opacity 1.2s ease', opacity: videoReady ? 1 : 0,
      }}>
        <source src="/videos/black_hole.mp4" type="video/mp4" />
      </video>

      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.50)', zIndex: 2 }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 320,
        background: 'linear-gradient(to top, #2c2c2c 0%, transparent 100%)',
        zIndex: 3, pointerEvents: 'none',
      }} />

      <div className="hero-pad" style={{
        position: 'relative', zIndex: 4,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', paddingTop: 280, paddingLeft: 24, paddingRight: 24,
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(245,245,245,0.10)', border: '1px solid rgba(245,245,245,0.22)',
          borderRadius: 20, padding: '7px 16px', marginBottom: 36,
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5f5f5', flexShrink: 0,
            boxShadow: '0 0 8px rgba(245,245,245,0.65)' }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: '#f5f5f5' }}>Diagnóstico gratuito disponível</span>
        </div>

        {/* Heading */}
        <h1 className="hero-heading gradient-text" style={{
          fontFamily: "'General Sans', sans-serif", fontWeight: 500,
          fontSize: 56, lineHeight: 1.28, letterSpacing: '-0.022em',
          maxWidth: 680, marginBottom: 28,
        }}>
          Seu negócio não está quebrado.{' '}
          <br />
          Só está em xeque.
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 16, fontWeight: 400, color: 'rgba(245,245,245,0.68)',
          maxWidth: 600, lineHeight: 1.78, marginBottom: 48,
        }}>
          A maioria das empresas contrata especialistas. Nós entramos no seu negócio, aprendemos seus processos, conhecemos sua equipe — e executamos o plano do início ao fim. Sem relatório bonito. Sem reunião semanal pra mostrar número. Crescimento real ou não existe parceria.
        </p>

        <div className="hero-ctas" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn-primary" style={{ fontSize: 15, padding: '15px 32px' }}>
            Fazer o Primeiro Movimento
          </button>
          <button className="btn-glass" style={{ fontSize: 15, padding: '15px 32px' }}>
            Agendar Diagnóstico Gratuito
          </button>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   3. TICKER
═══════════════════════════════════════════════════════════════════ */
function Ticker() {
  const items = [
    { text: 'Lucro líquido real',              w: 600, o: 1.0  },
    { text: 'Marketing all-in-one',             w: 500, o: 0.70 },
    { text: 'Atendimento destravado',           w: 400, o: 0.50 },
    { text: 'Operação autônoma',                w: 600, o: 0.85 },
    { text: 'Sem pacote genérico',              w: 500, o: 0.65 },
    { text: 'Parceiro que executa',             w: 600, o: 0.90 },
    { text: 'Resultado ou não existe parceria', w: 500, o: 0.70 },
  ]
  const doubled = [...items, ...items]

  return (
    <div style={{
      borderTop: '1px solid rgba(245,245,245,0.05)',
      borderBottom: '1px solid rgba(245,245,245,0.05)',
      padding: '22px 0', overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ position: 'absolute', inset: '0 auto 0 0', width: 140,
        background: 'linear-gradient(to right, #2c2c2c, transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: '0 0 0 auto', width: 140,
        background: 'linear-gradient(to left, #2c2c2c, transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div className="marquee-track" style={{ display: 'flex', whiteSpace: 'nowrap', width: 'max-content' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontFamily: "'General Sans', sans-serif", fontWeight: item.w, fontSize: 14,
            color: `rgba(245,245,245,${item.o})`, marginRight: 56, letterSpacing: '0.01em',
          }}>
            {item.text}
            <span style={{ marginLeft: 56, opacity: 0.20, fontWeight: 300 }}>•</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   4. O PROBLEMA
═══════════════════════════════════════════════════════════════════ */
function OProblema() {
  const tried = [
    {
      what: 'Gestor de tráfego',
      why: 'Só enxerga o anúncio — não o que acontece depois do clique.',
    },
    {
      what: 'Agência especializada',
      why: 'Entrega o serviço dela, não o crescimento do seu negócio.',
    },
    {
      what: 'Consultoria tradicional',
      why: 'Aponta o caminho e some. Você continua sem executar.',
    },
  ]

  return (
    <section className="chess-pattern section-pad" style={{ padding: '120px 80px', position: 'relative' }}>
      {/* Ambient */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 800, height: 600, background: 'rgba(245,245,245,0.018)',
        borderRadius: '50%', filter: 'blur(130px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div className="reveal" style={{ maxWidth: 680, marginBottom: 64 }}>
          <SectionLabel>O Problema</SectionLabel>
          <h2 style={{
            fontFamily: "'General Sans', sans-serif", fontWeight: 500,
            fontSize: 40, lineHeight: 1.22, letterSpacing: '-0.022em', marginBottom: 24,
          }}>
            Você não precisa de mais um especialista.{' '}
            <span style={{ color: 'rgba(245,245,245,0.45)' }}>
              Você precisa de alguém que enxergue o negócio inteiro.
            </span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(245,245,245,0.62)', lineHeight: 1.78, marginBottom: 20 }}>
            Você já contratou gestor de tráfego. Já tentou agência. Já testou freelancer. Cada um resolveu uma peça — e o crescimento continuou travado.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(245,245,245,0.50)', lineHeight: 1.78, marginBottom: 20 }}>
            Não foi sua culpa. O mercado foi construído para te vender solução isolada.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(245,245,245,0.50)', lineHeight: 1.78 }}>
            O problema é que empresa não é um motor com uma peça quebrada. É um sistema. Quando o marketing não converte, talvez o problema seja o atendimento. Quando o atendimento está sobrecarregado, talvez o processo de vendas esteja mal estruturado. Tratar sintoma por sintoma é remar em círculos.
          </p>
        </div>

        {/* Contrast blocks */}
        <div className="problem-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 48 }}>
          {tried.map((item, i) => (
            <div key={i} className={`glass-card reveal reveal-delay-${i + 1}`} style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <CrossIcon />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(245,245,245,0.55)',
                  letterSpacing: '0.01em' }}>{item.what}</span>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(245,245,245,0.48)', lineHeight: 1.65 }}>
                {item.why}
              </p>
            </div>
          ))}
        </div>

        {/* CTA link */}
        <div className="reveal" style={{ textAlign: 'center' }}>
          <a style={{
            fontSize: 15, color: 'rgba(245,245,245,0.72)', cursor: 'pointer',
            fontWeight: 500, textDecoration: 'none',
            borderBottom: '1px solid rgba(245,245,245,0.18)', paddingBottom: 2,
            transition: 'color 0.2s',
          }}>
            É por isso que a Checkmate existe de um jeito diferente →
          </a>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   5. COMO A CHECKMATE ENTRA
═══════════════════════════════════════════════════════════════════ */
function ComoEntramos() {
  const phases = [
    {
      num: '01',
      label: 'Diagnóstico Estratégico',
      badge: 'gratuito',
      body: 'Não é uma call de 30 minutos pra te convencer a contratar. É um diagnóstico real, feito por quem já destravou dezenas de negócios. Saímos da conversa com um mapa do que está travando seu crescimento — e com um caminho claro para o lucro.',
    },
    {
      num: '02',
      label: 'Plano de Implementação',
      badge: null,
      body: 'Um plano por escrito. Com o que será feito, quando, por quem e qual resultado esperado em cada etapa. Sem achismo. Sem vagueza. Você sabe exatamente no que está investindo antes de começar.',
    },
    {
      num: '03',
      label: 'Execução ao seu lado',
      badge: null,
      body: 'Aqui é onde somos diferentes. Nós não apontamos o caminho e te deixamos ir. Nós executamos junto. Tráfego pago. Email marketing. WhatsApp marketing. Landing pages. Automações com IA. Chatbot. Estratégia de conteúdo. Tudo sob um mesmo teto, semana a semana, construindo a máquina — não mostrando número bonito.',
    },
    {
      num: '04',
      label: 'Crescimento Previsível',
      badge: null,
      body: 'O objetivo final não é um bom mês. É um sistema que funciona sem depender de você apagando incêndio. Marketing que atrai. Atendimento que converte. Operação que escala. Lucro líquido real — não ROI de slide.',
    },
  ]

  return (
    <section className="section-pad" style={{ padding: '120px 80px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div className="reveal" style={{ maxWidth: 680, marginBottom: 72 }}>
          <SectionLabel>Como Entramos</SectionLabel>
          <h2 style={{
            fontFamily: "'General Sans', sans-serif", fontWeight: 500,
            fontSize: 40, lineHeight: 1.22, letterSpacing: '-0.022em', marginBottom: 20,
          }}>
            Não terceirizamos.{' '}
            Não mandamos relatório.{' '}
            <span style={{ color: 'rgba(245,245,245,0.45)' }}>Nós entramos.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(245,245,245,0.58)', lineHeight: 1.75 }}>
            Antes de qualquer estratégia, a gente aprende seu negócio de dentro. Seus processos. Sua equipe. Seus números reais. Onde o dinheiro está escapando.
          </p>
        </div>

        {/* Phases */}
        <div className="phases-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
          {phases.map((phase, i) => (
            <div key={i} className={`glass-card reveal reveal-delay-${i + 1}`} style={{ padding: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{
                  fontFamily: "'General Sans', sans-serif", fontSize: 12, fontWeight: 600,
                  color: 'rgba(245,245,245,0.28)', letterSpacing: '0.12em',
                }}>
                  FASE {phase.num}
                </span>
                {phase.badge && (
                  <span style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: 'rgba(245,245,245,0.07)', border: '1px solid rgba(245,245,245,0.14)',
                    borderRadius: 9999, padding: '4px 10px', color: 'rgba(245,245,245,0.60)',
                  }}>{phase.badge}</span>
                )}
              </div>
              <h3 style={{
                fontFamily: "'General Sans', sans-serif", fontWeight: 500,
                fontSize: 22, lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: 14,
              }}>
                {phase.label}
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(245,245,245,0.60)', lineHeight: 1.72 }}>
                {phase.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   6. O QUE CONSTRUÍMOS
═══════════════════════════════════════════════════════════════════ */
function OQueConstruimos() {
  const pillars = [
    {
      num: '01',
      title: 'Marketing que gera lucro de verdade',
      body: 'Meta Ads com foco em lucro líquido real — não impressão, não clique, não ROI positivo que some quando você desconta o custo. Landing pages que convertem. Email marketing e WhatsApp marketing que nutrem e reativam clientes. Cada real investido com intenção e rastreabilidade.',
      tags: ['Gestão de tráfego pago', 'Landing pages', 'Email marketing', 'WhatsApp marketing', 'Estratégia de conteúdo'],
    },
    {
      num: '02',
      title: 'Atendimento que não trava mais',
      body: 'Seu atendimento não deve sugar energia da sua equipe. Deve converter. Automações com IA e chatbot estratégico que liberam seu time para o que importa — e garantem que nenhum cliente em potencial caia no vazio.',
      tags: ['Chatbot com IA', 'Automações de atendimento', 'Fluxos de conversão', 'Integração com CRM'],
    },
    {
      num: '03',
      title: 'Operação que funciona sozinha',
      body: 'Processos mapeados, otimizados e automatizados. A empresa que hoje depende de você para cada decisão vai passar a funcionar com mais autonomia — e você vai voltar a pensar no futuro, não no dia a dia.',
      tags: ['Mapeamento de processos', 'Automações operacionais', 'Dashboards de resultado', 'Estrutura de crescimento'],
    },
  ]

  return (
    <section className="chess-pattern section-pad" style={{ padding: '120px 80px', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 900, height: 700, background: 'rgba(245,245,245,0.016)',
        borderRadius: '50%', filter: 'blur(140px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 72 }}>
          <SectionLabel>O Que Construímos</SectionLabel>
          <h2 style={{
            fontFamily: "'General Sans', sans-serif", fontWeight: 500,
            fontSize: 40, lineHeight: 1.22, letterSpacing: '-0.022em',
            maxWidth: 620, margin: '0 auto 18px',
          }}>
            Tudo que seu negócio precisa para crescer.{' '}
            <span style={{ color: 'rgba(245,245,245,0.45)' }}>Em um único parceiro.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(245,245,245,0.52)', maxWidth: 520, margin: '0 auto', lineHeight: 1.72 }}>
            Nada terceirizado. Nada fragmentado. Uma estratégia integrada, executada por quem conhece cada detalhe do seu negócio.
          </p>
        </div>

        {/* Pillars */}
        <div className="pillars-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
          {pillars.map((p, i) => (
            <div key={i} className={`glass-card reveal reveal-delay-${i + 1}`} style={{ padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
                  color: 'rgba(245,245,245,0.28)', textTransform: 'uppercase' }}>
                  {p.num}
                </span>
                <BishopIcon />
              </div>
              <h3 style={{
                fontFamily: "'General Sans', sans-serif", fontWeight: 500,
                fontSize: 20, lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: 14,
              }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(245,245,245,0.58)', lineHeight: 1.72, marginBottom: 24 }}>
                {p.body}
              </p>
              <div style={{ paddingTop: 20, borderTop: '1px solid rgba(245,245,245,0.06)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase',
                  color: 'rgba(245,245,245,0.28)', marginBottom: 12 }}>O que construímos</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.tags.map((tag) => (
                    <div key={tag} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <CheckIcon />
                      <span style={{ fontSize: 13, color: 'rgba(245,245,245,0.55)', lineHeight: 1.4 }}>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Honest disclaimer */}
        <div className="reveal" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(245,245,245,0.35)', fontStyle: 'italic', lineHeight: 1.65 }}>
            Somos all-in-one dentro dos nossos limites de tempo e escopo. Priorizamos poucos clientes para entregarmos qualidade real — não quantidade.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   7. RESULTADOS — Diagnostic Window
═══════════════════════════════════════════════════════════════════ */
function DiagnosticWindow() {
  return (
    <div className="noise" style={{
      maxWidth: 700, margin: '0 auto',
      background: '#1a1a1a', borderRadius: 16,
      border: '1px solid rgba(245,245,245,0.09)',
      boxShadow: '0 56px 100px rgba(0,0,0,0.70), inset 0 1px 0 rgba(245,245,245,0.07)',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px',
        borderBottom: '1px solid rgba(245,245,245,0.06)',
        background: 'rgba(245,245,245,0.02)',
      }}>
        <div className="traffic-dot" style={{ background: '#ff5f56' }} />
        <div className="traffic-dot" style={{ background: '#ffbd2e' }} />
        <div className="traffic-dot" style={{ background: '#27c93f' }} />
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 500,
          color: 'rgba(245,245,245,0.40)', marginLeft: 12, letterSpacing: '0.01em' }}>
          Diagnóstico Estratégico — Parceiro #12
        </span>
      </div>

      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(245,245,245,0.30)', letterSpacing: '0.12em',
              textTransform: 'uppercase', marginBottom: 5 }}>Relatório de Diagnóstico</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: '#f5f5f5',
              fontFamily: "'General Sans',sans-serif" }}>Oportunidades Identificadas</div>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase',
            background: 'rgba(245,245,245,0.07)', border: '1px solid rgba(245,245,245,0.12)',
            borderRadius: 9999, padding: '5px 12px', color: 'rgba(245,245,245,0.62)',
          }}>Sessão 1 de 1</span>
        </div>

        {/* Before/After */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'CAC Atual',    before: 'R$ 480',   after: 'R$ 127',   icon: '↓' },
            { label: 'LTV Médio',    before: 'R$ 1.200', after: 'R$ 4.800', icon: '↑' },
            { label: 'Ticket médio', before: 'R$ 890',   after: 'R$ 2.340', icon: '↑' },
          ].map((m, i) => (
            <div key={i} style={{
              background: 'rgba(245,245,245,0.03)', border: '1px solid rgba(245,245,245,0.06)',
              borderRadius: 12, padding: 16,
            }}>
              <div style={{ fontSize: 11, color: 'rgba(245,245,245,0.30)', marginBottom: 8,
                letterSpacing: '0.06em', textTransform: 'uppercase' }}>{m.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: 'rgba(245,245,245,0.28)', textDecoration: 'line-through' }}>{m.before}</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#f5f5f5' }}>{m.icon} {m.after}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Next steps */}
        <div style={{ background: 'rgba(245,245,245,0.02)', border: '1px solid rgba(245,245,245,0.06)',
          borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 11, color: 'rgba(245,245,245,0.30)', letterSpacing: '0.12em',
            textTransform: 'uppercase', marginBottom: 16 }}>Próximos Passos</div>
          {[
            { step: '01', text: 'Reestruturar funil de aquisição — ROI atual abaixo do break-even',  tag: 'Semana 1'   },
            { step: '02', text: 'Implementar automação no atendimento — redução de 60% no workload', tag: 'Semana 2–3' },
            { step: '03', text: 'Criar pipeline de upsell — receita recorrente 3× maior',            tag: 'Semana 4'   },
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              gap: 16, padding: '12px 0',
              borderBottom: i < 2 ? '1px solid rgba(245,245,245,0.05)' : 'none',
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontFamily: "'General Sans',sans-serif", fontSize: 12,
                  fontWeight: 600, color: 'rgba(245,245,245,0.20)', marginTop: 1 }}>{s.step}</span>
                <span style={{ fontSize: 13, color: 'rgba(245,245,245,0.68)', lineHeight: 1.55 }}>{s.text}</span>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 500, color: 'rgba(245,245,245,0.36)',
                background: 'rgba(245,245,245,0.04)', border: '1px solid rgba(245,245,245,0.08)',
                borderRadius: 9999, padding: '3px 10px', whiteSpace: 'nowrap', marginTop: 1,
              }}>{s.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Resultados() {
  const testimonials = [
    {
      quote: 'Eu já tinha uma gestão de tráfego, mas sentia que estava só queimando dinheiro com uma estratégia defasada. Após o diagnóstico, eles ajustaram o plano de anúncios e, pela primeira vez, vi um lucro real, com um retorno de 5 para cada 1 investido. Deixamos de ter um custo para ter uma máquina de vendas.',
      name: 'Ricardo Mendes',
      role: 'CEO, Agência Volta',
      initials: 'RM',
    },
    {
      quote: 'Nosso atendimento estava completamente travado, sobrecarregando a equipe e gerando reclamações. A consultoria não só identificou o problema, como implementou um chatbot com I.A que resolveu o gargalo. Foi uma solução prática que liberou meu time para focar no que realmente importa.',
      name: 'Camila Torres',
      role: 'Fundadora, Studio Cora',
      initials: 'CT',
    },
  ]

  return (
    <section className="section-pad" style={{ padding: '120px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 72 }}>
          <SectionLabel>Resultados</SectionLabel>
          <h2 style={{
            fontFamily: "'General Sans', sans-serif", fontWeight: 500,
            fontSize: 40, lineHeight: 1.22, letterSpacing: '-0.022em',
            maxWidth: 560, margin: '0 auto 16px',
          }}>
            Diagnósticos reais.{' '}
            <span style={{ color: 'rgba(245,245,245,0.45)' }}>
              Resultados que aparecem no caixa.
            </span>
          </h2>
        </div>

        {/* Diagnostic window */}
        <div className="reveal reveal-delay-1" style={{ marginBottom: 72 }}>
          <DiagnosticWindow />
        </div>

        {/* Testimonials preamble */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 32 }}>
          <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'rgba(245,245,245,0.35)' }}>
            Não pedimos para nossos parceiros falar sobre o serviço.<br/>
            Pedimos para falar sobre o resultado.
          </p>
        </div>

        {/* Testimonials */}
        <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
          {testimonials.map((t, i) => (
            <div key={i} className={`glass-card reveal reveal-delay-${i + 1}`} style={{ padding: 36 }}>
              <div style={{
                fontFamily: "'General Sans',sans-serif", fontSize: 52, lineHeight: 1,
                color: 'rgba(245,245,245,0.07)', marginBottom: 6, fontWeight: 700, userSelect: 'none',
              }}>"</div>
              <p style={{ fontSize: 15, lineHeight: 1.82, color: 'rgba(245,245,245,0.76)',
                marginBottom: 32, fontWeight: 300 }}>
                {t.quote}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(245,245,245,0.08)', border: '1px solid rgba(245,245,245,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600, color: 'rgba(245,245,245,0.62)',
                }}>{t.initials}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(245,245,245,0.40)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   8. POR QUE A CHECKMATE É DIFERENTE
═══════════════════════════════════════════════════════════════════ */
function Diferencial() {
  const rows = [
    {
      attribute: 'Diagnóstico',
      agencia: 'Vende pacote',
      consultoria: 'Faz diagnóstico',
      checkmate: 'Diagnóstico gratuito e profundo',
    },
    {
      attribute: 'Execução',
      agencia: 'Executa (um serviço)',
      consultoria: 'Só aponta o caminho',
      checkmate: 'Executa tudo junto',
    },
    {
      attribute: 'Visão integrada',
      agencia: 'Foco no próprio serviço',
      consultoria: 'Às vezes',
      checkmate: 'Marketing + Atendimento + Operação',
    },
    {
      attribute: 'Foco em resultado',
      agencia: 'ROI positivo',
      consultoria: 'Recomendações',
      checkmate: 'Lucro líquido real',
    },
    {
      attribute: 'Relação',
      agencia: 'Fornecedor',
      consultoria: 'Consultor',
      checkmate: 'Parceiro de crescimento',
    },
  ]

  return (
    <section className="chess-pattern section-pad" style={{ padding: '120px 80px', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 800, height: 600, background: 'rgba(245,245,245,0.018)',
        borderRadius: '50%', filter: 'blur(130px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionLabel>Por que somos diferentes</SectionLabel>
          <h2 style={{
            fontFamily: "'General Sans', sans-serif", fontWeight: 500,
            fontSize: 40, lineHeight: 1.22, letterSpacing: '-0.022em',
            maxWidth: 660, margin: '0 auto',
          }}>
            Não somos agência.{' '}
            Não somos consultoria de slide.{' '}
            <span style={{ color: 'rgba(245,245,245,0.45)' }}>
              Somos o parceiro que fica até funcionar.
            </span>
          </h2>
        </div>

        {/* Table */}
        <div className="reveal reveal-delay-1 glass-card" style={{ padding: '8px 8px', overflow: 'auto' }}>
          <table className="compare-table">
            <thead>
              <tr>
                <th style={{ width: '18%' }}> </th>
                <th className="hide-mobile" style={{ width: '27%' }}>Agência tradicional</th>
                <th className="hide-mobile" style={{ width: '27%' }}>Consultoria comum</th>
                <th style={{ width: '28%', color: 'rgba(245,245,245,0.72)' }}>Checkmate</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, fontSize: 13, color: 'rgba(245,245,245,0.45)' }}>
                    {row.attribute}
                  </td>
                  <td className="hide-mobile">{row.agencia}</td>
                  <td className="hide-mobile">{row.consultoria}</td>
                  <td className="highlight">{row.checkmate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   9. CTA FINAL
═══════════════════════════════════════════════════════════════════ */
function CTAFinal() {
  return (
    <section className="section-pad" style={{ padding: '140px 80px', position: 'relative', textAlign: 'center' }}>
      {/* Radial glow layers */}
      {[
        { w: 900, h: 550, blur: 110, o: 0.034 },
        { w: 500, h: 300, blur: 55,  o: 0.028 },
      ].map((g, i) => (
        <div key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: g.w, height: g.h,
          background: `rgba(245,245,245,${g.o})`,
          borderRadius: '50%', filter: `blur(${g.blur}px)`, pointerEvents: 'none',
        }} />
      ))}

      <div className="reveal" style={{ position: 'relative' }}>
        <h2 style={{
          fontFamily: "'General Sans', sans-serif", fontWeight: 500,
          fontSize: 52, lineHeight: 1.2, letterSpacing: '-0.025em',
          maxWidth: 720, margin: '0 auto 20px',
        }}>
          Pronto para dar o xeque-mate na estagnação?
        </h2>
        <p style={{ fontSize: 18, color: 'rgba(245,245,245,0.65)', maxWidth: 520,
          margin: '0 auto 16px', lineHeight: 1.72, fontWeight: 400 }}>
          O diagnóstico é gratuito. O que você vai descobrir sobre o seu negócio — não tem preço.
        </p>
        <p style={{ fontSize: 15, color: 'rgba(245,245,245,0.42)', maxWidth: 480,
          margin: '0 auto 48px', lineHeight: 1.72 }}>
          Em uma sessão, a gente mapeia o que está travando seu crescimento e te mostra um caminho claro para o lucro. Sem compromisso. Sem pitch de venda disfarçado de diagnóstico.
        </p>
        <button className="btn-primary" style={{ fontSize: 16, padding: '20px 52px', marginBottom: 24 }}>
          Agendar Diagnóstico Gratuito
        </button>
        <div>
          <p style={{ fontSize: 13, color: 'rgba(245,245,245,0.30)', letterSpacing: '0.04em' }}>
            Poucos clientes por vez. Foco total. Resultado real.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   10. FOOTER
═══════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="chess-pattern section-pad" style={{
      borderTop: '1px solid rgba(245,245,245,0.10)',
      padding: '36px 80px',
    }}>
      <div className="footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <img
  src="/images/logo_white.png"
  alt="Checkmate Partners"
  style={{ height: 22, width: 'auto', objectFit: 'contain', opacity: 0.80, marginBottom: 4 }}
/>
          <span style={{ fontSize: 12, color: 'rgba(245,245,245,0.30)', fontStyle: 'italic',
            fontFamily: "'Inter',sans-serif" }}>Consultoria que executa.</span>
        </div>

        <div style={{ display: 'flex', gap: 28 }}>
          {['Privacidade', 'Termos', 'Instagram', 'WhatsApp'].map((l) => (
            <a key={l} style={{
              fontSize: 13, color: 'rgba(245,245,245,0.40)', cursor: 'pointer',
              textDecoration: 'none', transition: 'color 0.2s', fontFamily: "'Inter',sans-serif",
            }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'rgba(245,245,245,0.85)')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(245,245,245,0.40)')}
            >{l}</a>
          ))}
        </div>

        <span style={{ fontSize: 12, color: 'rgba(245,245,245,0.24)', fontFamily: "'Inter',sans-serif" }}>
          © 2026 Checkmate Partners. Todos os direitos reservados.
        </span>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════════════ */
export default function App() {
  useReveal()
  return (
    <>
      <style>{globalCSS}</style>
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <OProblema />
        <ComoEntramos />
        <OQueConstruimos />
        <Resultados />
        <Diferencial />
        <CTAFinal />
      </main>
      <Footer />
    </>
  )
}
