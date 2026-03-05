import { useState, useCallback, createContext, useContext, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════
   VIAVIACREDITS — Dutch SME Fintech Platform
   Color: Orange / Green / White — Bridgefund-inspired minimal style
   ═══════════════════════════════════════════════════════════════════════ */

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

const Ctx = createContext({ page: "home", go: () => {} });
function useNav() { return useContext(Ctx); }

// Simple shared loan config (no context re-render needed)
const LOAN = { amount: 75000, term: 60 };

const fadeUp = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-50px" }, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } };
const stagger = { initial: "h", whileInView: "s", viewport: { once: true, margin: "-40px" }, variants: { h: {}, s: { transition: { staggerChildren: 0.07 } } } };
const stChild = { variants: { h: { opacity: 0, y: 22 }, s: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } } };

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

function DateInput({ label, value, onChange, required, min, max }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {label && <label style={{ display: "block", fontFamily: F, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>{label}{required && <span style={{ color: C.orange }}> *</span>}</label>}
      <div style={{ position: "relative" }}>
        <input type="date" value={value} onChange={onChange} min={min} max={max}
          style={{ width: "100%", padding: "14px 18px", borderRadius: R.md, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: F, color: value ? C.text : C.textTer, background: C.white, outline: "none", transition: "all 0.2s", boxSizing: "border-box", cursor: "pointer" }}
          onFocus={e => { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orangeGlow}`; }}
          onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
        />
      </div>
    </div>
  );
}

function FileUpload({ label, accept, file, onFileChange, hint }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.[0]) onFileChange(e.dataTransfer.files[0]); };
  return (
    <div style={{ marginBottom: 18 }}>
      {label && <label style={{ display: "block", fontFamily: F, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>{label}</label>}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${file ? C.green : dragOver ? C.orange : C.border}`,
          borderRadius: R.lg, padding: file ? "16px 20px" : "28px 20px",
          textAlign: "center", cursor: "pointer", transition: "all 0.2s",
          background: file ? C.greenLight : dragOver ? C.orangeLight : C.white,
        }}
      >
        <input ref={inputRef} type="file" accept={accept} style={{ display: "none" }}
          onChange={e => { if (e.target.files?.[0]) onFileChange(e.target.files[0]); }} />
        {file ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, flexShrink: 0 }}>📄</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: F, fontWeight: 600, fontSize: 14, color: C.text, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
                <div style={{ fontFamily: F, fontSize: 12, color: C.green, fontWeight: 500 }}>{(file.size / 1024).toFixed(0)} KB · Geüpload ✓</div>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.1 }} onClick={e => { e.stopPropagation(); onFileChange(null); }}
              style={{ width: 28, height: 28, borderRadius: 8, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, color: "#E53E3E" }}>✕</motion.div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.6 }}>📁</div>
            <div style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>Sleep je bestand hierheen</div>
            <div style={{ fontFamily: F, fontSize: 13, color: C.textTer }}>of <span style={{ color: C.orange, fontWeight: 600 }}>klik om te selecteren</span></div>
            {hint && <div style={{ fontFamily: F, fontSize: 11, color: C.textTer, marginTop: 8 }}>{hint}</div>}
          </>
        )}
      </div>
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

//  HOME PAGE
function HomePage() {
  const { go } = useNav();
  const [amount, setAmount] = useState(LOAN.amount);
  const [term, setTerm] = useState(LOAN.term);
  const min = 5000, max = 500000, tMin = 12, tMax = 120;
  const pct = ((amount - min) / (max - min)) * 100;
  const tPct = ((term - tMin) / (tMax - tMin)) * 100;
  const monthly = Math.round(amount / term * 1.05);
  const fmt = v => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(v);
  const loanType = amount <= 50000 ? "Microkrediet" : amount <= 250000 ? "MKB Krediet" : "MKB Krediet+";
  const goAanvragen = () => { LOAN.amount = amount; LOAN.term = term; go("aanvragen"); };

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
                <Btn size="lg" onClick={goAanvragen}>Krediet aanvragen →</Btn>
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

                <Btn full size="lg" onClick={goAanvragen}>Vraag dit krediet aan →</Btn>
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
                    <Btn variant="outline" full onClick={goAanvragen} style={{ marginTop: 14, borderColor: p.color, color: p.color }}>Aanvragen →</Btn>
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
              <Btn size="lg" onClick={goAanvragen}>Start je aanvraag →</Btn>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </>
  );
}

const KVK_DB = {
  "12345678": { handelsnaam: "BrewStamp B.V.", rechtsvorm: "bv", vestigingsplaats: "Amsterdam", sbiCode: "6201 - Ontwikkelen en produceren van software", startdatum: "2023-03-15", sector: "tech", actief: true },
  "23456789": { handelsnaam: "Café Simit", rechtsvorm: "eenmanszaak", vestigingsplaats: "Rotterdam", sbiCode: "5610 - Restaurants", startdatum: "2021-09-01", sector: "horeca", actief: true },
  "34567890": { handelsnaam: "TechFlow Solutions B.V.", rechtsvorm: "bv", vestigingsplaats: "Utrecht", sbiCode: "6202 - Advisering op het gebied van IT", startdatum: "2019-06-22", sector: "tech", actief: true },
  "45678901": { handelsnaam: "Studio Bloem Amsterdam", rechtsvorm: "eenmanszaak", vestigingsplaats: "Amsterdam", sbiCode: "4776 - Winkels in bloemen en planten", startdatum: "2022-01-10", sector: "retail", actief: true },
  "56789012": { handelsnaam: "Van der Berg Transport VOF", rechtsvorm: "vof", vestigingsplaats: "Eindhoven", sbiCode: "4941 - Goederenvervoer over de weg", startdatum: "2017-04-05", sector: "transport", actief: true },
  "67890123": { handelsnaam: "Bouwkracht Jansen B.V.", rechtsvorm: "bv", vestigingsplaats: "Den Haag", sbiCode: "4120 - Algemene burgerlijke en utiliteitsbouw", startdatum: "2015-11-12", sector: "bouw", actief: true },
  "78901234": { handelsnaam: "ZorgPunt Plus", rechtsvorm: "stichting", vestigingsplaats: "Groningen", sbiCode: "8810 - Maatschappelijke dienstverlening zonder huisvesting", startdatum: "2020-07-03", sector: "zorg", actief: true },
  "89012345": { handelsnaam: "De Gouden Lepel", rechtsvorm: "vof", vestigingsplaats: "Maastricht", sbiCode: "5610 - Restaurants", startdatum: "2018-02-28", sector: "horeca", actief: true },
};

const POSTCODE_DB = {
  "1017BZ": { straat: "Herengracht", plaats: "Amsterdam" },
  "1012JS": { straat: "Damrak", plaats: "Amsterdam" },
  "1016EA": { straat: "Keizersgracht", plaats: "Amsterdam" },
  "1071DJ": { straat: "Museumplein", plaats: "Amsterdam" },
  "1011AC": { straat: "Prins Hendrikkade", plaats: "Amsterdam" },
  "3011AA": { straat: "Coolsingel", plaats: "Rotterdam" },
  "3012KL": { straat: "Witte de Withstraat", plaats: "Rotterdam" },
  "3511BH": { straat: "Oudegracht", plaats: "Utrecht" },
  "3512JC": { straat: "Domplein", plaats: "Utrecht" },
  "2511AB": { straat: "Spui", plaats: "Den Haag" },
  "2514JR": { straat: "Lange Voorhout", plaats: "Den Haag" },
  "5611DE": { straat: "Stratumseind", plaats: "Eindhoven" },
  "6211CK": { straat: "Markt", plaats: "Maastricht" },
  "9711JB": { straat: "Grote Markt", plaats: "Groningen" },
  "7511JL": { straat: "Oude Markt", plaats: "Enschede" },
  "5038EA": { straat: "Heuvel", plaats: "Tilburg" },
  "4811XS": { straat: "Grote Markt", plaats: "Breda" },
  "1506MA": { straat: "Zaanweg", plaats: "Zaandam" },
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
const formatPostcode = (v) => {
  const clean = v.replace(/\s/g, "").toUpperCase();
  if (clean.length <= 4) return clean.replace(/[^0-9]/g, "");
  return clean.slice(0, 4).replace(/[^0-9]/g, "") + " " + clean.slice(4).replace(/[^A-Z]/g, "").slice(0, 2);
};

//  AANVRAGEN PAGE (Qredits Application Form)
function AanvragenPage() {
  const { go } = useNav();
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [kvkStatus, setKvkStatus] = useState("idle"); // idle | searching | found | notfound
  const [kvkData, setKvkData] = useState(null);
  const [businessCaseFile, setBusinessCaseFile] = useState(null);
  const [jaarcijfersFile, setJaarcijfersFile] = useState(null);
  const [financieelPlanFile, setFinancieelPlanFile] = useState(null);
  const [postcodeStatus, setPostcodeStatus] = useState("idle"); // idle | searching | found | notfound
  const [emailValid, setEmailValid] = useState(null); // null | true | false

  const [form, setForm] = useState({
    bedrag: String(LOAN.amount), looptijd: String(LOAN.term), doel: "", kvk: "", bedrijfsnaam: "", rechtsvorm: "", startdatum: "", sector: "", businessCase: "",
    voornaam: "", achternaam: "", email: "", telefoon: "", geboortedatum: "", bsn: "",
    straat: "", huisnummer: "", postcode: "", plaats: "",
  });
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Auto KVK lookup when 8 digits entered
  useEffect(() => {
    const clean = form.kvk.replace(/\D/g, "");
    if (clean.length === 8) {
      setKvkStatus("searching");
      setKvkData(null);
      const timer = setTimeout(() => {
        const match = KVK_DB[clean];
        if (match) {
          setKvkStatus("found");
          setKvkData(match);
          setForm(p => ({
            ...p,
            bedrijfsnaam: match.handelsnaam,
            rechtsvorm: match.rechtsvorm,
            startdatum: match.startdatum,
            sector: match.sector,
          }));
        } else {
          setKvkStatus("notfound");
          setKvkData(null);
        }
      }, 1200); // Simulate API delay
      return () => clearTimeout(timer);
    } else {
      setKvkStatus("idle");
      setKvkData(null);
    }
  }, [form.kvk]);

  // Auto postcode lookup
  useEffect(() => {
    const clean = form.postcode.replace(/\s/g, "").toUpperCase();
    if (/^[0-9]{4}[A-Z]{2}$/.test(clean)) {
      setPostcodeStatus("searching");
      const timer = setTimeout(() => {
        const match = POSTCODE_DB[clean];
        if (match) {
          setPostcodeStatus("found");
          setForm(p => ({ ...p, straat: match.straat, plaats: match.plaats }));
        } else {
          setPostcodeStatus("notfound");
        }
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setPostcodeStatus("idle");
    }
  }, [form.postcode]);

  // Email validation
  useEffect(() => {
    if (!form.email) { setEmailValid(null); return; }
    const timer = setTimeout(() => setEmailValid(isValidEmail(form.email)), 500);
    return () => clearTimeout(timer);
  }, [form.email]);

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

  const steps = ["Kredietgegevens", "Bedrijfsgegevens", "Persoonlijke gegevens", "Business Case & Documenten"];

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
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ display: "block", fontFamily: F, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>Gewenst kredietbedrag (€) <span style={{ color: C.orange }}>*</span></label>
                      <input type="text" inputMode="numeric" placeholder="Bijv. 75000" value={form.bedrag}
                        onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 7); u("bedrag", v); }}
                        style={{ width: "100%", padding: "14px 18px", borderRadius: R.md, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: F, color: C.text, background: C.white, outline: "none", boxSizing: "border-box", letterSpacing: "0.02em" }}
                        onFocus={e => { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orangeGlow}`; }}
                        onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                      />
                      <span style={{ fontFamily: F, fontSize: 11, color: C.textTer, marginTop: 4, display: "block" }}>Minimaal €5.000 · Maximaal €500.000 · Alleen cijfers</span>
                    </div>
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ display: "block", fontFamily: F, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>Gewenste looptijd (maanden) <span style={{ color: C.orange }}>*</span></label>
                      <input type="text" inputMode="numeric" placeholder="12 - 120" value={form.looptijd}
                        onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 3); u("looptijd", v); }}
                        style={{ width: "100%", padding: "14px 18px", borderRadius: R.md, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: F, color: C.text, background: C.white, outline: "none", boxSizing: "border-box" }}
                        onFocus={e => { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orangeGlow}`; }}
                        onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                      />
                      <span style={{ fontFamily: F, fontSize: 11, color: C.textTer, marginTop: 4, display: "block" }}>12 tot 120 maanden · Alleen cijfers</span>
                    </div>
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
                    
                    {/* KVK Input with auto-lookup */}
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ display: "block", fontFamily: F, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>KVK-nummer <span style={{ color: C.orange }}>*</span></label>
                      <div style={{ position: "relative" }}>
                        <input type="text" placeholder="Voer 8-cijferig KVK-nummer in" value={form.kvk} maxLength={8}
                          onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 8); u("kvk", v); }}
                          style={{ width: "100%", padding: "14px 18px", paddingRight: 48, borderRadius: R.md, border: `1.5px solid ${kvkStatus === "found" ? C.green : kvkStatus === "notfound" ? "#E53E3E" : C.border}`, fontSize: 15, fontFamily: F, color: C.text, background: C.white, outline: "none", transition: "all 0.2s", boxSizing: "border-box", letterSpacing: "0.1em", fontWeight: 600 }}
                          onFocus={e => { if (kvkStatus === "idle") { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orangeGlow}`; }}}
                          onBlur={e => { if (kvkStatus === "idle") { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}}
                        />
                        <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
                          {kvkStatus === "searching" && (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              style={{ width: 20, height: 20, border: `2.5px solid ${C.borderLight}`, borderTopColor: C.orange, borderRadius: 99 }} />
                          )}
                          {kvkStatus === "found" && <span style={{ color: C.green, fontSize: 20 }}>✓</span>}
                          {kvkStatus === "notfound" && <span style={{ color: "#E53E3E", fontSize: 18 }}>✕</span>}
                        </div>
                      </div>
                      <div style={{ fontFamily: F, fontSize: 11, color: C.textTer, marginTop: 5 }}>
                        {kvkStatus === "idle" && form.kvk.length > 0 && `${8 - form.kvk.length} cijfer(s) resterend`}
                        {kvkStatus === "idle" && form.kvk.length === 0 && "Demo KVK-nummers: 12345678, 23456789, 34567890, 45678901"}
                        {kvkStatus === "searching" && <span style={{ color: C.orange }}>Bedrijf opzoeken via KVK Handelsregister...</span>}
                        {kvkStatus === "notfound" && <span style={{ color: "#E53E3E" }}>Geen bedrijf gevonden met dit KVK-nummer. Controleer het nummer en probeer opnieuw.</span>}
                      </div>
                    </div>

                    {/* Skeleton loading state */}
                    {kvkStatus === "searching" && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ borderRadius: R.lg, border: `1.5px dashed ${C.border}`, padding: 24, marginBottom: 18 }}>
                        {[140, 200, 120, 180].map((w, i) => (
                          <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? 14 : 0 }}>
                            <motion.div animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1 }}
                              style={{ width: 80, height: 14, borderRadius: 6, background: C.borderLight }} />
                            <motion.div animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1 + 0.05 }}
                              style={{ width: w, height: 14, borderRadius: 6, background: C.borderLight }} />
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {/* Company found card */}
                    {kvkStatus === "found" && kvkData && (
                      <motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ borderRadius: R.lg, border: `1.5px solid ${C.green}30`, background: `linear-gradient(135deg, ${C.greenLight}, ${C.white})`, padding: 24, marginBottom: 18 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, delay: 0.15 }}
                              style={{ width: 36, height: 36, borderRadius: 10, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 700 }}>✓</motion.div>
                            <div>
                              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: C.text }}>{kvkData.handelsnaam}</div>
                              <div style={{ fontFamily: F, fontSize: 12, color: C.green, fontWeight: 600 }}>Bedrijf gevonden in Handelsregister</div>
                            </div>
                          </div>
                          <span style={{ background: kvkData.actief ? C.greenLight : "#FEE2E2", color: kvkData.actief ? C.green : "#E53E3E", borderRadius: R.full, padding: "4px 12px", fontSize: 11, fontWeight: 700, fontFamily: F }}>
                            {kvkData.actief ? "● Actief" : "● Inactief"}
                          </span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          {[
                            { l: "KVK-nummer", v: form.kvk },
                            { l: "Rechtsvorm", v: kvkData.rechtsvorm === "bv" ? "Besloten Vennootschap (B.V.)" : kvkData.rechtsvorm === "vof" ? "Vennootschap onder firma (VOF)" : kvkData.rechtsvorm === "eenmanszaak" ? "Eenmanszaak" : kvkData.rechtsvorm === "stichting" ? "Stichting" : kvkData.rechtsvorm },
                            { l: "Vestigingsplaats", v: kvkData.vestigingsplaats },
                            { l: "Startdatum", v: kvkData.startdatum ? new Date(kvkData.startdatum).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : "-" },
                            { l: "SBI-code", v: kvkData.sbiCode, span: true },
                          ].map(item => (
                            <div key={item.l} style={{ gridColumn: item.span ? "1 / -1" : "auto" }}>
                              <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: C.textTer, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.l}</div>
                              <div style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.text, marginTop: 2 }}>{item.v}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: R.sm, background: `${C.orange}08`, border: `1px solid ${C.orange}15` }}>
                          <span style={{ fontFamily: F, fontSize: 12, color: C.orange, fontWeight: 600 }}>ℹ️ Gegevens automatisch ingevuld op basis van KVK-registratie</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Remaining fields - some auto-filled */}
                    <Input label="Bedrijfsnaam (handelsnaam)" placeholder="Naam van je bedrijf" value={form.bedrijfsnaam} onChange={e => u("bedrijfsnaam", e.target.value)} required
                      style={{ opacity: kvkStatus === "found" ? 0.7 : 1 }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <Select label="Rechtsvorm" value={form.rechtsvorm} onChange={e => u("rechtsvorm", e.target.value)} required options={[
                        { value: "", label: "Selecteer..." }, { value: "eenmanszaak", label: "Eenmanszaak" }, { value: "vof", label: "VOF" },
                        { value: "bv", label: "B.V." }, { value: "stichting", label: "Stichting" }, { value: "cv", label: "C.V." },
                      ]} />
                      <DateInput label="Startdatum bedrijf" value={form.startdatum} onChange={e => u("startdatum", e.target.value)} required max="2026-03-05" min="1950-01-01" />
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

                    {/* Email with validation */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div style={{ marginBottom: 18 }}>
                        <label style={{ display: "block", fontFamily: F, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>E-mailadres <span style={{ color: C.orange }}>*</span></label>
                        <div style={{ position: "relative" }}>
                          <input type="email" placeholder="naam@bedrijf.nl" value={form.email}
                            onChange={e => u("email", e.target.value)}
                            style={{ width: "100%", padding: "14px 18px", paddingRight: 40, borderRadius: R.md, border: `1.5px solid ${emailValid === true ? C.green : emailValid === false ? "#E53E3E" : C.border}`, fontSize: 15, fontFamily: F, color: C.text, background: C.white, outline: "none", boxSizing: "border-box", transition: "all 0.2s" }}
                            onFocus={e => { if (emailValid === null) { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orangeGlow}`; }}}
                            onBlur={e => { if (emailValid === null) { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}}
                          />
                          {emailValid !== null && (
                            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: emailValid ? C.green : "#E53E3E" }}>
                              {emailValid ? "✓" : "✕"}
                            </span>
                          )}
                        </div>
                        {emailValid === false && <span style={{ fontFamily: F, fontSize: 11, color: "#E53E3E", marginTop: 3, display: "block" }}>Ongeldig e-mailformaat</span>}
                      </div>

                      {/* Phone - digits only, max 10 */}
                      <div style={{ marginBottom: 18 }}>
                        <label style={{ display: "block", fontFamily: F, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>Telefoonnummer <span style={{ color: C.orange }}>*</span></label>
                        <input type="text" inputMode="numeric" placeholder="06 12345678" value={form.telefoon}
                          onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 10); u("telefoon", v); }}
                          style={{ width: "100%", padding: "14px 18px", borderRadius: R.md, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: F, color: C.text, background: C.white, outline: "none", boxSizing: "border-box", letterSpacing: "0.05em" }}
                          onFocus={e => { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orangeGlow}`; }}
                          onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                        />
                        <span style={{ fontFamily: F, fontSize: 11, color: C.textTer, marginTop: 3, display: "block" }}>10 cijfers · {form.telefoon.length}/10</span>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <DateInput label="Geboortedatum" value={form.geboortedatum} onChange={e => u("geboortedatum", e.target.value)} required max="2008-01-01" min="1940-01-01" />

                      {/* BSN - digits only, exactly 9 */}
                      <div style={{ marginBottom: 18 }}>
                        <label style={{ display: "block", fontFamily: F, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>BSN (vertrouwelijk) <span style={{ color: C.orange }}>*</span></label>
                        <div style={{ position: "relative" }}>
                          <input type="text" inputMode="numeric" placeholder="123456789" value={form.bsn}
                            onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 9); u("bsn", v); }}
                            style={{ width: "100%", padding: "14px 18px", paddingRight: 40, borderRadius: R.md, border: `1.5px solid ${form.bsn.length === 9 ? C.green : C.border}`, fontSize: 15, fontFamily: F, color: C.text, background: C.white, outline: "none", boxSizing: "border-box", letterSpacing: "0.1em", transition: "all 0.2s" }}
                            onFocus={e => { if (form.bsn.length < 9) { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orangeGlow}`; }}}
                            onBlur={e => { if (form.bsn.length < 9) { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}}
                          />
                          {form.bsn.length === 9 && <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: C.green, fontSize: 16 }}>✓</span>}
                        </div>
                        <span style={{ fontFamily: F, fontSize: 11, color: form.bsn.length === 9 ? C.green : C.textTer, marginTop: 3, display: "block" }}>9 cijfers · {form.bsn.length}/9 {form.bsn.length === 9 && "✓"}</span>
                      </div>
                    </div>

                    {/* Postcode with auto-lookup → Straat & Plaats */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.6fr", gap: 12 }}>
                      <div style={{ marginBottom: 18 }}>
                        <label style={{ display: "block", fontFamily: F, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>Postcode <span style={{ color: C.orange }}>*</span></label>
                        <div style={{ position: "relative" }}>
                          <input type="text" placeholder="1234 AB" value={form.postcode}
                            onChange={e => { const v = formatPostcode(e.target.value).slice(0, 7); u("postcode", v); }}
                            maxLength={7}
                            style={{ width: "100%", padding: "14px 18px", paddingRight: 40, borderRadius: R.md, border: `1.5px solid ${postcodeStatus === "found" ? C.green : postcodeStatus === "notfound" ? "#E53E3E" : C.border}`, fontSize: 15, fontFamily: F, color: C.text, background: C.white, outline: "none", boxSizing: "border-box", letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.2s" }}
                            onFocus={e => { if (postcodeStatus === "idle") { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orangeGlow}`; }}}
                            onBlur={e => { if (postcodeStatus === "idle") { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}}
                          />
                          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
                            {postcodeStatus === "searching" && (
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                style={{ width: 16, height: 16, border: `2px solid ${C.borderLight}`, borderTopColor: C.orange, borderRadius: 99 }} />
                            )}
                            {postcodeStatus === "found" && <span style={{ color: C.green, fontSize: 16 }}>✓</span>}
                            {postcodeStatus === "notfound" && <span style={{ color: "#E53E3E", fontSize: 14 }}>✕</span>}
                          </div>
                        </div>
                        {postcodeStatus === "searching" && <span style={{ fontFamily: F, fontSize: 11, color: C.orange, marginTop: 3, display: "block" }}>Adres opzoeken...</span>}
                        {postcodeStatus === "found" && <span style={{ fontFamily: F, fontSize: 11, color: C.green, marginTop: 3, display: "block" }}>Adres gevonden ✓</span>}
                        {postcodeStatus === "notfound" && <span style={{ fontFamily: F, fontSize: 11, color: "#E53E3E", marginTop: 3, display: "block" }}>Postcode niet gevonden</span>}
                        {postcodeStatus === "idle" && <span style={{ fontFamily: F, fontSize: 11, color: C.textTer, marginTop: 3, display: "block" }}>Formaat: 1234 AB · Demo: 1017 BZ, 3011 AA</span>}
                      </div>

                      <div style={{ marginBottom: 18 }}>
                        <label style={{ display: "block", fontFamily: F, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>Straat {postcodeStatus === "found" && <span style={{ color: C.green, fontSize: 10 }}>AUTO</span>}</label>
                        <input type="text" placeholder="Straatnaam" value={form.straat} onChange={e => u("straat", e.target.value)}
                          style={{ width: "100%", padding: "14px 18px", borderRadius: R.md, border: `1.5px solid ${postcodeStatus === "found" ? C.green + "60" : C.border}`, fontSize: 15, fontFamily: F, color: C.text, background: postcodeStatus === "found" ? C.greenLight : C.white, outline: "none", boxSizing: "border-box", transition: "all 0.2s" }}
                          onFocus={e => { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orangeGlow}`; }}
                          onBlur={e => { e.target.style.borderColor = postcodeStatus === "found" ? C.green + "60" : C.border; e.target.style.boxShadow = "none"; }}
                        />
                      </div>

                      <div style={{ marginBottom: 18 }}>
                        <label style={{ display: "block", fontFamily: F, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>Huisnr. <span style={{ color: C.orange }}>*</span></label>
                        <input type="text" inputMode="numeric" placeholder="Nr." value={form.huisnummer}
                          onChange={e => { const v = e.target.value.replace(/[^0-9a-zA-Z\-]/g, "").slice(0, 6); u("huisnummer", v); }}
                          style={{ width: "100%", padding: "14px 18px", borderRadius: R.md, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: F, color: C.text, background: C.white, outline: "none", boxSizing: "border-box" }}
                          onFocus={e => { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orangeGlow}`; }}
                          onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: 18 }}>
                      <label style={{ display: "block", fontFamily: F, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>Plaats {postcodeStatus === "found" && <span style={{ color: C.green, fontSize: 10 }}>AUTO</span>}</label>
                      <input type="text" placeholder="Amsterdam" value={form.plaats} onChange={e => u("plaats", e.target.value)}
                        style={{ width: "100%", padding: "14px 18px", borderRadius: R.md, border: `1.5px solid ${postcodeStatus === "found" ? C.green + "60" : C.border}`, fontSize: 15, fontFamily: F, color: C.text, background: postcodeStatus === "found" ? C.greenLight : C.white, outline: "none", boxSizing: "border-box", transition: "all 0.2s" }}
                        onFocus={e => { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orangeGlow}`; }}
                        onBlur={e => { e.target.style.borderColor = postcodeStatus === "found" ? C.green + "60" : C.border; e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 6 }}>Business Case & Documenten</h3>
                    <p style={{ fontFamily: F, fontSize: 13, color: C.textSec, lineHeight: 1.6, marginBottom: 22 }}>Beschrijf je business case en upload de benodigde documenten voor je kredietaanvraag.</p>

                    {/* Business Case Overview */}
                    <div style={{ marginBottom: 22 }}>
                      <label style={{ display: "block", fontFamily: F, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>Business Case Samenvatting <span style={{ color: C.orange }}>*</span></label>
                      <p style={{ fontFamily: F, fontSize: 12, color: C.textTer, marginBottom: 8, lineHeight: 1.5 }}>
                        Beschrijf in het kort: wat doet je bedrijf, waarvoor heb je het krediet nodig, en hoe ga je het terugbetalen? Dit helpt Qredits bij de beoordeling.
                      </p>
                      <textarea
                        rows={6}
                        value={form.businessCase || ""}
                        onChange={e => u("businessCase", e.target.value)}
                        placeholder={"Voorbeeld:\n\nMijn bedrijf [naam] is gespecialiseerd in [activiteit]. We zijn gevestigd in [plaats] en actief sinds [jaar].\n\nHet krediet van €[bedrag] willen we inzetten voor [doel, bijv. werkkapitaal, inventaris, uitbreiding].\n\nOnze verwachte maandelijkse omzet is €[bedrag], waarmee we de maandelijkse aflossing van €[bedrag] comfortabel kunnen dragen.\n\nDe investering zal leiden tot [verwachte resultaten, bijv. 30% omzetgroei, nieuwe klanten, efficiëntere operatie]."}
                        style={{
                          width: "100%", padding: "16px 18px", borderRadius: R.md,
                          border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: F,
                          color: C.text, background: C.white, outline: "none",
                          resize: "vertical", lineHeight: 1.6, boxSizing: "border-box",
                          minHeight: 160, transition: "all 0.2s",
                        }}
                        onFocus={e => { e.target.style.borderColor = C.orange; e.target.style.boxShadow = `0 0 0 3px ${C.orangeGlow}`; }}
                        onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                        <span style={{ fontFamily: F, fontSize: 11, color: C.textTer }}>Minimaal 100 tekens aanbevolen</span>
                        <span style={{ fontFamily: F, fontSize: 11, color: (form.businessCase?.length || 0) >= 100 ? C.green : C.textTer, fontWeight: 600 }}>
                          {form.businessCase?.length || 0} tekens {(form.businessCase?.length || 0) >= 100 && "✓"}
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: C.borderLight, margin: "8px 0 22px" }} />

                    {/* Document Uploads */}
                    <div style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 4 }}>Documenten uploaden</div>
                    <p style={{ fontFamily: F, fontSize: 12, color: C.textTer, marginBottom: 16, lineHeight: 1.5 }}>Upload je ondernemingsplan / business case document. Toegestane formaten: PDF, DOC, DOCX, XLS, XLSX (max. 10MB per bestand).</p>

                    <FileUpload
                      label="Ondernemingsplan / Business Case document"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      file={businessCaseFile}
                      onFileChange={setBusinessCaseFile}
                      hint="PDF, DOC, DOCX, XLS of XLSX · Max. 10MB"
                    />

                    <FileUpload
                      label="Recente jaarcijfers (voor bestaande bedrijven)"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      file={jaarcijfersFile}
                      onFileChange={setJaarcijfersFile}
                      hint="PDF, DOC, DOCX, XLS of XLSX · Max. 10MB · Optioneel voor starters"
                    />

                    <FileUpload
                      label="Financieel plan met investeringsopzet"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      file={financieelPlanFile}
                      onFileChange={setFinancieelPlanFile}
                      hint="PDF, DOC, DOCX, XLS of XLSX · Max. 10MB"
                    />

                    {/* Upload summary */}
                    <div style={{ background: C.bg, borderRadius: R.md, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontFamily: F, fontSize: 13, color: C.textSec }}>
                        <span style={{ fontWeight: 700, color: C.text }}>{[businessCaseFile, jaarcijfersFile, financieelPlanFile].filter(Boolean).length}</span> van 3 documenten geüpload
                      </div>
                      <div style={{ flex: 1 }} />
                      <div style={{ display: "flex", gap: 4 }}>
                        {[businessCaseFile, jaarcijfersFile, financieelPlanFile].map((f, i) => (
                          <div key={i} style={{ width: 8, height: 8, borderRadius: 99, background: f ? C.green : C.borderLight, transition: "all 0.3s" }} />
                        ))}
                      </div>
                    </div>

                    {/* Agreement */}
                    <div style={{ padding: "16px 18px", borderRadius: R.md, background: C.orangeLight, border: `1.5px solid ${C.orange}30` }}>
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
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, alignItems: "center" }}>
                  {step > 0 ? <Btn variant="white" onClick={() => setStep(step - 1)}>← Terug</Btn> : <div />}
                  {step < 3 ? (
                    <Btn onClick={() => setStep(step + 1)}>Volgende →</Btn>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      {(!agreed || !businessCaseFile || (form.businessCase?.length || 0) < 100) && (
                        <div style={{ fontFamily: F, fontSize: 12, color: "#E53E3E", textAlign: "right", maxWidth: 320, lineHeight: 1.4 }}>
                          {(form.businessCase?.length || 0) < 100 && "⚠ Business case samenvatting (min. 100 tekens) · "}
                          {!businessCaseFile && "⚠ Business case document · "}
                          {!agreed && "⚠ Akkoord met voorwaarden"}
                        </div>
                      )}
                      <Btn variant="green" onClick={() => setSubmitted(true)}
                        disabled={!agreed || !businessCaseFile || (form.businessCase?.length || 0) < 100}>
                        Aanvraag indienen ✓
                      </Btn>
                    </div>
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

//  VOORWAARDEN PAGE (Comprehensive User Agreement)
function VoorwaardenPage() {
  const sections = [
    { title: "1. Definities", content: "\"Platform\": de website van ViaViaCredits B.V. (KvK 91204837, Amsterdam).\n\"Gebruiker\": iedere persoon die het Platform gebruikt.\n\"Kredietverstrekker\": Stichting Qredits Microfinanciering Nederland.\n\"BKR\": Bureau Krediet Registratie te Tiel." },
    { title: "2. Toepasselijkheid", content: "2.1 Deze voorwaarden gelden voor elk gebruik van het Platform.\n2.2 Door gebruik accepteert Gebruiker deze voorwaarden.\n2.3 ViaViaCredits mag deze voorwaarden wijzigen met 30 dagen vooraankondiging." },
    { title: "3. Dienstverlening", content: "3.1 ViaViaCredits bemiddelt tussen Gebruiker en Qredits en verstrekt zelf geen kredieten.\n3.2 De kredietbeslissing wordt genomen door Qredits. Geen garantie op goedkeuring.\n3.3 Gebruik van het Platform is kosteloos voor Gebruiker." },
    { title: "4. Verplichtingen Gebruiker", content: "4.1 Gebruiker garandeert dat alle verstrekte informatie juist en volledig is.\n4.2 Onjuiste informatie kan leiden tot afwijzing en juridische gevolgen.\n4.3 Gebruiker is verantwoordelijk voor beveiliging van eigen inloggegevens." },
    { title: "5. Privacy (AVG/GDPR)", content: "5.1 Verwerking conform AVG/GDPR.\n5.2 Verwerkte gegevens: identificatie, contact, bedrijfs-, financiele gegevens en documenten.\n5.3 Gegevens worden alleen gedeeld met Qredits, tenzij wettelijk verplicht.\n5.4 Bewaring max. 7 jaar. Recht op inzage, rectificatie en verwijdering." },
    { title: "6. BKR-toetsing", content: "6.1 Gebruiker geeft toestemming voor BKR-toetsing door Qredits.\n6.2 Negatieve registratie leidt niet automatisch tot afwijzing.\n6.3 Bij goedkeuring wordt de lening bij het BKR geregistreerd." },
    { title: "7. Aansprakelijkheid", content: "7.1 ViaViaCredits is niet aansprakelijk voor beslissingen van Qredits, onjuiste informatie van Gebruiker, of technische storingen.\n7.2 Totale aansprakelijkheid beperkt tot verzekeringsuitkering." },
    { title: "8. Toepasselijk Recht", content: "8.1 Nederlands recht is van toepassing.\n8.2 Geschillen: bevoegde rechter te Amsterdam.\n8.3 Klachten: klachten@viaviacredits.nl (reactie binnen 10 werkdagen)." },
    { title: "9. Contact", content: "ViaViaCredits B.V. | Herengracht 420, 1017 BZ Amsterdam\nKvK: 91204837 | BTW: NL864752319B01\ninfo@viaviacredits.nl | 085-401 8800\nPrivacy: privacy@viaviacredits.nl\n\nLaatst bijgewerkt: 1 maart 2026" },
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

//  FAQ PAGE
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

//  CONTACT PAGE
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

//  SIMPLE PAGES (Products, How it Works, About)
function ProductenPage() {
  const { go } = useNav();
  return (<Section style={{ paddingTop: 130 }}><Container style={{ maxWidth: 700 }}>
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
      <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 34, color: C.text, letterSpacing: "-0.03em", textAlign: "center", marginBottom: 32 }}>Onze producten</h1>
      {[{ t: "Microkrediet", r: "€5.000 – €50.000", c: C.orange, i: "🚀", f: ["Starters & ZZP", "12-120 mnd", "Vanaf 5,75%", "Coach inbegrepen"] },
        { t: "MKB Krediet", r: "€50.000 – €500.000", c: C.green, i: "📈", f: ["Gevestigd MKB", "12-120 mnd", "Vanaf 4,50%", "Open Banking"] }].map((p, i) => (
        <Card key={i} style={{ marginBottom: 20, display: "flex", gap: 24, alignItems: "center" }}>
          <div style={{ fontSize: 40 }}>{p.i}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: C.text }}>{p.t} <span style={{ color: p.c }}>{p.r}</span></div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>{p.f.map(f => <span key={f} style={{ fontFamily: F, fontSize: 13, color: C.textSec }}>✓ {f}</span>)}</div>
          </div>
          <Btn onClick={() => go("aanvragen")} style={{ background: p.c, flexShrink: 0 }}>Aanvragen</Btn>
        </Card>))}
    </motion.div></Container></Section>);
}

function HoeHetWerktPage() {
  const { go } = useNav();
  return (<Section style={{ paddingTop: 130 }}><Container style={{ maxWidth: 640 }}>
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
      <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 34, color: C.text, letterSpacing: "-0.03em", textAlign: "center", marginBottom: 32 }}>Hoe het werkt</h1>
      {[{ n: "1", t: "Bereken je krediet", d: "Kies bedrag en looptijd met de calculator.", i: "🧮", c: C.orange },
        { n: "2", t: "Vul je gegevens in", d: "Persoons- en bedrijfsgegevens via ons formulier.", i: "📋", c: C.green },
        { n: "3", t: "Qredits beoordeelt", d: "BKR-toetsing en persoonlijk gesprek.", i: "🔍", c: C.orange },
        { n: "4", t: "Krediet ontvangen", d: "Geld op je rekening na goedkeuring.", i: "💰", c: C.green }].map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 20, marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.c}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{s.i}</div>
          <div><div style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: C.text }}>Stap {s.n}: {s.t}</div><p style={{ fontFamily: F, fontSize: 14, color: C.textSec, margin: "4px 0 0" }}>{s.d}</p></div>
        </div>))}
      <div style={{ textAlign: "center" }}><Btn size="lg" onClick={() => go("aanvragen")}>Start je aanvraag →</Btn></div>
    </motion.div></Container></Section>);
}

function OverOnsPage() {
  return (<Section style={{ paddingTop: 130 }}><Container style={{ maxWidth: 640 }}>
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
      <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 34, color: C.text, letterSpacing: "-0.03em", textAlign: "center", marginBottom: 16 }}>Over ViaViaCredits</h1>
      <p style={{ fontFamily: F, fontSize: 16, color: C.textSec, lineHeight: 1.7, textAlign: "center", marginBottom: 32 }}>ViaViaCredits maakt zakelijke financiering bereikbaar voor elke Nederlandse ondernemer. Als officieel Qredits intermediair verbinden wij jou met de juiste financieringsoplossing.</p>
      <Card hover={false} style={{ padding: 28 }}>
        {[{ t: "Transparant", d: "Geen verborgen kosten" }, { t: "Snel", d: "Binnen 2 werkdagen reactie" }, { t: "Inclusief", d: "Ook starters welkom" }, { t: "Verantwoord", d: "We financieren alleen wat kan" }].map((v, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? 14 : 0 }}>
            <span style={{ color: C.green, fontWeight: 700 }}>✓</span>
            <div><span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: C.text }}>{v.t}</span> — <span style={{ fontFamily: F, fontSize: 14, color: C.textSec }}>{v.d}</span></div>
          </div>))}
      </Card>
    </motion.div></Container></Section>);
}

//  APP SHELL
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
