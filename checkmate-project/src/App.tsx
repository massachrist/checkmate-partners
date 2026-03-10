import { useState, useEffect } from 'react'

/* ─── GLOBAL STYLES ─────────────────────────────────────────────── */
const globalCSS = `
  @import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .marquee-track { animation: marquee 32s linear infinite; }
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
                border-color 0.38s ease,
                box-shadow 0.38s ease;
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

  .gradient-text {
    background: linear-gradient(144.5deg, #f5f5f5 28%, rgba(245,245,245,0.12) 115%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .chess-pattern {
    background-image:
      linear-gradient(rgba(245,245,245,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(245,245,245,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    -webkit-mask-image: radial-gradient(ellipse 85% 65% at 50% 50%, black 35%, transparent 100%);
    mask-image: radial-gradient(ellipse 85% 65% at 50% 50%, black 35%, transparent 100%);
  }

  .nav-link {
    color: rgba(245,245,245,0.75); font-size: 14px; font-weight: 500;
    text-decoration: none; font-family: 'Inter', sans-serif;
    transition: color 0.2s ease; cursor: pointer;
  }
  .nav-link:hover { color: #f5f5f5; }

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
    .nav-links       { display: none !important; }
    .hero-heading    { font-size: 34px !important; }
    .hero-ctas       { flex-direction: column !important; align-items: center !important; }
    .bento-grid      { grid-template-columns: 1fr !important; }
    .bento-span2     { grid-column: span 1 !important; }
    .metrics-grid    { flex-direction: column !important; gap: 32px !important; }
    .metrics-divider { display: none !important; }
    .footer-inner    { flex-direction: column !important; gap: 24px !important; align-items: center !important; text-align: center !important; }
    .hero-pad        { padding-top: 200px !important; }
    .testi-grid      { grid-template-columns: 1fr !important; }
    .nav-pad         { padding-left: 24px !important; padding-right: 24px !important; }
    .section-pad     { padding-left: 24px !important; padding-right: 24px !important; }
  }
`

/* ─── BISHOP ICON ───────────────────────────────────────────────── */
const BishopIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    style={{ opacity: 0.16, flexShrink: 0 }}
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 3C10.9 3 10 3.9 10 5C10 5.7 10.4 6.3 11 6.7L8.5 12H7C6.4 12 6 12.4 6 13V14H7.5L6 19H5V21H19V21H18L16.5 14H18V13C18 12.4 17.6 12 17 12H15.5L13 6.7C13.6 6.3 14 5.7 14 5C14 3.9 13.1 3 12 3Z"
      fill="rgba(245,245,245,1)"
    />
  </svg>
)

/* ─── SCROLL REVEAL ─────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.10, rootMargin: '0px 0px -32px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/* ═══════════════════════════════════════════════════════════════════
   NAVBAR
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
      padding: '20px 120px',
      transition: 'background 0.45s ease, backdrop-filter 0.45s ease, border-color 0.45s ease',
      background: scrolled ? 'rgba(44,44,44,0.82)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px) saturate(1.5)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.5)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(245,245,245,0.07)' : '1px solid transparent',
    }}>
      <span style={{
        fontFamily: "'General Sans', sans-serif", fontWeight: 600,
        fontSize: 15, letterSpacing: '0.18em', color: '#f5f5f5', width: 187, userSelect: 'none',
      }}>CHECKMATE</span>

      <div className="nav-links" style={{ display: 'flex', gap: 32 }}>
        {['Diagnóstico', 'Como Funciona', 'Resultados', 'Para Você'].map((l) => (
          <a key={l} className="nav-link">{l}</a>
        ))}
      </div>

      <button className="btn-glass" style={{ fontSize: 13, padding: '10px 20px' }}>
        Agendar Diagnóstico Gratuito
      </button>
    </nav>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <video autoPlay muted loop playsInline style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
      }} src="https://assets.mixkit.co/videos/preview/49726/49726-small.mp4" />

      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.50)' }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 300,
        background: 'linear-gradient(to top, #2c2c2c 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      <div className="hero-pad" style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', paddingTop: 280, paddingLeft: 24, paddingRight: 24,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(245,245,245,0.10)', border: '1px solid rgba(245,245,245,0.22)',
          borderRadius: 20, padding: '7px 16px', marginBottom: 36,
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#f5f5f5', flexShrink: 0,
            boxShadow: '0 0 8px rgba(245,245,245,0.65)',
          }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: '#f5f5f5' }}>Diagnóstico gratuito disponível</span>
        </div>

        <h1 className="hero-heading gradient-text" style={{
          fontFamily: "'General Sans', sans-serif", fontWeight: 500,
          fontSize: 56, lineHeight: 1.28, letterSpacing: '-0.022em',
          maxWidth: 680, marginBottom: 24,
        }}>
          Seu negócio não está quebrado. Só está em xeque.
        </h1>

        <p style={{
          fontSize: 15, fontWeight: 400, color: 'rgba(245,245,245,0.70)',
          maxWidth: 560, lineHeight: 1.75, marginBottom: 44,
        }}>
          Nós fazemos o diagnóstico estratégico completo e executamos o plano ao seu lado.
          Transformamos estagnação em crescimento previsível com ROI real — sem queimar mais dinheiro.
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
   TICKER
═══════════════════════════════════════════════════════════════════ */
function Ticker() {
  const items = [
    { text: 'ROI 5×',                          w: 600, o: 1.0  },
    { text: '+340% faturamento',                w: 500, o: 0.70 },
    { text: 'Atendimento destravado',           w: 400, o: 0.50 },
    { text: 'Lucro previsível',                 w: 600, o: 0.85 },
    { text: '60% menos tempo operacional',      w: 500, o: 0.65 },
    { text: 'Clientes recorrentes',             w: 400, o: 0.55 },
    { text: 'Operação autônoma',                w: 600, o: 0.80 },
    { text: 'Estratégia que funciona',          w: 500, o: 0.70 },
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
            color: `rgba(245,245,245,${item.o})`, marginRight: 52, letterSpacing: '0.01em',
          }}>
            {item.text}
            <span style={{ marginLeft: 52, opacity: 0.22, fontWeight: 300 }}>•</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   FEATURES (BENTO)
═══════════════════════════════════════════════════════════════════ */
interface BentoCardProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

function BentoCard({ children, style = {} }: BentoCardProps) {
  return (
    <div className="glass-card" style={{ padding: 32, height: '100%', ...style }}>
      {children}
    </div>
  )
}

function Features() {
  return (
    <section className="chess-pattern section-pad" style={{ padding: '120px 80px', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 900, height: 900,
        background: 'rgba(245,245,245,0.018)',
        borderRadius: '50%', filter: 'blur(140px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{
            fontFamily: "'General Sans', sans-serif", fontWeight: 500,
            fontSize: 40, lineHeight: 1.25, letterSpacing: '-0.02em',
            maxWidth: 620, margin: '0 auto 16px',
          }}>
            Nós destravamos exatamente o que está travando seu crescimento
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(245,245,245,0.56)', maxWidth: 460, margin: '0 auto' }}>
            Diagnóstico real, execução real. Do problema à solução em semanas.
          </p>
        </div>

        <div className="bento-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          gridTemplateRows: 'auto auto', gap: 16,
        }}>
          {/* Card 1 — large */}
          <div className="bento-span2 reveal reveal-delay-1" style={{ gridColumn: 'span 2' }}>
            <BentoCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em',
                  color: 'rgba(245,245,245,0.30)', textTransform: 'uppercase', marginBottom: 20 }}>
                  01 — Marketing
                </div>
                <BishopIcon />
              </div>
              <h3 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 500,
                fontSize: 24, lineHeight: 1.3, marginBottom: 14, letterSpacing: '-0.01em' }}>
                Marketing que gera lucro de verdade
              </h3>
              <p style={{ fontSize: 15, color: 'rgba(245,245,245,0.60)', lineHeight: 1.7 }}>
                Nós paramos o sangramento de budget e construímos funis com ROI previsível.
                Cada real investido com intenção e rastreabilidade real.
              </p>
              <div style={{ marginTop: 32, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['ROI previsível', 'Funil otimizado', 'Zero desperdício'].map((tag) => (
                  <span key={tag} style={{
                    fontSize: 12, fontWeight: 500,
                    background: 'rgba(245,245,245,0.05)', border: '1px solid rgba(245,245,245,0.09)',
                    borderRadius: 9999, padding: '4px 12px', color: 'rgba(245,245,245,0.58)',
                  }}>{tag}</span>
                ))}
              </div>
            </BentoCard>
          </div>

          {/* Card 2 */}
          <div className="reveal reveal-delay-2" style={{ display: 'flex' }}>
            <BentoCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em',
                  color: 'rgba(245,245,245,0.30)', textTransform: 'uppercase', marginBottom: 20 }}>
                  02 — Atendimento
                </div>
                <BishopIcon />
              </div>
              <h3 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 500,
                fontSize: 20, lineHeight: 1.35, marginBottom: 12, letterSpacing: '-0.01em' }}>
                Atendimento que não trava mais
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(245,245,245,0.60)', lineHeight: 1.7 }}>
                Automação com IA que libera sua equipe para o que importa de verdade.
              </p>
            </BentoCard>
          </div>

          {/* Card 3 */}
          <div className="reveal reveal-delay-3" style={{ display: 'flex' }}>
            <BentoCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em',
                  color: 'rgba(245,245,245,0.30)', textTransform: 'uppercase', marginBottom: 20 }}>
                  03 — Processos
                </div>
                <BishopIcon />
              </div>
              <h3 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 500,
                fontSize: 20, lineHeight: 1.35, marginBottom: 12, letterSpacing: '-0.01em' }}>
                Processos que funcionam sozinhos
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(245,245,245,0.60)', lineHeight: 1.7 }}>
                Sistema completo de growth operando no piloto automático.
              </p>
            </BentoCard>
          </div>

          {/* Card 4 — large */}
          <div className="bento-span2 reveal reveal-delay-4" style={{ gridColumn: 'span 2' }}>
            <BentoCard style={{
              background: 'linear-gradient(135deg, rgba(245,245,245,0.045) 0%, rgba(245,245,245,0.01) 100%)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em',
                  color: 'rgba(245,245,245,0.30)', textTransform: 'uppercase', marginBottom: 20 }}>
                  04 — Estratégia + Execução
                </div>
                <BishopIcon />
              </div>
              <h3 style={{ fontFamily: "'General Sans',sans-serif", fontWeight: 500,
                fontSize: 24, lineHeight: 1.3, marginBottom: 14, letterSpacing: '-0.01em' }}>
                Estratégia + execução real
              </h3>
              <p style={{ fontSize: 15, color: 'rgba(245,245,245,0.60)', lineHeight: 1.7, maxWidth: 540 }}>
                Nós não só apontamos o caminho — nós caminhamos com você. Da análise ao plano à execução
                semanal, somos parceiros na jornada, não apenas consultores de slide.
              </p>
            </BentoCard>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   METRICS
═══════════════════════════════════════════════════════════════════ */
function Metrics() {
  const metrics = [
    { number: '4.8×', label: 'ROI médio por cliente' },
    { number: '60%',  label: 'Redução no tempo operacional' },
    { number: '∞',    label: 'Crescimento previsível mês a mês' },
  ]
  return (
    <div style={{
      backdropFilter: 'blur(24px) saturate(1.3)',
      WebkitBackdropFilter: 'blur(24px) saturate(1.3)',
      borderTop: '1px solid rgba(245,245,245,0.05)',
      borderBottom: '1px solid rgba(245,245,245,0.05)',
      padding: '64px 80px',
      background: 'rgba(245,245,245,0.01)',
    }}>
      <div className="metrics-grid" style={{
        display: 'flex', justifyContent: 'center', gap: 0, maxWidth: 1000, margin: '0 auto',
      }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', position: 'relative' }}>
            {i > 0 && (
              <div className="metrics-divider" style={{
                position: 'absolute', left: 0, top: '8%', bottom: '8%',
                width: 1, background: 'rgba(245,245,245,0.08)',
              }} />
            )}
            <div className="reveal gradient-text" style={{
              fontFamily: "'General Sans', sans-serif", fontWeight: 500,
              fontSize: 56, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 14,
            }}>{m.number}</div>
            <div style={{ fontSize: 14, color: 'rgba(245,245,245,0.50)', textAlign: 'center', lineHeight: 1.5 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   DIAGNOSTIC WINDOW
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
          Diagnóstico Inicial — Roberto S.A.
        </span>
      </div>

      {/* Body */}
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

/* ═══════════════════════════════════════════════════════════════════
   APPROACH
═══════════════════════════════════════════════════════════════════ */
function Approach() {
  return (
    <section className="chess-pattern section-pad" style={{ padding: '120px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'rgba(245,245,245,0.06)', border: '1px solid rgba(245,245,245,0.13)',
            borderRadius: 9999, padding: '5px 16px', marginBottom: 24,
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: 'rgba(245,245,245,0.62)' }}>
              Método Checkmate
            </span>
          </div>
          <h2 style={{
            fontFamily: "'General Sans',sans-serif", fontWeight: 500,
            fontSize: 40, lineHeight: 1.25, letterSpacing: '-0.02em',
            maxWidth: 600, margin: '0 auto 16px',
          }}>
            Do diagnóstico à execução em semanas, não meses.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(245,245,245,0.56)', maxWidth: 440,
            margin: '0 auto 22px', lineHeight: 1.7 }}>
            Nós não vendemos pacote. Nós viramos seu parceiro de crescimento.
          </p>
          <a style={{ fontSize: 14, color: 'rgba(245,245,245,0.68)', cursor: 'pointer',
            fontWeight: 500, textDecoration: 'none',
            borderBottom: '1px solid rgba(245,245,245,0.16)', paddingBottom: 2 }}>
            Ver como funciona →
          </a>
        </div>
        <div className="reveal reveal-delay-2">
          <DiagnosticWindow />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   TESTIMONIALS + BOTTOM CTA
═══════════════════════════════════════════════════════════════════ */
function Testimonials() {
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
    <section className="section-pad" style={{ padding: '120px 80px', maxWidth: 1280, margin: '0 auto' }}>
      <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
        <h2 style={{
          fontFamily: "'General Sans',sans-serif", fontWeight: 500,
          fontSize: 36, letterSpacing: '-0.02em', lineHeight: 1.3,
        }}>O que nossos parceiros dizem</h2>
      </div>

      <div className="testi-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginBottom: 120,
      }}>
        {testimonials.map((t, i) => (
          <div key={i} className={`glass-card reveal reveal-delay-${i + 1}`} style={{ padding: 36 }}>
            <div style={{
              fontFamily: "'General Sans',sans-serif", fontSize: 52, lineHeight: 1,
              color: 'rgba(245,245,245,0.07)', marginBottom: 6, fontWeight: 700, userSelect: 'none',
            }}>"</div>
            <p style={{
              fontSize: 15, lineHeight: 1.82, color: 'rgba(245,245,245,0.76)',
              marginBottom: 32, fontWeight: 300,
            }}>
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

      {/* Bottom CTA */}
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 900, height: 550,
          background: 'rgba(245,245,245,0.035)',
          borderRadius: '50%', filter: 'blur(110px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 500, height: 300,
          background: 'rgba(245,245,245,0.028)',
          borderRadius: '50%', filter: 'blur(55px)', pointerEvents: 'none',
        }} />
        <div className="reveal" style={{ position: 'relative' }}>
          <h2 style={{
            fontFamily: "'General Sans',sans-serif", fontWeight: 500,
            fontSize: 52, lineHeight: 1.2, letterSpacing: '-0.025em',
            maxWidth: 700, margin: '0 auto 20px',
          }}>
            Pronto para dar o xeque-mate na estagnação?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(245,245,245,0.56)', maxWidth: 440,
            margin: '0 auto 44px', lineHeight: 1.7 }}>
            Agende seu diagnóstico gratuito e descubra exatamente o que está travando seu lucro.
          </p>
          <button className="btn-primary" style={{ fontSize: 16, padding: '20px 52px' }}>
            Agendar Diagnóstico Gratuito
          </button>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="chess-pattern section-pad" style={{
      borderTop: '1px solid rgba(245,245,245,0.10)',
      padding: '32px 80px',
    }}>
      <div className="footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontFamily: "'General Sans',sans-serif", fontWeight: 600,
          fontSize: 13, letterSpacing: '0.18em', color: 'rgba(245,245,245,0.80)',
        }}>CHECKMATE</span>

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
        <Features />
        <Metrics />
        <Approach />
        <Testimonials />
      </main>
      <Footer />
    </>
  )
}
