// ============================================================
//  React Components for Portfolio 2026 — Yudha Pradana
//  Rendered via Babel Standalone (no build step needed)
// ============================================================

// ── 1. TYPED TEXT HERO (cycles through roles) ───────────────
const TypedHero = () => {
  const roles = [
    "SOFTWARE ENGINEER",
    "BACKEND DEVELOPER",
    "UI/UX DESIGNER",
    
  ];
  const [index, setIndex] = React.useState(0);
  const [displayed, setDisplayed] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);
  const [charIdx, setCharIdx] = React.useState(0);

  React.useEffect(() => {
    const current = roles[index];
    let timeout;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, 90);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }, 45);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, index]);

  return (
    <div className="react-typed-wrap">
      <span className="square-dot"></span>
      <span className="typed-text">{displayed}</span>
      <span className="typed-cursor">|</span>
    </div>
  );
};

// ── 2. LANGUAGE SKILL BARS (animated progress) ───────────────
const LangBar = ({ lang, pct, color, delay }) => {
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setWidth(pct), 300 + delay);
    return () => clearTimeout(timer);
  }, [pct, delay]);

  return (
    <div className="react-lang-item">
      <div className="react-lang-header">
        <span className="react-lang-name">{lang}</span>
        <span className="react-lang-pct" style={{ color }}>{pct}%</span>
      </div>
      <div className="react-lang-track">
        <div
          className="react-lang-fill"
          style={{
            width: `${width}%`,
            background: color,
            transition: "width 1.1s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
    </div>
  );
};

const LangBars = () => {
  const langs = [
    { lang: "INDONESIA", pct: 90, color: "#38bdf8", delay: 0 },
    { lang: "JAWA", pct: 80, color: "#a78bfa", delay: 150 },
    { lang: "ENGLISH", pct: 25, color: "#4ade80", delay: 300 },
  ];

  return (
    <div className="react-lang-bars">
      {langs.map((l) => (
        <LangBar key={l.lang} {...l} />
      ))}
    </div>
  );
};

// ── 3. ANIMATED STATS BAR (project section footer) ───────────
const Counter = ({ target, suffix = "", duration = 1800, delay = 0 }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const started = React.useRef(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now() + delay;
          const step = (now) => {
            const elapsed = Math.max(0, now - start);
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          setTimeout(() => requestAnimationFrame(step), delay);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, delay]);

  return (
    <span ref={ref} className="stat-number">
      {count}{suffix}
    </span>
  );
};

const StatsBar = () => {
  const stats = [
    { label: "PROJECTS", target: 8, suffix: "+" },
    { label: "YEARS EXP", target: 2, suffix: "+" },
    { label: "SOFTWARE", target: 3, suffix: "" },
  ];

  return (
    <div className="react-stats-bar">
      {stats.map((s, i) => (
        <div key={s.label} className="stat-item">
          <Counter target={s.target} suffix={s.suffix} delay={i * 120} />
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
};

// ── Mount all React components ────────────────────────────────
const mountIfExists = (id, component) => {
  const el = document.getElementById(id);
  if (el) {
    const root = ReactDOM.createRoot(el);
    root.render(component);
  }
};

mountIfExists("react-typed-root", React.createElement(TypedHero));
mountIfExists("react-lang-bars", React.createElement(LangBars));
mountIfExists("react-stats-bar", React.createElement(StatsBar));
