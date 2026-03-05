import { useState, useCallback, createContext, useContext, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════
   VIAVIACREDITS — Dutch SME Fintech Platform
   Color: Orange / Green / White — Bridgefund-inspired minimal style
   ═══════════════════════════════════════════════════════════════════════ */

// ─── Design System ────────────────────────────────────────────────────
const C = {
  orange: "#FF6B2C",
  orangeDark: "#E5551A",
  orangeLight: "#FFF4EE",
  orangeGlow: "rgba(255,107,44,0.15)",
  green: "#1DB954",
  greenDark: "#17A348",
  greenLight: "#EDFBF2",
  greenGlow: "rgba(29,185,84,0.12)",
  white: "#FFFFFF",
  bg: "#FAFAF8",
  bgWarm: "#FDF9F6",
  text: "#1A1A1A",
  textSec: "#5C5C5C",
  textTer: "#9A9A9A",
  border: "#EBEBEB",
  borderLight: "#F5F5F3",
};
const R = { sm: 10, md: 14, lg: 20, xl: 24, full: 999 };
const SH = {
  sm: "0 1px 3px rgba(0,0,0,0.04)",
  md: "0 4px 20px rgba(0,0,0,0.06)",
  lg: "0 8px 40px rgba(0,0,0,0.08)",
  glow: "0 4px 24px rgba(255,107,44,0.18)",
};
const F = "'Plus Jakarta Sans', sans-serif";

// ─── Router ───────────────────────────────────────────────────────────
const Ctx = createContext({ page: "home", go: () => {}, formData: {}, setFormData: () => {} });
function useNav() { return useContext(Ctx); }

// ─── Animations ───────────────────────────────────────────────────────
const fadeUp = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-50px" }, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } };
const stagger = { initial: "h", whileInView: "s", viewport: { once: true, margin: "-40px" }, variants: { h: {}, s: { transition: { staggerChildren: 0.07 } } } };
const stChild = { variants: { h: { opacity: 0, y: 22 }, s: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } } };

// ─── CountUp ──────────────────────────────────────────────────────────
function CountUp({ target, suffix = "", prefix = "" }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let s = 0; const step = target / 120;
    const id = setInterval(() => { s += step; if (s >= target) { setV(target); clearInterval(id); } else setV(Math.floor(s)); }, 1000 / 60);
    return () => clearInterval(id);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{v.toLocaleString("nl-NL")}{suffix}</span>;
}

// ─── UI Primitives ────────────────────────────────────────────────────
function Btn({ children, onClick, variant = "primary", size = "md", full, style = {}, disabled }) {
  const styles = {
    primary: { background: C.orange, color: "#fff", boxShadow: SH.glow },
    green: { background: C.green, color: "#fff", boxShadow: `0 4px 20px ${C.greenGlow}` },
    outline: { background: "transparent", color: C.orange, border: `2px solid ${C.orange}` },
    ghost: { background: "transparent", color: C.textSec },
    white: { background: "#fff", color: C.text, boxShadow: SH.sm, border: `1px solid ${C.border}` },
  };
  return (
    <motion.button whileHover={!disabled ? { scale: 1.015, y: -1 } : {}} whileTap={!disabled ? { scale: 0.985 } : {}} onClick={onClick} disabled={disabled}
      style={{ fontFamily: F, fontWeight: 700, fontSize: size === "lg" ? 17 : 15, border: "none", cursor: disabled ? "not-allowed" : "pointer", borderRadius: R.lg, padding: size === "lg" ? "18px 40px" : "14px 28px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s", width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1, letterSpacing: "-0.01em", ...styles[variant], ...style }}>
      {children}
    </motion.button>
  );
}

function Input({ label, placeholder, type = "text", value, onChange, required, style = {} }) {
  return (
    <div style={{ marginBottom: 18, ...style }}>
      {label && <label style={{ display: "block", fontFamily: F, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>{label}{required && <span style={{ color: C.orange }}> *</span>}</label>}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{ width: "100%", padding: "14px 18px", borderRadius: R.md, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: F, color: C.text, background: C.white, outline: "none", transition: "all 0.2s", boxSizing: "border-box" }}
        onFocus={e => { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orangeGlow}`; }}
        onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

function Select({ label, options, value, onChange, required }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {label && <label style={{ display: "block", fontFamily: F, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>{label}{required && <span style={{ color: C.orange }}> *</span>}</label>}
      <select value={value} onChange={onChange}
        style={{ width: "100%", padding: "14px 18px", borderRadius: R.md, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: F, color: C.text, background: C.white, outline: "none", appearance: "none", cursor: "pointer", boxSizing: "border-box" }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Card({ children, style = {}, hover = true }) {
  return (
    <motion.div whileHover={hover ? { y: -3, boxShadow: SH.lg } : {}} transition={{ duration: 0.2 }}
      style={{ background: C.white, borderRadius: R.xl, border: `1px solid ${C.border}`, padding: 28, boxShadow: SH.md, ...style }}>
      {children}
    </motion.div>
  );
}

function Container({ children, style = {} }) { return <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px", ...style }}>{children}</div>; }
function Section({ children, bg = "transparent", style = {} }) { return <section style={{ padding: "80px 0", background: bg, position: "relative", overflow: "hidden", ...style }}>{children}</section>; }

// ─── Navbar ───────────────────────────────────────────────────────────
function Navbar() {
  const { page, go } = useNav();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const links = [{ id: "home", label: "Home" }, { id: "producten", label: "Producten" }, { id: "hoe-het-werkt", label: "Hoe het werkt" }, { id: "over-ons", label: "Over ons" }, { id: "faq", label: "FAQ" }, { id: "contact", label: "Contact" }];
  return (
    <motion.header initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: scrolled ? "10px 0" : "16px 0", background: scrolled ? `${C.white}F2` : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}60` : "none", transition: "all 0.3s" }}>
      <Container style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <motion.div whileHover={{ scale: 1.02 }} onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SH.glow }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 16, fontFamily: F }}>VV</span>
          </div>
          <span style={{ fontFamily: F, fontWeight: 800, fontSize: 19, color: C.text, letterSpacing: "-0.03em" }}>ViaVia<span style={{ color: C.orange }}>Credits</span></span>
        </motion.div>
        <nav style={{ display: "flex", gap: 2 }}>
          {links.map(l => (
            <motion.button key={l.id} whileHover={{ color: C.orange }} onClick={() => go(l.id)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: 14, fontWeight: page === l.id ? 700 : 500, color: page === l.id ? C.orange : C.textSec, padding: "8px 12px", borderRadius: R.sm, transition: "all 0.2s" }}>
              {l.label}
            </motion.button>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="ghost" onClick={() => go("voorwaarden")} style={{ fontSize: 13 }}>Voorwaarden</Btn>
          <Btn onClick={() => go("aanvragen")}>Krediet aanvragen</Btn>
        </div>
      </Container>
    </motion.header>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────
function Footer() {
  const { go } = useNav();
  return (
    <footer style={{ background: "#1A1A1A", padding: "64px 0 0" }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40, paddingBottom: 48, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: 12, fontFamily: F }}>VV</span>
              </div>
              <span style={{ fontFamily: F, fontWeight: 800, fontSize: 17, color: "#fff" }}>ViaVia<span style={{ color: C.orange }}>Credits</span></span>
            </div>
            <p style={{ fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, maxWidth: 280 }}>ViaViaCredits verbindt Nederlandse ondernemers met Qredits financiering. Snel, transparant en volledig digitaal.</p>
          </div>
          {[
            { title: "Platform", items: [{ l: "Producten", id: "producten" }, { l: "Hoe het werkt", id: "hoe-het-werkt" }, { l: "Krediet aanvragen", id: "aanvragen" }, { l: "FAQ", id: "faq" }] },
            { title: "Bedrijf", items: [{ l: "Over ons", id: "over-ons" }, { l: "Contact", id: "contact" }, { l: "Partners", id: "home" }, { l: "Vacatures", id: "home" }] },
            { title: "Juridisch", items: [{ l: "Gebruikersovereenkomst", id: "voorwaarden" }, { l: "Privacyverklaring", id: "voorwaarden" }, { l: "Cookiebeleid", id: "voorwaarden" }, { l: "Algemene Voorwaarden", id: "voorwaarden" }] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 16 }}>{col.title}</div>
              {col.items.map((it, j) => (
                <div key={j} onClick={() => go(it.id)} style={{ fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = C.orange} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>{it.l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 0", fontFamily: F, fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
          <span>© 2026 ViaViaCredits B.V. · KvK 91204837 · Erkend Qredits Intermediair</span>
          <div style={{ display: "flex", gap: 20 }}>{["🔒 256-bit SSL", "🏛 Qredits Partner", "🇪🇺 GDPR", "🏦 PSD2"].map(b => <span key={b}>{b}</span>)}</div>
        </div>
      </Container>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════════════════════════════
function HomePage() {
  const { go } = useNav();
  const [amount, setAmount] = useState(75000);
  const [term, setTerm] = useState(60);
  const min = 5000, max = 500000, tMin = 12, tMax = 120;
  const pct = ((amount - min) / (max - min)) * 100;
  const tPct = ((term - tMin) / (tMax - tMin)) * 100;
  const monthly = Math.round(amount / term * 1.05);
  const fmt = v => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(v);
  const loanType = amount <= 50000 ? "Microkrediet" : amount <= 250000 ? "MKB Krediet" : "MKB Krediet+";

  return (
    <>
      {/* ── HERO ── */}
      <Section style={{ paddingTop: 130, paddingBottom: 60, background: `linear-gradient(160deg, ${C.white} 0%, ${C.orangeLight}40 50%, ${C.greenLight}20 100%)` }}>
        <div style={{ position: "absolute", top: -120, right: -150, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.orange}08 0%, transparent 70%)`, pointerEvents: "none" }} />
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: 56, alignItems: "center" }}>
            {/* LEFT — Banner */}
            <motion.div initial={{ opacity: 0, x: -36 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.greenLight, color: C.green, borderRadius: R.full, padding: "6px 14px", fontSize: 12, fontWeight: 700, fontFamily: F, marginBottom: 20, letterSpacing: "0.02em" }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: C.green }} /> Officieel Qredits Intermediair
              </div>
              <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: "clamp(34px, 4.5vw, 52px)", color: C.text, letterSpacing: "-0.04em", lineHeight: 1.08, margin: "0 0 18px" }}>
                Zakelijke krediet<br />
                <span style={{ color: C.orange }}>snel & simpel</span> geregeld
              </h1>
              <p style={{ fontFamily: F, fontSize: 17, color: C.textSec, lineHeight: 1.65, margin: "0 0 28px", maxWidth: 440 }}>
                ViaViaCredits verbindt jou als ondernemer met Qredits. Van microkrediet tot MKB-financiering. Geen bank, geen gedoe — binnen 5 minuten aangevraagd.
              </p>
              {/* Trust items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {["Krediet van €5.000 tot €500.000", "Looptijd 12 tot 120 maanden", "Geen bankafschriften uploaden", "Beslissing binnen 2 werkdagen"].map(t => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.green, fontSize: 12, fontWeight: 700 }}>✓</div>
                    <span style={{ fontFamily: F, fontSize: 14, color: C.textSec, fontWeight: 500 }}>{t}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn size="lg" onClick={() => go("aanvragen")}>Krediet aanvragen →</Btn>
                <Btn variant="outline" size="lg" onClick={() => go("hoe-het-werkt")}>Hoe het werkt</Btn>
              </div>
              <p style={{ fontFamily: F, fontSize: 12, color: C.textTer, marginTop: 12 }}>Geheel vrijblijvend en kosteloos</p>
            </motion.div>

            {/* RIGHT — Calculator */}
            <motion.div initial={{ opacity: 0, x: 36, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}>
              <Card style={{ padding: "32px 28px", boxShadow: SH.lg, border: `1px solid ${C.border}` }} hover={false}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: C.text }}>Bereken je krediet</div>
                    <div style={{ fontFamily: F, fontSize: 13, color: C.textTer }}>Snel inzicht in je mogelijkheden</div>
                  </div>
                  <div style={{ background: C.orangeLight, borderRadius: R.md, padding: "8px 14px", fontFamily: F, fontWeight: 700, fontSize: 12, color: C.orange }}>{loanType}</div>
                </div>

                {/* Amount */}
                <div style={{ fontFamily: F, fontWeight: 600, fontSize: 13, color: C.textSec, marginBottom: 6 }}>Kredietbedrag</div>
                <div style={{ fontFamily: F, fontWeight: 900, fontSize: 38, color: C.text, letterSpacing: "-0.04em", marginBottom: 14, textAlign: "center" }}>{fmt(amount)}</div>
                <div style={{ position: "relative", height: 36, marginBottom: 6 }}>
                  <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 6, background: C.borderLight, borderRadius: 99, transform: "translateY(-50%)" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.orange}, ${C.orangeDark})`, borderRadius: 99, transition: "width 0.08s" }} />
                  </div>
                  <input type="range" min={min} max={max} step={5000} value={amount} onChange={e => setAmount(+e.target.value)}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", margin: 0 }} />
                  <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%, -50%)", width: 22, height: 22, borderRadius: 99, background: "#fff", border: `3px solid ${C.orange}`, boxShadow: SH.glow, pointerEvents: "none", transition: "left 0.08s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: 11, color: C.textTer, marginBottom: 22 }}><span>€5.000</span><span>€500.000</span></div>

                {/* Term */}
                <div style={{ fontFamily: F, fontWeight: 600, fontSize: 13, color: C.textSec, marginBottom: 6 }}>Looptijd</div>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 24, color: C.text, letterSpacing: "-0.02em", marginBottom: 14, textAlign: "center" }}>
                  {term} maanden <span style={{ fontSize: 14, fontWeight: 500, color: C.textTer }}>({(term / 12).toFixed(term % 12 === 0 ? 0 : 1)} jaar)</span>
                </div>
                <div style={{ position: "relative", height: 36, marginBottom: 6 }}>
                  <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 6, background: C.borderLight, borderRadius: 99, transform: "translateY(-50%)" }}>
                    <div style={{ width: `${tPct}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, ${C.greenDark})`, borderRadius: 99, transition: "width 0.08s" }} />
                  </div>
                  <input type="range" min={tMin} max={tMax} step={6} value={term} onChange={e => setTerm(+e.target.value)}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", margin: 0 }} />
                  <div style={{ position: "absolute", top: "50%", left: `${tPct}%`, transform: "translate(-50%, -50%)", width: 22, height: 22, borderRadius: 99, background: "#fff", border: `3px solid ${C.green}`, boxShadow: `0 2px 12px ${C.greenGlow}`, pointerEvents: "none", transition: "left 0.08s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: 11, color: C.textTer, marginBottom: 22 }}><span>12 mnd</span><span>120 mnd</span></div>

                {/* Result */}
                <div style={{ background: `linear-gradient(135deg, ${C.orangeLight}, ${C.greenLight}60)`, borderRadius: R.lg, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.textSec }}>Geschatte maandlast</span>
                  <span style={{ fontFamily: F, fontWeight: 900, fontSize: 24, color: C.orange, letterSpacing: "-0.02em" }}>{fmt(monthly)}<span style={{ fontSize: 14, fontWeight: 500, color: C.textTer }}>/mnd</span></span>
                </div>

                <Btn full size="lg" onClick={() => go("aanvragen")}>Vraag dit krediet aan →</Btn>
                <p style={{ fontFamily: F, fontSize: 11, color: C.textTer, textAlign: "center", marginTop: 10 }}>Vrijblijvend · Geen verplichtingen · Binnen 2 werkdagen reactie</p>
              </Card>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* ── Stats ── */}
      <Section style={{ padding: "48px 0" }}>
        <Container>
          <motion.div {...stagger} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[{ v: 45, p: "€", s: "M+", l: "Verstrekt", c: C.orange }, { v: 2800, s: "+", l: "Ondernemers", c: C.green }, { v: 4.8, s: "/5", l: "Beoordeling", c: C.orange }, { v: 2, s: " dagen", l: "Gem. doorlooptijd", c: C.green }].map((s, i) => (
              <motion.div key={i} {...stChild}><Card style={{ textAlign: "center", padding: "28px 16px" }}>
                <div style={{ fontFamily: F, fontWeight: 900, fontSize: 34, color: s.c, letterSpacing: "-0.04em" }}><CountUp target={s.v} prefix={s.p || ""} suffix={s.s} /></div>
                <div style={{ fontFamily: F, fontSize: 13, color: C.textTer, marginTop: 4, fontWeight: 500 }}>{s.l}</div>
              </Card></motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* ── Products ── */}
      <Section bg={C.bg}>
        <Container>
          <motion.div {...fadeUp} style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 44px" }}>
            <div style={{ display: "inline-block", background: C.orangeLight, color: C.orange, borderRadius: R.full, padding: "6px 14px", fontSize: 12, fontWeight: 700, fontFamily: F, marginBottom: 14 }}>Producten</div>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 38px)", color: C.text, letterSpacing: "-0.03em", margin: "0 0 10px" }}>De juiste financiering voor jou</h2>
            <p style={{ fontFamily: F, fontSize: 16, color: C.textSec, lineHeight: 1.6 }}>Twee producten via Qredits, afgestemd op jouw fase als ondernemer.</p>
          </motion.div>
          <motion.div {...stagger} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              { title: "Microkrediet", range: "€5.000 – €50.000", term: "12 – 120 maanden", icon: "🚀", color: C.orange, features: ["Voor starters & ZZP'ers", "Ondernemingsplan vereist", "Persoonlijke Qredits coach", "Rente vanaf 5,75%"] },
              { title: "MKB Krediet", range: "€50.000 – €500.000", term: "12 – 120 maanden", icon: "📈", color: C.green, features: ["Voor gevestigde bedrijven", "Jaarcijfers meesturen", "Open Banking integratie", "Rente vanaf 4,50%"] },
            ].map((p, i) => (
              <motion.div key={i} {...stChild}>
                <Card style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ padding: "24px 28px 18px", background: `${p.color}06` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 32 }}>{p.icon}</span>
                      <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: p.color, background: `${p.color}10`, borderRadius: R.full, padding: "4px 12px" }}>{p.title}</span>
                    </div>
                    <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 24, color: C.text, letterSpacing: "-0.02em", margin: "0 0 4px" }}>{p.range}</h3>
                    <p style={{ fontFamily: F, fontSize: 13, color: C.textTer }}>Looptijd: {p.term}</p>
                  </div>
                  <div style={{ padding: "18px 28px 24px" }}>
                    {p.features.map(f => <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontFamily: F, fontSize: 14, color: C.textSec }}><span style={{ color: C.green, fontWeight: 700 }}>✓</span>{f}</div>)}
                    <Btn variant="outline" full onClick={() => go("aanvragen")} style={{ marginTop: 14, borderColor: p.color, color: p.color }}>Aanvragen →</Btn>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* ── How it works ── */}
      <Section>
        <Container>
          <motion.div {...fadeUp} style={{ textAlign: "center", maxWidth: 520, margin: "0 auto 44px" }}>
            <div style={{ display: "inline-block", background: C.greenLight, color: C.green, borderRadius: R.full, padding: "6px 14px", fontSize: 12, fontWeight: 700, fontFamily: F, marginBottom: 14 }}>Hoe het werkt</div>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 38px)", color: C.text, letterSpacing: "-0.03em", margin: "0 0 10px" }}>In 3 stappen geregeld</h2>
          </motion.div>
          <motion.div {...stagger} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {[
              { n: "1", title: "Bereken & kies", desc: "Gebruik de calculator om je bedrag en looptijd te kiezen. Direct inzicht in je maandlasten.", icon: "🧮", c: C.orange },
              { n: "2", title: "Vul je gegevens in", desc: "Persoons- en bedrijfsgegevens, KVK-nummer en het doel van je investering.", icon: "📋", c: C.green },
              { n: "3", title: "Ontvang je krediet", desc: "Qredits beoordeelt je aanvraag. Bij goedkeuring staat het geld snel op je rekening.", icon: "💰", c: C.orange },
            ].map((s, i) => (
              <motion.div key={i} {...stChild}>
                <Card style={{ textAlign: "center", padding: "36px 24px", position: "relative" }}>
                  <div style={{ fontFamily: F, fontWeight: 900, fontSize: 52, color: `${s.c}08`, position: "absolute", top: 8, right: 16 }}>{s.n}</div>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${s.c}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 14px" }}>{s.icon}</div>
                  <h4 style={{ fontFamily: F, fontWeight: 700, fontSize: 17, color: C.text, margin: "0 0 8px" }}>{s.title}</h4>
                  <p style={{ fontFamily: F, fontSize: 14, color: C.textSec, lineHeight: 1.55 }}>{s.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* ── CTA ── */}
      <Section bg={C.bg} style={{ padding: "60px 0" }}>
        <Container>
          <motion.div {...fadeUp}>
            <Card style={{ padding: "52px 40px", textAlign: "center", background: `linear-gradient(135deg, ${C.orangeLight}80, ${C.greenLight}40)`, border: `1px solid ${C.orange}15` }} hover={false}>
              <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 32, color: C.text, letterSpacing: "-0.03em", margin: "0 0 12px" }}>Klaar om te groeien?</h2>
              <p style={{ fontFamily: F, fontSize: 16, color: C.textSec, margin: "0 0 28px", maxWidth: 440, marginInline: "auto" }}>Vraag vrijblijvend krediet aan. Binnen 2 werkdagen weet je waar je aan toe bent.</p>
              <Btn size="lg" onClick={() => go("aanvragen")}>Start je aanvraag →</Btn>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  AANVRAGEN PAGE (Qredits Application Form)
// ═══════════════════════════════════════════════════════════════════════
function AanvragenPage() {
  const { go } = useNav();
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    bedrag: "75000", looptijd: "60", doel: "", kvk: "", bedrijfsnaam: "", rechtsvorm: "", startdatum: "", sector: "",
    voornaam: "", achternaam: "", email: "", telefoon: "", geboortedatum: "", bsn: "",
    straat: "", huisnummer: "", postcode: "", plaats: "",
    ondernemingsplan: false, jaarcijfers: false, financieelPlan: false,
  });
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));

  if (submitted) {
    return (
      <Section style={{ paddingTop: 160, minHeight: "80vh" }}>
        <Container style={{ maxWidth: 560 }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center" }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              style={{ width: 80, height: 80, borderRadius: 99, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "#fff", fontSize: 36, boxShadow: `0 8px 32px ${C.greenGlow}` }}>✓</motion.div>
            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 32, color: C.text, margin: "0 0 12px" }}>Aanvraag ingediend!</h1>
            <p style={{ fontFamily: F, fontSize: 16, color: C.textSec, lineHeight: 1.6, marginBottom: 28 }}>Je kredietaanvraag is succesvol verzonden naar Qredits. Je ontvangt binnen 2 werkdagen een eerste reactie per e-mail.</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 32 }}>
              {["Aanvraag ontvangen", "Gegevens geverifieerd", "Qredits notified"].map((t, i) => (
                <motion.span key={t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                  style={{ background: C.greenLight, color: C.green, borderRadius: R.full, padding: "6px 14px", fontSize: 12, fontWeight: 600, fontFamily: F }}>{t} ✓</motion.span>
              ))}
            </div>
            <Btn onClick={() => { setSubmitted(false); setStep(0); go("home"); }}>Terug naar home</Btn>
          </motion.div>
        </Container>
      </Section>
    );
  }

  const steps = ["Kredietgegevens", "Bedrijfsgegevens", "Persoonlijke gegevens", "Documenten & Akkoord"];

  return (
    <Section style={{ paddingTop: 130, paddingBottom: 40, background: `linear-gradient(180deg, ${C.orangeLight}40, ${C.white})` }}>
      <Container style={{ maxWidth: 680 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 30, color: C.text, letterSpacing: "-0.03em", margin: "0 0 8px" }}>Krediet aanvragen</h1>
            <p style={{ fontFamily: F, fontSize: 15, color: C.textSec }}>Vul onderstaande gegevens in. Stap {step + 1} van {steps.length}.</p>
          </div>

          {/* Progress */}
          <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ height: 4, borderRadius: 99, background: i <= step ? (i < step ? C.green : C.orange) : C.borderLight, transition: "all 0.3s", marginBottom: 6 }} />
                <span style={{ fontFamily: F, fontSize: 11, fontWeight: i === step ? 700 : 500, color: i <= step ? C.text : C.textTer }}>{s}</span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <Card hover={false} style={{ padding: 32 }}>
                {step === 0 && (
                  <>
                    <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 20 }}>Kredietgegevens</h3>
                    <Input label="Gewenst kredietbedrag (€)" placeholder="Bijv. 75000" type="number" value={form.bedrag} onChange={e => u("bedrag", e.target.value)} required />
                    <Input label="Gewenste looptijd (maanden)" placeholder="12 - 120" type="number" value={form.looptijd} onChange={e => u("looptijd", e.target.value)} required />
                    <Select label="Doel van het krediet" value={form.doel} onChange={e => u("doel", e.target.value)} required options={[
                      { value: "", label: "Selecteer een doel..." }, { value: "werkkapitaal", label: "Werkkapitaal" }, { value: "inventaris", label: "Inventaris & apparatuur" },
                      { value: "verbouwing", label: "Verbouwing" }, { value: "overname", label: "Bedrijfsovername" }, { value: "marketing", label: "Marketing & groei" },
                      { value: "voorfinanciering", label: "Voorfinanciering" }, { value: "herfinanciering", label: "Herfinanciering bestaande lening" }, { value: "overig", label: "Overig" },
                    ]} />
                  </>
                )}
                {step === 1 && (
                  <>
                    <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 20 }}>Bedrijfsgegevens</h3>
                    <Input label="KVK-nummer" placeholder="8-cijferig KVK-nummer" value={form.kvk} onChange={e => u("kvk", e.target.value)} required />
                    <Input label="Bedrijfsnaam (handelsnaam)" placeholder="Naam van je bedrijf" value={form.bedrijfsnaam} onChange={e => u("bedrijfsnaam", e.target.value)} required />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <Select label="Rechtsvorm" value={form.rechtsvorm} onChange={e => u("rechtsvorm", e.target.value)} required options={[
                        { value: "", label: "Selecteer..." }, { value: "eenmanszaak", label: "Eenmanszaak" }, { value: "vof", label: "VOF" },
                        { value: "bv", label: "B.V." }, { value: "stichting", label: "Stichting" }, { value: "cv", label: "C.V." },
                      ]} />
                      <Input label="Startdatum bedrijf" placeholder="DD-MM-JJJJ" value={form.startdatum} onChange={e => u("startdatum", e.target.value)} required />
                    </div>
                    <Select label="Sector / Branche" value={form.sector} onChange={e => u("sector", e.target.value)} required options={[
                      { value: "", label: "Selecteer je sector..." }, { value: "horeca", label: "Horeca" }, { value: "retail", label: "Retail & detailhandel" },
                      { value: "tech", label: "IT & Technologie" }, { value: "bouw", label: "Bouw & installatie" }, { value: "zorg", label: "Zorg & welzijn" },
                      { value: "dienstverlening", label: "Zakelijke dienstverlening" }, { value: "transport", label: "Transport & logistiek" }, { value: "overig", label: "Overig" },
                    ]} />
                  </>
                )}
                {step === 2 && (
                  <>
                    <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 20 }}>Persoonlijke gegevens</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <Input label="Voornaam" placeholder="Je voornaam" value={form.voornaam} onChange={e => u("voornaam", e.target.value)} required />
                      <Input label="Achternaam" placeholder="Je achternaam" value={form.achternaam} onChange={e => u("achternaam", e.target.value)} required />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <Input label="E-mailadres" placeholder="naam@bedrijf.nl" type="email" value={form.email} onChange={e => u("email", e.target.value)} required />
                      <Input label="Telefoonnummer" placeholder="+31 6 ..." type="tel" value={form.telefoon} onChange={e => u("telefoon", e.target.value)} required />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <Input label="Geboortedatum" placeholder="DD-MM-JJJJ" value={form.geboortedatum} onChange={e => u("geboortedatum", e.target.value)} required />
                      <Input label="BSN (vertrouwelijk)" placeholder="9 cijfers" value={form.bsn} onChange={e => u("bsn", e.target.value)} required />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
                      <Input label="Straat" placeholder="Straatnaam" value={form.straat} onChange={e => u("straat", e.target.value)} required />
                      <Input label="Huisnr." placeholder="Nr." value={form.huisnummer} onChange={e => u("huisnummer", e.target.value)} required />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <Input label="Postcode" placeholder="1234 AB" value={form.postcode} onChange={e => u("postcode", e.target.value)} required />
                      <Input label="Plaats" placeholder="Amsterdam" value={form.plaats} onChange={e => u("plaats", e.target.value)} required />
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 20 }}>Documenten & Akkoord</h3>
                    <p style={{ fontFamily: F, fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>Qredits vraagt de volgende documenten op (je kunt deze later aanleveren):</p>
                    {[
                      { k: "ondernemingsplan", l: "Ondernemingsplan (verplicht voor starters)" },
                      { k: "jaarcijfers", l: "Recente jaarcijfers (voor bestaande bedrijven)" },
                      { k: "financieelPlan", l: "Financieel plan met investeringsopzet" },
                    ].map(d => (
                      <label key={d.k} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: R.md, border: `1.5px solid ${form[d.k] ? C.green : C.border}`, background: form[d.k] ? C.greenLight : C.white, marginBottom: 10, cursor: "pointer", transition: "all 0.2s" }}>
                        <input type="checkbox" checked={form[d.k]} onChange={e => u(d.k, e.target.checked)} style={{ width: 18, height: 18, accentColor: C.green }} />
                        <span style={{ fontFamily: F, fontSize: 14, color: C.text, fontWeight: 500 }}>{d.l}</span>
                      </label>
                    ))}
                    <div style={{ marginTop: 20, padding: "16px 18px", borderRadius: R.md, background: C.orangeLight, border: `1.5px solid ${C.orange}30` }}>
                      <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: 18, height: 18, accentColor: C.orange, marginTop: 2 }} />
                        <span style={{ fontFamily: F, fontSize: 13, color: C.text, lineHeight: 1.5 }}>
                          Ik ga akkoord met de <span style={{ color: C.orange, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }} onClick={e => { e.preventDefault(); go("voorwaarden"); }}>Gebruikersovereenkomst</span>, het privacybeleid van ViaViaCredits en geef toestemming voor het verwerken van mijn gegevens ten behoeve van de kredietaanvraag bij Qredits. Ik begrijp dat mijn gegevens worden getoetst bij het BKR.
                        </span>
                      </label>
                    </div>
                  </>
                )}

                {/* Navigation */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
                  {step > 0 ? <Btn variant="white" onClick={() => setStep(step - 1)}>← Terug</Btn> : <div />}
                  {step < 3 ? (
                    <Btn onClick={() => setStep(step + 1)}>Volgende →</Btn>
                  ) : (
                    <Btn variant="green" onClick={() => setSubmitted(true)} disabled={!agreed}>Aanvraag indienen ✓</Btn>
                  )}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </Container>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  VOORWAARDEN PAGE (Comprehensive User Agreement)
// ═══════════════════════════════════════════════════════════════════════
function VoorwaardenPage() {
  const sections = [
    { title: "1. Definities", content: `In deze Gebruikersovereenkomst wordt verstaan onder:\n\n• "Platform": de website en applicatie van ViaViaCredits B.V., gevestigd te Amsterdam, ingeschreven bij de KvK onder nummer 91204837.\n• "Gebruiker": iedere natuurlijke of rechtspersoon die gebruik maakt van het Platform.\n• "Kredietverstrekker": Stichting Qredits Microfinanciering Nederland, gevestigd te Almelo.\n• "Kredietaanvraag": het verzoek van Gebruiker via het Platform om een krediet aan te vragen bij de Kredietverstrekker.\n• "Persoonsgegevens": alle gegevens die direct of indirect herleidbaar zijn tot een natuurlijk persoon.\n• "BKR": Bureau Krediet Registratie te Tiel.\n• "Intermediair": ViaViaCredits in haar rol als bemiddelaar tussen Gebruiker en Kredietverstrekker.` },
    { title: "2. Toepasselijkheid", content: `2.1 Deze Gebruikersovereenkomst is van toepassing op elk gebruik van het Platform en alle diensten die ViaViaCredits aanbiedt.\n\n2.2 Door gebruik te maken van het Platform accepteert Gebruiker deze voorwaarden. Indien Gebruiker niet akkoord gaat, dient het gebruik van het Platform onmiddellijk te worden gestaakt.\n\n2.3 ViaViaCredits behoudt zich het recht voor deze voorwaarden te wijzigen. Wijzigingen worden ten minste 30 dagen voor inwerkingtreding aangekondigd via het Platform.\n\n2.4 Eventuele afwijkende voorwaarden van Gebruiker worden uitdrukkelijk van de hand gewezen.` },
    { title: "3. Dienstverlening", content: `3.1 ViaViaCredits treedt op als Intermediair tussen Gebruiker en Qredits. ViaViaCredits verstrekt zelf geen kredieten.\n\n3.2 Het Platform stelt Gebruiker in staat om:\n  a) De mogelijkheden voor zakelijke financiering te verkennen;\n  b) Een indicatieve berekening te maken van kredietbedrag en maandlasten;\n  c) Een kredietaanvraag in te dienen die wordt doorgeleid naar Qredits;\n  d) De status van de aanvraag te volgen.\n\n3.3 De uiteindelijke kredietbeslissing wordt genomen door Qredits. ViaViaCredits geeft geen garantie op goedkeuring van een kredietaanvraag.\n\n3.4 Gebruik van het Platform is voor Gebruiker kosteloos. ViaViaCredits ontvangt een vergoeding van Qredits voor succesvol bemiddelde kredieten.` },
    { title: "4. Verplichtingen Gebruiker", content: `4.1 Gebruiker garandeert dat alle verstrekte informatie juist, volledig en actueel is.\n\n4.2 Gebruiker is verplicht om:\n  a) Correcte persoons- en bedrijfsgegevens te verstrekken;\n  b) Wijzigingen in gegevens onverwijld door te geven;\n  c) Het Platform niet te gebruiken voor onrechtmatige doeleinden;\n  d) Geen valse of misleidende informatie te verstrekken.\n\n4.3 Het verstrekken van onjuiste informatie kan leiden tot afwijzing van de kredietaanvraag en eventuele juridische gevolgen.\n\n4.4 Gebruiker is zelf verantwoordelijk voor het veilig houden van inloggegevens en het voorkomen van ongeautoriseerd gebruik van het account.` },
    { title: "5. Privacy & Gegevensverwerking", content: `5.1 ViaViaCredits verwerkt persoonsgegevens in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG/GDPR) en de Uitvoeringswet AVG.\n\n5.2 De volgende categorieën persoonsgegevens worden verwerkt:\n  a) Identificatiegegevens (naam, geboortedatum, BSN);\n  b) Contactgegevens (adres, e-mail, telefoonnummer);\n  c) Bedrijfsgegevens (KVK-nummer, handelsnaam, rechtsvorm, sector);\n  d) Financiële gegevens (kredietbedrag, looptijd, doel);\n  e) Documenten (ondernemingsplan, jaarcijfers, financieel plan).\n\n5.3 Gegevens worden verwerkt voor:\n  a) Het verwerken en doorleiden van de kredietaanvraag naar Qredits;\n  b) Het uitvoeren van een BKR-toetsing (door Qredits);\n  c) Communicatie over de aanvraag;\n  d) Wettelijke verplichtingen (Wwft, belastingwetgeving).\n\n5.4 Gegevens worden niet gedeeld met derden anders dan Qredits, tenzij wettelijk verplicht.\n\n5.5 Persoonsgegevens worden bewaard zolang noodzakelijk voor het doel waarvoor ze zijn verzameld, met een maximum van 7 jaar na de laatste activiteit.\n\n5.6 Gebruiker heeft recht op inzage, rectificatie, verwijdering, beperking, overdraagbaarheid en bezwaar conform de AVG.` },
    { title: "6. BKR-toetsing", content: `6.1 Door het indienen van een kredietaanvraag geeft Gebruiker toestemming aan Qredits om een toetsing uit te voeren bij het Bureau Krediet Registratie (BKR).\n\n6.2 Een negatieve BKR-registratie leidt niet automatisch tot afwijzing van de kredietaanvraag.\n\n6.3 Bij goedkeuring van het krediet wordt de lening geregistreerd bij het BKR.\n\n6.4 ViaViaCredits heeft zelf geen toegang tot BKR-gegevens.` },
    { title: "7. Intellectueel Eigendom", content: `7.1 Alle intellectuele eigendomsrechten op het Platform, waaronder maar niet beperkt tot software, teksten, afbeeldingen, ontwerpen en merken, berusten bij ViaViaCredits.\n\n7.2 Het is Gebruiker niet toegestaan om zonder voorafgaande schriftelijke toestemming van ViaViaCredits enig onderdeel van het Platform te kopiëren, wijzigen, verspreiden of openbaar te maken.` },
    { title: "8. Aansprakelijkheid", content: `8.1 ViaViaCredits is niet aansprakelijk voor:\n  a) Beslissingen van Qredits ten aanzien van kredietaanvragen;\n  b) Schade als gevolg van onjuiste of onvolledige informatie verstrekt door Gebruiker;\n  c) Technische storingen of onbeschikbaarheid van het Platform;\n  d) Schade als gevolg van ongeautoriseerd gebruik van het account van Gebruiker.\n\n8.2 De totale aansprakelijkheid van ViaViaCredits is beperkt tot het bedrag dat door haar aansprakelijkheidsverzekering wordt uitgekeerd.\n\n8.3 ViaViaCredits spant zich in om de juistheid van informatie op het Platform te waarborgen, maar geeft geen garanties.` },
    { title: "9. Beëindiging", content: `9.1 Gebruiker kan het gebruik van het Platform op elk moment beëindigen.\n\n9.2 ViaViaCredits kan de toegang van Gebruiker tot het Platform opschorten of beëindigen indien:\n  a) Gebruiker handelt in strijd met deze voorwaarden;\n  b) Gebruiker onjuiste informatie heeft verstrekt;\n  c) Er een vermoeden bestaat van fraude of misbruik.\n\n9.3 Bij beëindiging blijven de verplichtingen uit deze overeenkomst die naar hun aard bestemd zijn om voort te duren, van kracht.` },
    { title: "10. Toepasselijk Recht & Geschillen", content: `10.1 Op deze Gebruikersovereenkomst is Nederlands recht van toepassing.\n\n10.2 Geschillen worden voorgelegd aan de bevoegde rechter te Amsterdam.\n\n10.3 Alvorens een geschil aan de rechter voor te leggen, zullen partijen zich inspannen om het geschil in onderling overleg op te lossen.\n\n10.4 Voor klachten kan Gebruiker contact opnemen via klachten@viaviacredits.nl. ViaViaCredits streeft ernaar klachten binnen 10 werkdagen te behandelen.` },
    { title: "11. Contactgegevens", content: `ViaViaCredits B.V.\nHerengracht 420\n1017 BZ Amsterdam\nNederland\n\nKvK: 91204837\nBTW: NL864752319B01\n\nE-mail: info@viaviacredits.nl\nTelefoon: 085 - 401 8800\n\nFunctionaris Gegevensbescherming: privacy@viaviacredits.nl\n\nLaatst bijgewerkt: 1 maart 2026` },
  ];

  return (
    <Section style={{ paddingTop: 130 }}>
      <Container style={{ maxWidth: 780 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-block", background: C.orangeLight, color: C.orange, borderRadius: R.full, padding: "6px 14px", fontSize: 12, fontWeight: 700, fontFamily: F, marginBottom: 14 }}>Juridisch</div>
            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 34, color: C.text, letterSpacing: "-0.03em", margin: "0 0 8px" }}>Gebruikersovereenkomst</h1>
            <p style={{ fontFamily: F, fontSize: 15, color: C.textSec }}>ViaViaCredits B.V. — Versie 1.0 — Maart 2026</p>
          </div>
          <Card hover={false} style={{ padding: "36px 40px" }}>
            <p style={{ fontFamily: F, fontSize: 14, color: C.textSec, lineHeight: 1.7, marginBottom: 32, padding: "16px 20px", background: C.bg, borderRadius: R.md, borderLeft: `3px solid ${C.orange}` }}>
              Deze Gebruikersovereenkomst regelt de verhouding tussen u als gebruiker en ViaViaCredits B.V. als intermediair voor zakelijke kredietaanvragen bij Stichting Qredits Microfinanciering Nederland. Door gebruik te maken van ons platform gaat u akkoord met onderstaande voorwaarden.
            </p>
            {sections.map((s, i) => (
              <div key={i} style={{ marginBottom: 32 }}>
                <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 17, color: C.text, marginBottom: 12, letterSpacing: "-0.01em" }}>{s.title}</h3>
                <div style={{ fontFamily: F, fontSize: 14, color: C.textSec, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{s.content}</div>
              </div>
            ))}
          </Card>
        </motion.div>
      </Container>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  FAQ PAGE
// ═══════════════════════════════════════════════════════════════════════
function FAQPage() {
  const [openIdx, setOpenIdx] = useState(null);
  const items = [
    { q: "Hoeveel kan ik lenen via ViaViaCredits?", a: "Via ons platform kun je €5.000 tot €500.000 aanvragen bij Qredits, met een looptijd van 12 tot 120 maanden." },
    { q: "Heb ik een businessplan nodig?", a: "Voor het Microkrediet (starters) is een ondernemingsplan verplicht. Voor het MKB Krediet volstaan recente jaarcijfers." },
    { q: "Hoe snel is het geld beschikbaar?", a: "Qredits beoordeelt je aanvraag binnen 2 werkdagen. Na goedkeuring en een persoonlijk gesprek staat het geld meestal binnen 1-2 weken op je rekening." },
    { q: "Is het platform gratis?", a: "Ja. Het gebruik van ViaViaCredits is volledig gratis. Er zijn geen aanvraag- of advieskosten." },
    { q: "Wat als mijn aanvraag wordt afgewezen?", a: "We leggen altijd uit waarom. Onze adviseurs denken mee over alternatieven of hoe je je positie kunt verbeteren." },
    { q: "Wordt er een BKR-toetsing gedaan?", a: "Ja, Qredits voert een BKR-toetsing uit. Een negatieve registratie hoeft echter geen belemmering te zijn." },
    { q: "Welke documenten heb ik nodig?", a: "Starters: ondernemingsplan + financieel plan. Bestaande bedrijven: recente jaarcijfers. Altijd: KVK-nummer en identiteitsbewijs." },
    { q: "Kan ik vervroegd aflossen?", a: "Ja, vervroegd aflossen is mogelijk onder de voorwaarden van je Qredits-overeenkomst." },
  ];
  return (
    <Section style={{ paddingTop: 130, minHeight: "80vh" }}>
      <Container style={{ maxWidth: 700 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 34, color: C.text, letterSpacing: "-0.03em", margin: "0 0 8px" }}>Veelgestelde vragen</h1>
          <p style={{ fontFamily: F, fontSize: 15, color: C.textSec }}>Antwoorden op de meestgestelde vragen.</p>
        </motion.div>
        {items.map((item, i) => (
          <motion.div key={i} {...fadeUp} style={{ marginBottom: 8 }}>
            <div onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px", borderRadius: R.lg, cursor: "pointer", background: openIdx === i ? C.orangeLight : C.white, border: `1px solid ${openIdx === i ? C.orange + "25" : C.border}`, transition: "all 0.2s" }}>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: 15, color: C.text }}>{item.q}</span>
              <motion.span animate={{ rotate: openIdx === i ? 45 : 0 }} style={{ fontSize: 20, color: C.orange, fontWeight: 300, flexShrink: 0, marginLeft: 12 }}>+</motion.span>
            </div>
            <AnimatePresence>
              {openIdx === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
                  <div style={{ padding: "14px 22px", fontFamily: F, fontSize: 14, color: C.textSec, lineHeight: 1.65 }}>{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </Container>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  CONTACT PAGE
// ═══════════════════════════════════════════════════════════════════════
function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <Section style={{ paddingTop: 130, minHeight: "80vh" }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 40 }}>
          <motion.div {...fadeUp}>
            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 34, color: C.text, letterSpacing: "-0.03em", margin: "0 0 12px" }}>Neem contact op</h1>
            <p style={{ fontFamily: F, fontSize: 16, color: C.textSec, lineHeight: 1.6, marginBottom: 32 }}>Onze adviseurs staan voor je klaar.</p>
            <Card hover={false} style={{ marginBottom: 16 }}>
              {[{ i: "📞", l: "085 - 401 8800", s: "Ma-Do 8:30-18:00 · Vr 8:30-17:00" }, { i: "✉️", l: "info@viaviacredits.nl" }, { i: "📍", l: "Herengracht 420, 1017 BZ Amsterdam" }].map((c, j) => (
                <div key={j} style={{ display: "flex", gap: 14, marginBottom: j < 2 ? 18 : 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: C.orangeLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{c.i}</div>
                  <div><div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: C.text }}>{c.l}</div>{c.s && <div style={{ fontFamily: F, fontSize: 12, color: C.textTer }}>{c.s}</div>}</div>
                </div>
              ))}
            </Card>
          </motion.div>
          <motion.div {...fadeUp}>
            <Card hover={false} style={{ padding: 32 }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 99, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 24 }}>✓</div>
                  <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 22, color: C.text, marginBottom: 6 }}>Bedankt!</h3>
                  <p style={{ fontFamily: F, fontSize: 14, color: C.textSec }}>We nemen binnen 1 werkdag contact met je op.</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 20 }}>Stuur een bericht</h3>
                  <Input label="Naam" placeholder="Je volledige naam" />
                  <Input label="E-mail" placeholder="naam@bedrijf.nl" type="email" />
                  <Input label="Telefoonnummer" placeholder="+31 6 ..." />
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: "block", fontFamily: F, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>Bericht</label>
                    <textarea rows={4} placeholder="Waar kunnen we je mee helpen?" style={{ width: "100%", padding: "14px 18px", borderRadius: R.md, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: F, color: C.text, background: C.white, outline: "none", resize: "vertical", lineHeight: 1.5, boxSizing: "border-box" }} />
                  </div>
                  <Btn full size="lg" onClick={() => setSent(true)}>Verstuur →</Btn>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  SIMPLE PAGES (Products, How it Works, About)
// ═══════════════════════════════════════════════════════════════════════
function ProductenPage() {
  const { go } = useNav();
  return (
    <>
      <Section style={{ paddingTop: 130, background: `linear-gradient(180deg, ${C.orangeLight}40, ${C.white})` }}>
        <Container style={{ textAlign: "center", maxWidth: 600 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 38, color: C.text, letterSpacing: "-0.04em", margin: "0 0 12px" }}>Onze producten</h1>
            <p style={{ fontFamily: F, fontSize: 17, color: C.textSec, lineHeight: 1.6 }}>Twee Qredits-producten, afgestemd op jouw fase als ondernemer. Van starter tot gevestigd MKB.</p>
          </motion.div>
        </Container>
      </Section>
      <Section>
        <Container>
          {[
            { title: "Microkrediet", range: "€5.000 – €50.000", c: C.orange, icon: "🚀", desc: "Speciaal voor starters en kleine ondernemers. Met persoonlijke coaching en ondersteuning bij je ondernemingsplan.", specs: [["Bedrag", "€5K - €50K"], ["Looptijd", "12 - 120 mnd"], ["Rente", "Vanaf 5,75%"], ["Doelgroep", "Starters & ZZP"]], feats: ["Ondernemingsplan vereist", "Persoonlijke Qredits coach", "Coaching & trainingen inbegrepen", "Ook voor starters zonder track record"] },
            { title: "MKB Krediet", range: "€50.000 – €500.000", c: C.green, icon: "📈", desc: "Voor gevestigde ondernemers die willen investeren in groei. Met Open Banking voor snelle beoordeling.", specs: [["Bedrag", "€50K - €500K"], ["Looptijd", "12 - 120 mnd"], ["Rente", "Vanaf 4,50%"], ["Doelgroep", "Gevestigd MKB"]], feats: ["Jaarcijfers meesturen", "Open Banking PSD2 integratie", "Flexibel aflossingsschema", "Vervroegd aflossen mogelijk"] },
          ].map((p, i) => (
            <motion.div key={i} {...fadeUp} style={{ display: "grid", gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr", gap: 40, alignItems: "center", marginBottom: 56 }}>
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                <span style={{ display: "inline-block", background: `${p.c}10`, color: p.c, borderRadius: R.full, padding: "5px 14px", fontSize: 12, fontWeight: 700, fontFamily: F, marginBottom: 14 }}>{p.title}</span>
                <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 30, color: C.text, letterSpacing: "-0.03em", margin: "0 0 10px" }}>{p.range}</h2>
                <p style={{ fontFamily: F, fontSize: 15, color: C.textSec, lineHeight: 1.65, marginBottom: 20 }}>{p.desc}</p>
                {p.feats.map(f => <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontFamily: F, fontSize: 14, color: C.textSec }}><span style={{ color: C.green, fontWeight: 700 }}>✓</span>{f}</div>)}
                <Btn onClick={() => go("aanvragen")} style={{ marginTop: 18, background: p.c }}>Aanvragen →</Btn>
              </div>
              <Card hover={false} style={{ padding: 32, background: `${p.c}04`, order: i % 2 === 0 ? 1 : 0 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{p.icon}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {p.specs.map(([l, v]) => (
                    <div key={l}><div style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: C.textTer, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div><div style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: C.text, marginTop: 4 }}>{v}</div></div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </Container>
      </Section>
    </>
  );
}

function HoeHetWerktPage() {
  const { go } = useNav();
  return (
    <>
      <Section style={{ paddingTop: 130, background: `linear-gradient(180deg, ${C.greenLight}40, ${C.white})` }}>
        <Container style={{ textAlign: "center", maxWidth: 560 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 38, color: C.text, letterSpacing: "-0.04em", margin: "0 0 12px" }}>Hoe het werkt</h1>
            <p style={{ fontFamily: F, fontSize: 17, color: C.textSec, lineHeight: 1.6 }}>Van eerste berekening tot geld op je rekening — volledig digitaal.</p>
          </motion.div>
        </Container>
      </Section>
      <Section>
        <Container style={{ maxWidth: 700 }}>
          {[
            { n: "1", t: "Bereken je krediet", d: "Gebruik de calculator op onze homepage om het gewenste bedrag (€5K-€500K) en looptijd (12-120 maanden) te kiezen. Je ziet direct je geschatte maandlasten.", c: C.orange, i: "🧮" },
            { n: "2", t: "Vul het aanvraagformulier in", d: "Vul je persoons- en bedrijfsgegevens in via ons 4-stappen formulier. KVK-nummer, doel van het krediet en contactinformatie.", c: C.green, i: "📋" },
            { n: "3", t: "Qredits beoordeelt je aanvraag", d: "Je aanvraag wordt doorgeleid naar Qredits. Zij controleren je gegevens, voeren een BKR-toetsing uit en plannen een persoonlijk gesprek.", c: C.orange, i: "🔍" },
            { n: "4", t: "Persoonlijk gesprek", d: "Een bedrijfsadviseur van Qredits bespreekt je plannen, situatie en mogelijkheden. Bij jou thuis, op de zaak of bij Qredits op kantoor.", c: C.green, i: "🤝" },
            { n: "5", t: "Krediet op je rekening", d: "Bij goedkeuring wordt het geld overgemaakt. De eerste 3-6 maanden betaal je alleen rente, daarna start de aflossing.", c: C.orange, i: "💰" },
          ].map((s, i) => (
            <motion.div key={i} {...fadeUp} style={{ display: "flex", gap: 24, marginBottom: 36 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${s.c}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{s.i}</div>
              <div>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: C.text, marginBottom: 4 }}>Stap {s.n}: {s.t}</div>
                <p style={{ fontFamily: F, fontSize: 14, color: C.textSec, lineHeight: 1.6 }}>{s.d}</p>
              </div>
            </motion.div>
          ))}
          <div style={{ textAlign: "center", marginTop: 20 }}><Btn size="lg" onClick={() => go("aanvragen")}>Start je aanvraag →</Btn></div>
        </Container>
      </Section>
    </>
  );
}

function OverOnsPage() {
  const { go } = useNav();
  return (
    <>
      <Section style={{ paddingTop: 130, background: `linear-gradient(180deg, #FFF8F4 0%, ${C.white})` }}>
        <Container style={{ textAlign: "center", maxWidth: 620 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 38, color: C.text, letterSpacing: "-0.04em", margin: "0 0 12px" }}>Over ViaViaCredits</h1>
            <p style={{ fontFamily: F, fontSize: 17, color: C.textSec, lineHeight: 1.6 }}>Wij geloven dat elke ondernemer met een goed idee toegang moet hebben tot financiering.</p>
          </motion.div>
        </Container>
      </Section>
      <Section>
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <motion.div {...fadeUp}>
              <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 28, color: C.text, letterSpacing: "-0.03em", margin: "0 0 14px" }}>Onze missie</h2>
              <p style={{ fontFamily: F, fontSize: 15, color: C.textSec, lineHeight: 1.7, marginBottom: 16 }}>ViaViaCredits maakt zakelijke financiering bereikbaar voor elke Nederlandse ondernemer. Als officieel Qredits intermediair verbinden wij jou met de juiste financieringsoplossing — digitaal, snel en transparant.</p>
              <p style={{ fontFamily: F, fontSize: 15, color: C.textSec, lineHeight: 1.7 }}>Of je nu net begint met een stempkaart-app voor bakkerijen of een gevestigde horecazaak wilt uitbreiden — wij zorgen dat financiering geen drempel is maar een springplank.</p>
            </motion.div>
            <motion.div {...fadeUp}>
              <Card hover={false} style={{ padding: 32 }}>
                {[{ t: "Transparant", d: "Geen verborgen kosten." }, { t: "Snel", d: "Binnen 2 werkdagen reactie." }, { t: "Inclusief", d: "Ook starters welkom." }, { t: "Verantwoord", d: "We financieren alleen wat kan." }].map((v, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? 18 : 0 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.green, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>✓</div>
                    <div><div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: C.text }}>{v.t}</div><div style={{ fontFamily: F, fontSize: 13, color: C.textSec }}>{v.d}</div></div>
                  </div>
                ))}
              </Card>
            </motion.div>
          </div>
        </Container>
      </Section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  APP SHELL
// ═══════════════════════════════════════════════════════════════════════
const pages = { home: HomePage, producten: ProductenPage, "hoe-het-werkt": HoeHetWerktPage, "over-ons": OverOnsPage, faq: FAQPage, contact: ContactPage, aanvragen: AanvragenPage, voorwaarden: VoorwaardenPage };

export default function App() {
  const [page, setPage] = useState("home");
  const go = useCallback(p => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  const P = pages[page] || HomePage;
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{margin:0;background:${C.bg};font-family:${F};-webkit-font-smoothing:antialiased}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#d4d4d4;border-radius:99px}
        ::selection{background:${C.orangeGlow};color:${C.orange}}
        input:focus,textarea:focus,select:focus{outline:none;border-color:${C.orange}!important;box-shadow:0 0 0 3px ${C.orangeGlow}!important}
      `}</style>
      <Ctx.Provider value={{ page, go }}>
        <Navbar />
        <main>
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <P />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </Ctx.Provider>
    </>
  );
}
