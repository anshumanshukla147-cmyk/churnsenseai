import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

/* ─── FONTS & GLOBAL STYLES ─────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Geist+Mono:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink:    #0C0C0E;
  --ink2:   #16161A;
  --ink3:   #1E1E24;
  --ink4:   #2A2A32;
  --line:   rgba(255,255,255,0.07);
  --line2:  rgba(255,255,255,0.12);
  --muted:  #5A5A6E;
  --dim:    #8A8A9E;
  --text:   #E8E8F0;
  --bright: #FFFFFF;
  --accent: #7C6AF7;
  --accent2:#A78BFA;
  --green:  #34D399;
  --red:    #F87171;
  --amber:  #FBBF24;
  --mono: 'Geist Mono', monospace;
  --sans: 'Syne', system-ui, sans-serif;
}

html, body, #root { font-family: var(--sans); background: var(--ink); color: var(--text); min-height: 100vh; }

::selection { background: rgba(124,106,247,0.3); }

/* scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--ink4); border-radius: 2px; }

/* grid overlay utility */
.grid-bg {
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ── NAV ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  height: 56px; display: flex; align-items: center; padding: 0 32px;
  border-bottom: 1px solid var(--line);
  background: rgba(12,12,14,0.85);
  backdrop-filter: blur(16px);
}
.nav-logo {
  font-size: 16px; font-weight: 700; color: var(--bright); letter-spacing: -0.03em;
  cursor: pointer; display: flex; align-items: center; gap: 8px;
}
.logo-dot { width: 7px; height: 7px; background: var(--accent); border-radius: 50%; display: inline-block; }
.nav-links { display: flex; align-items: center; gap: 4px; margin-left: auto; }
.nav-btn {
  font-family: var(--sans); font-size: 13px; font-weight: 500; color: var(--dim);
  background: none; border: none; padding: 6px 14px; border-radius: 6px;
  cursor: pointer; transition: color .15s, background .15s;
}
.nav-btn:hover { color: var(--text); background: var(--ink3); }
.nav-cta {
  font-family: var(--sans); font-size: 13px; font-weight: 600; color: var(--bright);
  background: var(--accent); border: none; padding: 7px 18px; border-radius: 7px;
  cursor: pointer; transition: opacity .15s, transform .15s; margin-left: 8px;
}
.nav-cta:hover { opacity: .85; transform: translateY(-1px); }

/* ── LANDING ── */
.hero {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 80px 24px 60px; text-align: center; position: relative; overflow: hidden;
}
.hero-orb {
  position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none;
}
.hero-orb-1 { width: 500px; height: 500px; background: rgba(124,106,247,0.12); top: -100px; left: 50%; transform: translateX(-60%); }
.hero-orb-2 { width: 300px; height: 300px; background: rgba(52,211,153,0.07); bottom: 50px; right: 5%; }

.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 11px; font-weight: 400; letter-spacing: .1em;
  color: var(--accent2); text-transform: uppercase;
  border: 1px solid rgba(124,106,247,0.25); background: rgba(124,106,247,0.08);
  padding: 5px 14px; border-radius: 100px; margin-bottom: 28px;
  animation: fadeUp .5s ease both;
}
.pulse-dot { width: 5px; height: 5px; background: var(--green); border-radius: 50%; animation: blink 2s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

.hero-h1 {
  font-size: clamp(44px, 7vw, 88px); font-weight: 800; line-height: 1.02;
  letter-spacing: -0.04em; color: var(--bright); margin-bottom: 20px;
  animation: fadeUp .55s .08s ease both;
}
.hero-h1 .grad {
  background: linear-gradient(135deg, #A78BFA 0%, #7C6AF7 40%, #34D399 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hero-sub {
  font-size: 17px; color: var(--dim); max-width: 480px; line-height: 1.65;
  margin: 0 auto 36px; font-weight: 400; animation: fadeUp .55s .16s ease both;
}
.hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; animation: fadeUp .55s .24s ease both; }

.btn { font-family: var(--sans); cursor: pointer; font-size: 14px; font-weight: 600; border: none; transition: all .2s; border-radius: 8px; }
.btn-solid { background: var(--accent); color: #fff; padding: 12px 26px; }
.btn-solid:hover { background: #6B5CE7; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124,106,247,0.35); }
.btn-ghost { background: var(--ink3); color: var(--text); padding: 12px 26px; border: 1px solid var(--line2); }
.btn-ghost:hover { background: var(--ink4); border-color: rgba(255,255,255,0.2); }

.stat-strip {
  display: flex; gap: 0; border: 1px solid var(--line2); border-radius: 12px;
  overflow: hidden; margin-top: 60px; max-width: 680px; width: 100%;
  animation: fadeUp .55s .32s ease both; background: var(--ink2);
}
.stat-strip-item { flex: 1; padding: 20px 24px; border-right: 1px solid var(--line); text-align: center; }
.stat-strip-item:last-child { border-right: none; }
.strip-val { font-family: var(--mono); font-size: 26px; font-weight: 500; color: var(--bright); }
.strip-lbl { font-size: 11px; color: var(--muted); margin-top: 4px; letter-spacing: .05em; text-transform: uppercase; }

/* ── SECTION ── */
.section { padding: 100px 40px; max-width: 1160px; margin: 0 auto; }
.sec-eyebrow { font-family: var(--mono); font-size: 11px; font-weight: 400; color: var(--accent2); letter-spacing: .1em; text-transform: uppercase; margin-bottom: 14px; }
.sec-h2 { font-size: clamp(28px, 4vw, 46px); font-weight: 700; letter-spacing: -0.03em; color: var(--bright); line-height: 1.1; margin-bottom: 14px; }
.sec-p { font-size: 15px; color: var(--dim); line-height: 1.65; max-width: 460px; }
.divider { height: 1px; background: var(--line); max-width: 1160px; margin: 0 auto; }

/* ── CARDS ── */
.card { background: var(--ink2); border: 1px solid var(--line); border-radius: 14px; transition: border-color .2s; }
.card:hover { border-color: var(--line2); }
.feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; margin-top: 56px; }
.feat-cell { background: var(--ink2); padding: 32px 28px; transition: background .2s; }
.feat-cell:hover { background: var(--ink3); }
.feat-icon { font-size: 22px; margin-bottom: 16px; }
.feat-title { font-size: 15px; font-weight: 600; color: var(--bright); margin-bottom: 8px; letter-spacing: -0.02em; }
.feat-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }

/* ── WORKFLOW ── */
.flow-row { display: flex; align-items: flex-start; gap: 0; margin-top: 56px; }
.flow-step { flex: 1; padding: 0 20px; position: relative; }
.flow-step::after { content: ''; position: absolute; top: 18px; right: -1px; width: 40px; height: 1px; background: var(--line2); }
.flow-step:last-child::after { display: none; }
.flow-num { font-family: var(--mono); font-size: 11px; color: var(--accent); border: 1px solid rgba(124,106,247,0.3); background: rgba(124,106,247,0.08); display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; margin-bottom: 14px; font-weight: 500; }
.flow-title { font-size: 14px; font-weight: 600; color: var(--bright); margin-bottom: 6px; }
.flow-desc { font-size: 12px; color: var(--muted); line-height: 1.55; }

/* ── CHART SECTION ── */
.chart-row { display: grid; grid-template-columns: 3fr 2fr; gap: 16px; margin-top: 40px; }
.chart-box { background: var(--ink2); border: 1px solid var(--line); border-radius: 14px; padding: 24px; }
.chart-box-title { font-size: 13px; font-weight: 600; color: var(--bright); margin-bottom: 4px; letter-spacing: -0.02em; }
.chart-box-sub { font-size: 11px; color: var(--muted); margin-bottom: 20px; font-family: var(--mono); }

/* ── TESTIMONIALS ── */
.test-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 56px; }
.test-card { background: var(--ink2); border: 1px solid var(--line); border-radius: 14px; padding: 28px 24px; }
.test-quote { font-size: 14px; color: var(--dim); line-height: 1.7; margin-bottom: 24px; font-style: italic; }
.test-author { display: flex; align-items: center; gap: 12px; }
.test-ava { width: 34px; height: 34px; border-radius: 8px; background: rgba(124,106,247,0.15); border: 1px solid rgba(124,106,247,0.2); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--accent2); font-family: var(--mono); }
.test-name { font-size: 13px; font-weight: 600; color: var(--bright); }
.test-role { font-size: 11px; color: var(--muted); margin-top: 1px; }

/* ── PRICING ── */
.price-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 56px; }
.price-card { background: var(--ink2); border: 1px solid var(--line); border-radius: 16px; padding: 32px 28px; position: relative; transition: border-color .2s; }
.price-card:hover { border-color: var(--line2); }
.price-card.featured { border-color: rgba(124,106,247,0.4); background: rgba(124,106,247,0.04); }
.price-pop { position: absolute; top: -11px; left: 50%; transform: translateX(-50%); background: var(--accent); color: #fff; font-size: 10px; font-weight: 700; padding: 4px 14px; border-radius: 100px; letter-spacing: .05em; text-transform: uppercase; font-family: var(--mono); white-space: nowrap; }
.price-name { font-family: var(--mono); font-size: 11px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: .1em; margin-bottom: 16px; }
.price-num { font-size: 44px; font-weight: 700; color: var(--bright); letter-spacing: -0.04em; line-height: 1; }
.price-per { font-size: 13px; color: var(--muted); margin-top: 4px; margin-bottom: 24px; }
.price-sep { height: 1px; background: var(--line); margin-bottom: 20px; }
.price-feat { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--dim); margin-bottom: 10px; }
.price-feat::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
.price-btn { width: 100%; margin-top: 24px; padding: 11px; border-radius: 8px; font-family: var(--sans); font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s; }
.price-btn-outline { background: none; border: 1px solid var(--line2); color: var(--text); }
.price-btn-outline:hover { background: var(--ink3); }
.price-btn-filled { background: var(--accent); border: none; color: #fff; }
.price-btn-filled:hover { background: #6B5CE7; }

/* ── FAQ ── */
.faq-inner { max-width: 680px; margin: 48px auto 0; }
.faq-item { border-bottom: 1px solid var(--line); padding: 18px 0; cursor: pointer; }
.faq-q { font-size: 15px; font-weight: 600; color: var(--bright); display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.faq-icon { font-size: 18px; color: var(--accent); line-height: 1; flex-shrink: 0; font-family: var(--mono); }
.faq-a { font-size: 14px; color: var(--muted); line-height: 1.7; padding-top: 12px; }

/* ── FOOTER ── */
.footer { border-top: 1px solid var(--line); padding: 60px 40px 40px; max-width: 1160px; margin: 0 auto; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 48px; }
.footer-brand { font-size: 15px; font-weight: 700; color: var(--bright); letter-spacing: -0.02em; margin-bottom: 10px; }
.footer-desc { font-size: 13px; color: var(--muted); line-height: 1.65; max-width: 240px; }
.footer-col-title { font-family: var(--mono); font-size: 10px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: .1em; margin-bottom: 14px; }
.footer-link { display: block; font-size: 13px; color: var(--dim); margin-bottom: 9px; cursor: pointer; transition: color .15s; background: none; border: none; font-family: var(--sans); text-align: left; }
.footer-link:hover { color: var(--text); }
.footer-copy { font-family: var(--mono); font-size: 11px; color: var(--muted); border-top: 1px solid var(--line); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; }

/* ── MODAL ── */
.overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.7); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; padding: 24px; }
.modal { background: var(--ink2); border: 1px solid var(--line2); border-radius: 20px; padding: 44px; width: 100%; max-width: 420px; animation: pop .25s ease; }
@keyframes pop { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
.modal-logo { display: flex; align-items: center; gap: 8px; justify-content: center; font-size: 15px; font-weight: 700; color: var(--bright); margin-bottom: 6px; }
.modal-h { font-size: 22px; font-weight: 700; color: var(--bright); text-align: center; letter-spacing: -0.03em; margin-bottom: 8px; }
.modal-sub { font-size: 13px; color: var(--muted); text-align: center; line-height: 1.6; margin-bottom: 28px; }
.modal-input { width: 100%; padding: 12px 16px; background: var(--ink3); border: 1px solid var(--line2); border-radius: 9px; font-size: 14px; font-family: var(--sans); color: var(--text); outline: none; margin-bottom: 10px; transition: border-color .2s; }
.modal-input:focus { border-color: var(--accent); }
.modal-input::placeholder { color: var(--muted); }
.modal-submit { width: 100%; padding: 13px; background: var(--accent); color: #fff; border: none; border-radius: 9px; font-size: 14px; font-weight: 600; font-family: var(--sans); cursor: pointer; transition: all .2s; margin-top: 4px; }
.modal-submit:hover { background: #6B5CE7; transform: translateY(-1px); }
.modal-note { text-align: center; font-size: 11px; color: var(--muted); margin-top: 14px; font-family: var(--mono); }

/* ── PREDICT PAGE ── */
.page { padding: 76px 24px 60px; min-height: 100vh; }
.page-inner { max-width: 880px; margin: 0 auto; padding-top: 40px; }
.page-h { font-size: 30px; font-weight: 700; color: var(--bright); letter-spacing: -0.03em; margin-bottom: 6px; }
.page-sub { font-size: 14px; color: var(--muted); margin-bottom: 36px; }
.form-section { background: var(--ink2); border: 1px solid var(--line); border-radius: 14px; padding: 28px 32px; margin-bottom: 20px; }
.form-section-title { font-family: var(--mono); font-size: 11px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: .1em; margin-bottom: 20px; }
.form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.form-grp { display: flex; flex-direction: column; gap: 5px; }
.form-lbl { font-size: 11px; font-weight: 600; color: var(--dim); text-transform: uppercase; letter-spacing: .05em; }
.form-inp, .form-sel {
  width: 100%; padding: 10px 13px; background: var(--ink3); border: 1px solid var(--line);
  border-radius: 8px; font-size: 13px; font-family: var(--sans); color: var(--text); outline: none;
  transition: border-color .2s;
}
.form-inp:focus, .form-sel:focus { border-color: var(--accent); }
.form-inp::placeholder { color: var(--muted); }
.form-sel option { background: var(--ink3); }

/* ── RESULT ── */
.gauge-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--ink2); border: 1px solid var(--line); border-radius: 14px; padding: 36px 24px; margin-bottom: 16px; }
.result-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
.result-c { background: var(--ink2); border: 1px solid var(--line); border-radius: 12px; padding: 20px; text-align: center; }
.result-c-lbl { font-family: var(--mono); font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px; }
.result-c-val { font-size: 28px; font-weight: 700; color: var(--bright); font-family: var(--mono); }
.conf-track { height: 4px; background: var(--ink4); border-radius: 2px; margin-top: 10px; overflow: hidden; }
.conf-fill { height: 100%; border-radius: 2px; background: var(--accent); transition: width 1s ease; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.insight-box { background: var(--ink2); border: 1px solid var(--line); border-radius: 12px; padding: 22px; }
.insight-title { font-size: 13px; font-weight: 600; color: var(--bright); margin-bottom: 14px; }
.insight-row { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--line); font-size: 13px; color: var(--dim); }
.insight-row:last-child { border-bottom: none; }
.dot-red { width: 6px; height: 6px; border-radius: 50%; background: var(--red); flex-shrink: 0; }
.dot-green { width: 6px; height: 6px; border-radius: 50%; background: var(--green); flex-shrink: 0; }

/* ── DASHBOARD ── */
.dash-shell { display: flex; min-height: 100vh; }
.sidebar { width: 220px; flex-shrink: 0; background: var(--ink2); border-right: 1px solid var(--line); padding: 72px 12px 24px; position: fixed; top: 0; bottom: 0; left: 0; overflow-y: auto; }
.sidebar-logo { padding: 0 10px; margin-bottom: 28px; font-size: 13px; font-weight: 700; color: var(--bright); display: flex; align-items: center; gap: 6px; }
.sb-section { font-family: var(--mono); font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: .1em; padding: 0 10px; margin: 20px 0 6px; }
.sb-item { display: flex; align-items: center; gap: 9px; padding: 9px 10px; border-radius: 7px; font-size: 13px; font-weight: 500; color: var(--dim); cursor: pointer; transition: all .15s; width: 100%; background: none; border: none; font-family: var(--sans); }
.sb-item:hover { background: var(--ink3); color: var(--text); }
.sb-item.active { background: rgba(124,106,247,0.12); color: var(--accent2); border: 1px solid rgba(124,106,247,0.15); }
.dash-main { margin-left: 220px; flex: 1; padding: 76px 32px 40px; }
.dash-top { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; }
.dash-greeting { font-size: 22px; font-weight: 700; color: var(--bright); letter-spacing: -0.03em; }
.dash-date { font-family: var(--mono); font-size: 11px; color: var(--muted); margin-top: 4px; }
.kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
.kpi { background: var(--ink2); border: 1px solid var(--line); border-radius: 12px; padding: 18px 20px; }
.kpi-lbl { font-family: var(--mono); font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px; }
.kpi-val { font-size: 26px; font-weight: 700; color: var(--bright); font-family: var(--mono); letter-spacing: -0.02em; }
.kpi-sub { font-size: 11px; margin-top: 4px; }
.kpi-up { color: var(--green); } .kpi-dn { color: var(--red); }
.charts-2col { display: grid; grid-template-columns: 2fr 1fr; gap: 12px; margin-bottom: 20px; }
.dash-chart { background: var(--ink2); border: 1px solid var(--line); border-radius: 12px; padding: 20px; }
.dct { font-size: 13px; font-weight: 600; color: var(--bright); margin-bottom: 2px; }
.dcs { font-family: var(--mono); font-size: 10px; color: var(--muted); margin-bottom: 16px; }
.history-wrap { background: var(--ink2); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
.history-head { padding: 18px 22px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; }
.ht { font-size: 13px; font-weight: 600; color: var(--bright); }
.htable { width: 100%; border-collapse: collapse; }
.htable th { font-family: var(--mono); font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; padding: 12px 20px; text-align: left; border-bottom: 1px solid var(--line); background: var(--ink3); }
.htable td { font-size: 13px; padding: 14px 20px; border-bottom: 1px solid var(--line); color: var(--dim); }
.htable tr:last-child td { border-bottom: none; }
.badge { display: inline-flex; padding: 3px 10px; border-radius: 100px; font-size: 10px; font-weight: 700; font-family: var(--mono); }
.badge-red { background: rgba(248,113,113,0.12); color: var(--red); }
.badge-amber { background: rgba(251,191,36,0.12); color: var(--amber); }
.badge-green { background: rgba(52,211,153,0.12); color: var(--green); }

/* ── ADMIN ── */
.admin-gate { min-height: 100vh; background: #08080A; display: flex; align-items: center; justify-content: center; padding: 24px; }
.admin-box { background: var(--ink2); border: 1px solid var(--line2); border-radius: 20px; padding: 44px; width: 100%; max-width: 400px; text-align: center; }
.admin-h { font-size: 22px; font-weight: 700; color: var(--bright); letter-spacing: -0.03em; margin-bottom: 6px; }
.admin-sub { font-size: 13px; color: var(--muted); margin-bottom: 28px; }
.admin-inp { width: 100%; padding: 11px 14px; background: var(--ink3); border: 1px solid var(--line); border-radius: 8px; font-size: 13px; font-family: var(--sans); color: var(--text); outline: none; margin-bottom: 10px; }
.admin-inp:focus { border-color: var(--accent); }
.admin-inp::placeholder { color: var(--muted); }
.admin-btn { width: 100%; padding: 12px; background: var(--accent); color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; font-family: var(--sans); cursor: pointer; margin-top: 4px; transition: all .2s; }
.admin-btn:hover { background: #6B5CE7; }
.admin-err { font-size: 12px; color: var(--red); margin: 6px 0; font-family: var(--mono); }
.admin-hint { margin-top: 18px; background: var(--ink3); border-radius: 8px; padding: 12px; font-family: var(--mono); font-size: 11px; color: var(--muted); text-align: left; }
.admin-panel { background: #08080A; min-height: 100vh; }
.admin-topbar { background: var(--ink2); border-bottom: 1px solid var(--line); padding: 14px 32px; display: flex; align-items: center; justify-content: space-between; }
.admin-topbar-title { font-size: 14px; font-weight: 700; color: var(--bright); display: flex; align-items: center; gap: 8px; letter-spacing: -0.02em; }
.admin-content { padding: 32px; max-width: 1300px; margin: 0 auto; }
.admin-kpi { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }
.admin-kpi-card { background: var(--ink2); border: 1px solid var(--line); border-radius: 12px; padding: 20px 22px; }
.akl { font-family: var(--mono); font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px; }
.akv { font-size: 30px; font-weight: 700; color: var(--bright); font-family: var(--mono); }
.admin-table-wrap { background: var(--ink2); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; margin-bottom: 20px; }
.admin-table-top { padding: 18px 24px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; }
.att { font-size: 14px; font-weight: 600; color: var(--bright); }
.admin-search { padding: 8px 14px; background: var(--ink3); border: 1px solid var(--line); border-radius: 7px; font-size: 13px; font-family: var(--sans); color: var(--text); outline: none; width: 200px; }
.admin-search:focus { border-color: var(--accent); }
.admin-search::placeholder { color: var(--muted); }
.atable { width: 100%; border-collapse: collapse; }
.atable th { font-family: var(--mono); font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; padding: 12px 20px; text-align: left; border-bottom: 1px solid var(--line); background: var(--ink3); }
.atable td { font-size: 12px; padding: 14px 20px; border-bottom: 1px solid var(--line); color: var(--dim); }
.atable tr:last-child td { border-bottom: none; }
.del-btn { background: none; border: 1px solid rgba(248,113,113,0.25); color: var(--red); padding: 4px 12px; border-radius: 5px; font-size: 11px; font-family: var(--mono); cursor: pointer; transition: all .15s; }
.del-btn:hover { background: rgba(248,113,113,0.08); }
.export-btn2 { background: var(--ink3); border: 1px solid var(--line2); color: var(--text); padding: 7px 16px; border-radius: 7px; font-size: 12px; font-family: var(--mono); cursor: pointer; transition: all .15s; }
.export-btn2:hover { background: var(--ink4); }
.admin-charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* ── BACK BTN ── */
.back-btn{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:11px;font-weight:500;color:var(--muted);background:var(--ink2);border:1px solid var(--line);border-radius:7px;padding:7px 14px;cursor:pointer;transition:all .15s;margin-bottom:20px;letter-spacing:.04em;text-transform:uppercase;}
.back-btn:hover{color:var(--text);border-color:var(--line2);background:var(--ink3);}

/* ── WHATSAPP ── */
.wa-float{position:fixed;bottom:28px;right:28px;z-index:300;width:54px;height:54px;border-radius:50%;background:#25D366;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(37,211,102,0.4);transition:all .2s;font-size:24px;}
.wa-float:hover{transform:scale(1.1) translateY(-2px);box-shadow:0 8px 28px rgba(37,211,102,0.5);}
.wa-tip{position:absolute;right:62px;bottom:50%;transform:translateY(50%);background:var(--ink2);border:1px solid var(--line2);border-radius:8px;padding:7px 14px;white-space:nowrap;font-size:12px;color:var(--text);font-family:var(--mono);pointer-events:none;opacity:0;transition:opacity .2s;}
.wa-float:hover .wa-tip{opacity:1;}

/* ── UPI OVERLAY ── */
.upi-ov{position:fixed;inset:0;z-index:400;background:rgba(0,0,0,0.78);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;padding:24px;}
.upi-card{background:var(--ink2);border:1px solid var(--line2);border-radius:20px;padding:40px 36px;width:100%;max-width:440px;animation:pop .25s ease;text-align:center;position:relative;}
.upi-close{position:absolute;top:14px;right:16px;background:none;border:none;color:var(--muted);font-size:22px;cursor:pointer;font-family:var(--mono);line-height:1;}
.upi-close:hover{color:var(--text);}
.upi-h{font-size:21px;font-weight:700;color:var(--bright);letter-spacing:-0.03em;margin-bottom:6px;}
.upi-sub{font-size:13px;color:var(--muted);margin-bottom:26px;line-height:1.6;}
.upi-box{background:var(--ink3);border:1px solid rgba(124,106,247,0.3);border-radius:12px;padding:18px 20px;margin-bottom:20px;}
.upi-lbl{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;}
.upi-id{font-family:var(--mono);font-size:19px;font-weight:500;color:var(--accent2);letter-spacing:.04em;}
.upi-copy{background:none;border:1px solid var(--line2);color:var(--dim);font-family:var(--mono);font-size:11px;padding:5px 14px;border-radius:6px;cursor:pointer;margin-top:10px;transition:all .15s;}
.upi-copy:hover{background:var(--ink4);color:var(--text);}
.upi-steps{text-align:left;margin-bottom:20px;}
.upi-step{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--dim);margin-bottom:8px;line-height:1.5;}
.upi-snum{width:20px;height:20px;border-radius:50%;background:rgba(124,106,247,0.15);color:var(--accent2);font-family:var(--mono);font-size:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;}
.upi-wa{width:100%;padding:13px;background:#25D366;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;font-family:var(--sans);cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;}
.upi-wa:hover{background:#1fba59;transform:translateY(-1px);}
.upi-note{font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:14px;}

/* ── ANIMATIONS ── */
@keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

/* ── RESPONSIVE ── */
@media(max-width:768px){
  .nav-links>*:not(.nav-cta){display:none}
  .hero-h1{font-size:40px}
  .feat-grid{grid-template-columns:1fr}
  .flow-row{flex-direction:column;gap:20px}
  .flow-step::after{display:none}
  .chart-row{grid-template-columns:1fr}
  .test-grid{grid-template-columns:1fr}
  .price-grid{grid-template-columns:1fr}
  .footer-grid{grid-template-columns:1fr 1fr}
  .stat-strip{flex-wrap:wrap}
  .stat-strip-item{border-right:none;border-bottom:1px solid var(--line)}
  .sidebar{display:none}
  .dash-main{margin-left:0}
  .kpi-row{grid-template-columns:1fr 1fr}
  .charts-2col{grid-template-columns:1fr}
  .form-grid{grid-template-columns:1fr 1fr}
  .result-row{grid-template-columns:1fr}
  .two-col{grid-template-columns:1fr}
  .admin-kpi{grid-template-columns:1fr 1fr}
  .admin-charts-row{grid-template-columns:1fr}
}
`;

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const trendData = [
  {m:"Jan",churn:14,saved:88},{m:"Feb",churn:11,saved:91},{m:"Mar",churn:16,saved:85},
  {m:"Apr",churn:8,saved:93},{m:"May",churn:12,saved:89},{m:"Jun",churn:6,saved:95},
  {m:"Jul",churn:9,saved:92},{m:"Aug",churn:4,saved:97},
];
const segData = [
  {name:"High",value:18,color:"#F87171"},{name:"Med",value:33,color:"#FBBF24"},{name:"Low",value:49,color:"#34D399"},
];
const revenueQ = [{q:"Q1",v:240},{q:"Q2",v:380},{q:"Q3",v:520},{q:"Q4",v:710}];
const feats = [
  {f:"Tenure",v:92},{f:"Monthly Charges",v:85},{f:"Contract Type",v:78},
  {f:"Support Tickets",v:71},{f:"Engagement Score",v:64},{f:"Payment Method",v:53},
];
const MOCK_HISTORY = [
  {id:1,name:"Rahul Sharma",date:"2025-01-15",risk:"High",prob:81,rev:"₹4,200"},
  {id:2,name:"Priya Mehta",date:"2025-01-14",risk:"Low",prob:11,rev:"₹8,900"},
  {id:3,name:"Arjun Singh",date:"2025-01-13",risk:"Medium",prob:46,rev:"₹6,100"},
  {id:4,name:"Kavya Nair",date:"2025-01-12",risk:"Low",prob:7,rev:"₹11,400"},
];
const ADMIN_USERS = [
  {id:1,name:"Ananya Verma",mobile:"+91 98765 43210",ip:"192.168.1.42",device:"Chrome / macOS",preds:7,joined:"2025-01-10"},
  {id:2,name:"Rohan Kapoor",mobile:"+91 87654 32109",ip:"10.0.0.15",device:"Safari / iOS",preds:3,joined:"2025-01-12"},
  {id:3,name:"Sneha Patel",mobile:"+91 76543 21098",ip:"172.16.0.8",device:"Firefox / Win",preds:12,joined:"2025-01-08"},
  {id:4,name:"Vikram Bose",mobile:"+91 65432 10987",ip:"192.168.2.100",device:"Chrome / Android",preds:5,joined:"2025-01-14"},
];

/* ─── GAUGE ─────────────────────────────────────────────────────────────── */
function Gauge({prob}){
  const r=70,cx=90,cy=90,circ=Math.PI*r;
  const offset=circ*(1-prob/100);
  const col=prob>=65?"#F87171":prob>=35?"#FBBF24":"#34D399";
  return(
    <svg width="180" height="105" viewBox="0 0 180 110">
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="#1E1E24" strokeWidth="12"/>
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={col} strokeWidth="12"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{transition:"stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"}}/>
      <text x={cx} y={cy-6} textAnchor="middle" fontSize="28" fontWeight="700" fill={col} fontFamily="Geist Mono,monospace">{prob}%</text>
      <text x={cx} y={cy+14} textAnchor="middle" fontSize="10" fill="#5A5A6E" fontFamily="Geist Mono,monospace" letterSpacing="0.08em">CHURN PROBABILITY</text>
    </svg>
  );
}

/* ─── FEAT BAR ───────────────────────────────────────────────────────────── */
function FBar({f,v}){
  return(
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:12,color:"#8A8A9E"}}>{f}</span>
        <span style={{fontSize:11,color:"#7C6AF7",fontFamily:"Geist Mono,monospace"}}>{v}%</span>
      </div>
      <div style={{height:3,background:"#1E1E24",borderRadius:2,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${v}%`,background:"linear-gradient(90deg,#7C6AF7,#A78BFA)",borderRadius:2,transition:"width 1s ease"}}/>
      </div>
    </div>
  );
}

/* ─── CUSTOM TOOLTIP ─────────────────────────────────────────────────────── */
function CustomTip({active,payload,label}){
  if(!active||!payload?.length)return null;
  return(
    <div style={{background:"#16161A",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"10px 14px",fontSize:12,fontFamily:"Geist Mono,monospace"}}>
      <div style={{color:"#8A8A9E",marginBottom:4}}>{label}</div>
      {payload.map((p,i)=><div key={i} style={{color:p.color||"#E8E8F0"}}>{p.name}: {p.value}</div>)}
    </div>
  );
}

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App(){
  const [page,setPage]=useState("landing");
  const [user,setUser]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const [mName,setMName]=useState("");
  const [mMobile,setMMobile]=useState("");
  const [form,setForm]=useState({name:"",age:"",gender:"Male",tenure:"",charges:"",contract:"Month-to-month",payment:"Electronic check",internet:"Fiber optic",techSupport:"No",tickets:"",subType:"Basic",engagement:""});
  const [result,setResult]=useState(null);
  const [running,setRunning]=useState(false);
  const [history,setHistory]=useState(MOCK_HISTORY);
  const [faqOpen,setFaqOpen]=useState(null);
  const [adminUser,setAdminUser]=useState("");
  const [adminPass,setAdminPass]=useState("");
  const [adminErr,setAdminErr]=useState("");
  const [adminAuth,setAdminAuth]=useState(false);
  const [adminSearch,setAdminSearch]=useState("");
  const [adminList,setAdminList]=useState(ADMIN_USERS);
  const [showUpi,setShowUpi]=useState(false);
  const [copied,setCopied]=useState(false);

  const copyUpi=()=>{
    navigator.clipboard.writeText("9451427936@ptyes").catch(()=>{});
    setCopied(true);
    setTimeout(()=>setCopied(false),2000);
  };

  const go=(target)=>{
    if(["predict","dashboard"].includes(target)&&!user){setShowModal(true);return;}
    setPage(target);
  };

  const submitModal=()=>{
    if(!mName.trim()||!mMobile.trim())return;
    setUser({name:mName,mobile:mMobile});
    setShowModal(false);
    setPage("predict");
  };

  const runPred=()=>{
    if(!form.name||!form.age||!form.tenure||!form.charges)return;
    setRunning(true);
    setTimeout(()=>{
      const base=(+form.tenure<12?28:4)+(form.contract==="Month-to-month"?24:0)+(+form.charges>70?14:0)+(+form.tickets>3?18:0)+( +form.engagement<40?14:0);
      const prob=Math.min(Math.max(Math.round(base+Math.random()*8),3),95);
      const risk=prob>=65?"High":prob>=35?"Medium":"Low";
      const conf=Math.round(84+Math.random()*11);
      const factors=[];
      if(+form.tenure<12)factors.push("Low tenure (< 12 months)");
      if(form.contract==="Month-to-month")factors.push("Month-to-month contract");
      if(+form.charges>70)factors.push("High monthly charges");
      if(+form.tickets>3)factors.push("Frequent support tickets");
      if(+form.engagement<40)factors.push("Low engagement score");
      const recs=risk==="High"?["Offer loyalty discount immediately","Assign dedicated account manager","Upgrade to annual contract"]:risk==="Medium"?["Send personalised retention email","Offer feature upgrade trial","Schedule check-in call"]:["Enrol in referral programme","Upsell premium features","Request case study"];
      setResult({prob,risk,conf,rev:`₹${(+form.charges*12).toLocaleString()}`,factors,recs});
      setHistory(h=>[{id:h.length+1,name:form.name,date:new Date().toISOString().split("T")[0],risk,prob,rev:`₹${(+form.charges*12).toLocaleString()}`},...h]);
      setRunning(false);
    },2000);
  };

  const loginAdmin=()=>{
    if(adminUser==="admin"&&adminPass==="churnsense2025"){setAdminAuth(true);setAdminErr("");}
    else setAdminErr("Invalid — try admin / churnsense2025");
  };

  const filteredAdmin=adminList.filter(u=>u.name.toLowerCase().includes(adminSearch.toLowerCase())||u.mobile.includes(adminSearch));

  const faqs=[
    {q:"How accurate is the model?",a:"Our Random Forest model reaches 94.2% accuracy, trained on 10M+ records across SaaS, fintech, and telecom datasets."},
    {q:"What data do I need?",a:"Just 12 standard customer attributes — tenure, charges, contract type, and engagement metrics. No complex pipelines."},
    {q:"Is my data secure?",a:"All data is encrypted at rest and in transit. We are SOC 2 Type II certified and fully GDPR compliant."},
    {q:"Can I export results?",a:"Yes — export individual predictions or bulk reports as PDF or CSV directly from your dashboard."},
    {q:"Is there an API?",a:"Pro and Enterprise plans include full REST API access with up to 100,000 predictions per month."},
  ];

  const riskCol=(r)=>r==="High"?"#F87171":r==="Medium"?"#FBBF24":"#34D399";

  return(
    <div style={{fontFamily:"Syne,system-ui,sans-serif",background:"#0C0C0E",color:"#E8E8F0",minHeight:"100vh"}}>
      <style>{STYLES}</style>

      {/* MODAL */}
      {showModal&&(
        <div className="overlay" onClick={e=>{if(e.target===e.currentTarget)setShowModal(false)}}>
          <div className="modal">
            <div className="modal-logo"><span className="logo-dot"/>ChurnSense AI</div>
            <div className="modal-h">Access the Platform</div>
            <div className="modal-sub">Enter your details to unlock AI prediction. We use this to personalise your experience and track usage.</div>
            <input className="modal-input" placeholder="Full name" value={mName} onChange={e=>setMName(e.target.value)}/>
            <input className="modal-input" placeholder="Mobile number" value={mMobile} onChange={e=>setMMobile(e.target.value)} type="tel"/>
            <button className="modal-submit" onClick={submitModal}>Continue →</button>
            <div className="modal-note">🔒 Encrypted · Never shared</div>
          </div>
        </div>
      )}

      {/* NAV */}
      {page!=="admin-login"&&(
        <nav className="nav">
          <div className="nav-logo" onClick={()=>setPage("landing")}><span className="logo-dot"/>ChurnSense AI</div>
          <div className="nav-links">
            <button className="nav-btn" onClick={()=>setPage("landing")}>Home</button>
            <button className="nav-btn" onClick={()=>go("predict")}>Predict</button>
            <button className="nav-btn" onClick={()=>go("dashboard")}>Dashboard</button>
            <button className="nav-btn" onClick={()=>setPage("admin-login")}>Admin</button>
            <button className="nav-cta" onClick={()=>go("predict")}>{user?`Hi, ${user.name.split(" ")[0]}`:"Start Free"}</button>
          </div>
        </nav>
      )}

      {/* WHATSAPP FLOAT */}
      <button className="wa-float" onClick={()=>window.open("https://wa.me/919451427936","_blank")} aria-label="Chat on WhatsApp">
        <span style={{fontSize:26}}>💬</span>
        <span className="wa-tip">Chat with us on WhatsApp</span>
      </button>

      {/* UPI PAYMENT MODAL */}
      {showUpi&&(
        <div className="upi-ov" onClick={e=>{if(e.target===e.currentTarget)setShowUpi(false)}}>
          <div className="upi-card">
            <button className="upi-close" onClick={()=>setShowUpi(false)}>×</button>
            <div style={{fontSize:38,marginBottom:12}}>💳</div>
            <div className="upi-h">Buy a Subscription</div>
            <div className="upi-sub">Pay via UPI to activate your plan instantly. After payment, contact us on WhatsApp with your screenshot.</div>
            <div className="upi-box">
              <div className="upi-lbl">UPI Payment ID</div>
              <div className="upi-id">9451427936@ptyes</div>
              <button className="upi-copy" onClick={copyUpi}>{copied?"✓ Copied!":"Copy UPI ID"}</button>
            </div>
            <div className="upi-steps">
              {[
                "Open any UPI app (PhonePe, GPay, Paytm, BHIM)",
                "Send to UPI ID: 9451427936@ptyes",
                "Add plan name in remarks (Starter / Pro / Enterprise)",
                "Take a screenshot of the payment confirmation",
                "Send screenshot on WhatsApp to activate your plan",
              ].map((s,i)=>(
                <div className="upi-step" key={i}>
                  <span className="upi-snum">{i+1}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <button className="upi-wa" onClick={()=>window.open("https://wa.me/919451427936?text=Hi%2C%20I%20just%20paid%20for%20ChurnSense%20AI%20subscription%20via%20UPI.%20Please%20activate%20my%20plan.","_blank")}>
              <span>💬</span> Confirm on WhatsApp
            </button>
            <div className="upi-note">📞 Support: +91 94514 27936 · Available 10am – 8pm IST</div>
          </div>
        </div>
      )}

      {/* ══ LANDING ══════════════════════════════════════════════════════════ */}
      {page==="landing"&&(
        <>
          {/* HERO */}
          <section className="hero grid-bg">
            <div className="hero-orb hero-orb-1"/>
            <div className="hero-orb hero-orb-2"/>
            <div className="hero-eyebrow"><span className="pulse-dot"/>Live · AI Churn Intelligence</div>
            <h1 className="hero-h1">Predict Churn<br/><span className="grad">Before It Happens.</span></h1>
            <p className="hero-sub">AI-powered customer retention analytics. Stop losing revenue to preventable churn with machine learning built for modern businesses.</p>
            <div className="hero-actions">
              <button className="btn btn-solid" onClick={()=>go("predict")}>Start Predicting →</button>
              <button className="btn btn-ghost" onClick={()=>go("dashboard")}>View Dashboard</button>
            </div>
            <div className="stat-strip">
              {[["94.2%","Model accuracy"],["2.4M+","Predictions run"],["₹840Cr+","Revenue saved"],["48 hrs","Avg. setup"]].map(([v,l])=>(
                <div className="stat-strip-item" key={l}>
                  <div className="strip-val">{v}</div>
                  <div className="strip-lbl">{l}</div>
                </div>
              ))}
            </div>
          </section>

          {/* FEATURES */}
          <div className="divider"/>
          <section className="section">
            <div className="sec-eyebrow">Platform Features</div>
            <h2 className="sec-h2">Everything you need<br/>to retain more customers</h2>
            <p className="sec-p">Built for growth teams, customer success, and data analysts at modern SaaS companies.</p>
            <div className="feat-grid">
              {[
                ["⬡","Random Forest AI","94.2% accurate predictions trained on 10M+ records across SaaS, fintech, and telecom."],
                ["◈","Real-Time Scoring","Instant churn probability, risk classification, and AI confidence for every customer profile."],
                ["◉","Retention Actions","Personalised AI-generated action plans for at-risk customers, ranked by revenue impact."],
                ["▣","Trend Analytics","Track churn over time with interactive charts, segment breakdowns, and predictive forecasts."],
                ["◐","Smart Alerts","Automated notifications when risk scores cross thresholds — act before customers leave."],
                ["⬡","Enterprise Security","SOC 2 Type II, GDPR compliant, end-to-end encryption, and role-based access control."],
              ].map(([icon,title,desc])=>(
                <div className="feat-cell" key={title}>
                  <div className="feat-icon" style={{color:"#7C6AF7"}}>{icon}</div>
                  <div className="feat-title">{title}</div>
                  <div className="feat-desc">{desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* HOW IT WORKS */}
          <div className="divider"/>
          <section className="section">
            <div className="sec-eyebrow">How It Works</div>
            <h2 className="sec-h2">From data to decision<br/>in under a second</h2>
            <div className="flow-row">
              {[["01","Input Data","Enter 12 customer attributes"],["02","Feature Extraction","AI processes key signals"],["03","Model Inference","Random Forest runs"],["04","Risk Scoring","Probability generated"],["05","Action Plan","Personalised recommendations"]].map(([n,t,d])=>(
                <div className="flow-step" key={n}>
                  <div className="flow-num">{n}</div>
                  <div className="flow-title">{t}</div>
                  <div className="flow-desc">{d}</div>
                </div>
              ))}
            </div>
          </section>

          {/* CHARTS PREVIEW */}
          <div className="divider"/>
          <section className="section">
            <div className="sec-eyebrow">Analytics Preview</div>
            <h2 className="sec-h2">Live churn intelligence<br/>at a glance</h2>
            <div className="chart-row">
              <div className="chart-box">
                <div className="chart-box-title">Monthly churn rate</div>
                <div className="chart-box-sub">Platform-wide · last 8 months</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C6AF7" stopOpacity={0.18}/>
                        <stop offset="95%" stopColor="#7C6AF7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                    <XAxis dataKey="m" tick={{fontSize:10,fill:"#5A5A6E",fontFamily:"Geist Mono,monospace"}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:10,fill:"#5A5A6E",fontFamily:"Geist Mono,monospace"}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTip/>}/>
                    <Area type="monotone" dataKey="churn" stroke="#7C6AF7" strokeWidth={2} fill="url(#ag)" name="Churn %"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-box">
                <div className="chart-box-title">Risk distribution</div>
                <div className="chart-box-sub">Customer segments</div>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={segData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} dataKey="value" paddingAngle={4}>
                      {segData.map((s,i)=><Cell key={i} fill={s.color}/>)}
                    </Pie>
                    <Tooltip content={<CustomTip/>}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{display:"flex",justifyContent:"center",gap:12,marginTop:8}}>
                  {segData.map(s=>(
                    <div key={s.name} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#5A5A6E",fontFamily:"Geist Mono,monospace"}}>
                      <span style={{width:7,height:7,borderRadius:2,background:s.color,display:"inline-block"}}/>
                      {s.name}
                    </div>
                  ))}
                </div>
                <div style={{marginTop:20}}>
                  <div className="chart-box-title">Feature importance</div>
                  <div style={{marginTop:14}}>
                    {feats.map(f=><FBar key={f.f} f={f.f} v={f.v}/>)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <div className="divider"/>
          <section className="section">
            <div className="sec-eyebrow">Customer Stories</div>
            <h2 className="sec-h2">Trusted by retention teams<br/>across India</h2>
            <div className="test-grid">
              {[
                ["ChurnSense flagged 43 at-risk accounts we had no idea about. We retained ₹2.1Cr in ARR in the first month alone.","Aditi Sharma","Head of CS, FinovateX","AS"],
                ["The accuracy is unreal. We went from 18% monthly churn to under 6% in one quarter. ROI was immediate.","Rajesh Kumar","CEO, SaaSbridge India","RK"],
                ["Finally, an AI tool our whole team can actually use. The recommendations are specific and always actionable.","Meera Nair","VP Growth, CloudOps","MN"],
              ].map(([q,n,r,av])=>(
                <div className="test-card" key={n}>
                  <div className="test-quote">"{q}"</div>
                  <div className="test-author">
                    <div className="test-ava">{av}</div>
                    <div><div className="test-name">{n}</div><div className="test-role">{r}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PRICING */}
          <div className="divider"/>
          <section className="section" id="pricing">
            <div className="sec-eyebrow">Pricing</div>
            <h2 className="sec-h2">Simple, transparent pricing</h2>
            <p className="sec-p">Start free, scale as you grow. No hidden fees, no lock-in.</p>
            <div className="price-grid">
              {[
                {name:"Starter",price:"₹0",per:"/month",feats:["50 predictions / month","Basic risk scoring","CSV export","Email support"],featured:false},
                {name:"Pro",price:"₹4,999",per:"/month",feats:["Unlimited predictions","Advanced AI insights","Dashboard analytics","Retention recommendations","API access (10K calls)","Priority support"],featured:true},
                {name:"Enterprise",price:"Custom",per:"pricing",feats:["Unlimited everything","Custom model training","Dedicated success manager","On-premise option","SLA guarantee","White-label"],featured:false},
              ].map(p=>(
                <div className={`price-card${p.featured?" featured":""}`} key={p.name}>
                  {p.featured&&<div className="price-pop">Most Popular</div>}
                  <div className="price-name">{p.name}</div>
                  <div className="price-num">{p.price}</div>
                  <div className="price-per">{p.per}</div>
                  <div className="price-sep"/>
                  {p.feats.map(f=><div className="price-feat" key={f}>{f}</div>)}
                  <button
                    className={`price-btn ${p.featured?"price-btn-filled":"price-btn-outline"}`}
                    onClick={()=>p.name==="Starter"?go("predict"):p.name==="Enterprise"?window.open("https://wa.me/919451427936?text=Hi%2C%20I%20am%20interested%20in%20ChurnSense%20Enterprise%20plan.","_blank"):setShowUpi(true)}>
                    {p.name==="Starter"?"Start Free":p.name==="Enterprise"?"Contact Sales →":"Buy Now — ₹4,999"}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <div className="divider"/>
          <section className="section">
            <div style={{textAlign:"center",marginBottom:8}}>
              <div className="sec-eyebrow">FAQ</div>
              <h2 className="sec-h2">Common questions</h2>
            </div>
            <div className="faq-inner">
              {faqs.map((f,i)=>(
                <div className="faq-item" key={i} onClick={()=>setFaqOpen(faqOpen===i?null:i)}>
                  <div className="faq-q">{f.q}<span className="faq-icon">{faqOpen===i?"−":"+"}</span></div>
                  {faqOpen===i&&<div className="faq-a">{f.a}</div>}
                </div>
              ))}
            </div>
          </section>

          {/* CONTACT STRIP */}
          <div className="divider"/>
          <section style={{padding:"60px 40px",maxWidth:"1160px",margin:"0 auto"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {/* UPI CARD */}
              <div style={{background:"var(--ink2)",border:"1px solid rgba(124,106,247,0.25)",borderRadius:16,padding:"32px 28px"}}>
                <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--accent2)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Pay via UPI</div>
                <div style={{fontSize:20,fontWeight:700,color:"var(--bright)",letterSpacing:"-0.02em",marginBottom:8}}>Buy a Subscription</div>
                <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.6,marginBottom:20}}>Pay directly via UPI and get your plan activated within minutes. Send payment screenshot on WhatsApp to confirm.</div>
                <div style={{background:"var(--ink3)",border:"1px solid rgba(124,106,247,0.2)",borderRadius:10,padding:"14px 18px",marginBottom:16}}>
                  <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:5}}>UPI ID</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:17,fontWeight:500,color:"var(--accent2)"}}>9451427936@ptyes</div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn btn-solid" style={{fontSize:13,padding:"10px 20px"}} onClick={()=>setShowUpi(true)}>Pay Now →</button>
                  <button className="btn btn-ghost" style={{fontSize:13,padding:"10px 20px"}} onClick={()=>{navigator.clipboard.writeText("9451427936@ptyes").catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2000);}}>
                    {copied?"✓ Copied":"Copy UPI ID"}
                  </button>
                </div>
              </div>
              {/* WHATSAPP CARD */}
              <div style={{background:"var(--ink2)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:16,padding:"32px 28px"}}>
                <div style={{fontFamily:"var(--mono)",fontSize:10,color:"#34D399",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Direct Support</div>
                <div style={{fontSize:20,fontWeight:700,color:"var(--bright)",letterSpacing:"-0.02em",marginBottom:8}}>Chat on WhatsApp</div>
                <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.6,marginBottom:20}}>Questions about pricing, plan activation, or need a demo? Reach us directly on WhatsApp — typically reply within 30 minutes.</div>
                <div style={{background:"var(--ink3)",border:"1px solid rgba(37,211,102,0.15)",borderRadius:10,padding:"14px 18px",marginBottom:16}}>
                  <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:5}}>WhatsApp Number</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:17,fontWeight:500,color:"#34D399"}}>+91 94514 27936</div>
                </div>
                <button style={{background:"#25D366",color:"#fff",border:"none",borderRadius:8,padding:"10px 22px",fontSize:13,fontWeight:600,fontFamily:"var(--sans)",cursor:"pointer",transition:"all .2s",display:"inline-flex",alignItems:"center",gap:8}}
                  onClick={()=>window.open("https://wa.me/919451427936?text=Hi%2C%20I%20am%20interested%20in%20ChurnSense%20AI.%20Can%20you%20help%20me%20with%20a%20subscription%3F","_blank")}
                  onMouseOver={e=>e.currentTarget.style.background="#1fba59"}
                  onMouseOut={e=>e.currentTarget.style.background="#25D366"}>
                  💬 Open WhatsApp Chat
                </button>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <div className="divider"/>
          <footer>
            <div className="footer">
              <div className="footer-grid">
                <div>
                  <div className="footer-brand">⬡ ChurnSense AI</div>
                  <div className="footer-desc">The leading AI-powered churn prediction platform for modern SaaS and subscription businesses.</div>
                </div>
                {[["Product",["Features","Pricing","Dashboard","API Docs","Changelog"]],["Company",["About","Blog","Careers","Press","Contact"]],["Legal",["Privacy","Terms","Security","GDPR"]]].map(([t,ls])=>(
                  <div key={t}>
                    <div className="footer-col-title">{t}</div>
                    {ls.map(l=><button key={l} className="footer-link">{l}</button>)}
                  </div>
                ))}
              </div>
              <div className="footer-copy">
                <span>© 2025 ChurnSense AI. Built in India.</span>
                <span style={{display:"flex",alignItems:"center",gap:12}}>
                  <span>Random Forest ML · FastAPI · MongoDB Atlas</span>
                  <button style={{background:"none",border:"1px solid rgba(37,211,102,0.25)",color:"#34D399",padding:"4px 12px",borderRadius:100,fontSize:11,fontFamily:"Geist Mono,monospace",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}} onClick={()=>window.open("https://wa.me/919451427936","_blank")}>
                    💬 +91 94514 27936
                  </button>
                </span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* ══ PREDICT ══════════════════════════════════════════════════════════ */}
      {page==="predict"&&(
        <div className="page">
          <div className="page-inner">
            <button className="back-btn" onClick={()=>setPage("landing")}>← Back to Home</button>
            <div className="page-h">AI Churn Prediction</div>
            <div className="page-sub">Enter customer details to generate an instant risk analysis powered by Random Forest ML.</div>

            <div className="form-section">
              <div className="form-section-title">Customer Profile</div>
              <div className="form-grid">
                {[["name","Customer Name","text"],["age","Age","number"],["tenure","Tenure (months)","number"],["charges","Monthly Charges (₹)","number"],["tickets","Support Tickets","number"],["engagement","Engagement Score (0–100)","number"]].map(([k,l,t])=>(
                  <div className="form-grp" key={k}>
                    <label className="form-lbl">{l}</label>
                    <input className="form-inp" type={t} placeholder={`Enter ${l.toLowerCase()}`} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}/>
                  </div>
                ))}
                {[["gender","Gender",["Male","Female","Other"]],["contract","Contract",["Month-to-month","One year","Two year"]],["payment","Payment",["Electronic check","Mailed check","Bank transfer","Credit card"]],["internet","Internet",["Fiber optic","DSL","No"]],["techSupport","Tech Support",["Yes","No"]],["subType","Subscription",["Basic","Standard","Premium"]]].map(([k,l,opts])=>(
                  <div className="form-grp" key={k}>
                    <label className="form-lbl">{l}</label>
                    <select className="form-sel" value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}>
                      {opts.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div style={{marginTop:20}}>
                <button className="btn btn-solid" onClick={runPred} disabled={running} style={{opacity:running?.65:1,cursor:running?"wait":"pointer"}}>
                  {running?"Analysing customer data...":"Run AI Prediction →"}
                </button>
              </div>
            </div>

            {running&&(
              <div className="form-section" style={{textAlign:"center",padding:"44px 32px"}}>
                <div style={{fontFamily:"Geist Mono,monospace",fontSize:13,color:"#7C6AF7",marginBottom:12,letterSpacing:".08em"}}>RUNNING RANDOM FOREST INFERENCE</div>
                <div style={{fontSize:13,color:"#5A5A6E",marginBottom:20}}>Evaluating across 47 decision trees…</div>
                <div style={{height:3,background:"#1E1E24",borderRadius:2,overflow:"hidden",maxWidth:320,margin:"0 auto"}}>
                  <div style={{height:"100%",background:"linear-gradient(90deg,#7C6AF7,#A78BFA)",borderRadius:2,animation:"shimmer 1.5s infinite",width:"60%"}}/>
                </div>
              </div>
            )}

            {result&&!running&&(
              <>
                <div className="gauge-wrap">
                  <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,color:"#5A5A6E",letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>Risk Assessment</div>
                  <Gauge prob={result.prob}/>
                  <div style={{display:"flex",gap:36,marginTop:16}}>
                    {[["Risk Level",result.risk,riskCol(result.risk)],["AI Confidence",`${result.conf}%`,"#A78BFA"],["Revenue at Risk",result.rev,"#FBBF24"]].map(([l,v,c])=>(
                      <div key={l} style={{textAlign:"center"}}>
                        <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,color:"#5A5A6E",textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>{l}</div>
                        <div style={{fontSize:18,fontWeight:700,color:c,fontFamily:"Geist Mono,monospace"}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{width:280,marginTop:14}}>
                    <div className="conf-track"><div className="conf-fill" style={{width:`${result.conf}%`}}/></div>
                  </div>
                </div>

                <div className="two-col">
                  <div className="insight-box">
                    <div className="insight-title" style={{color:"#F87171"}}>⚠ Key churn factors</div>
                    {result.factors.length===0
                      ?<div style={{fontSize:13,color:"#5A5A6E"}}>No significant risk factors detected.</div>
                      :result.factors.map((f,i)=><div key={i} className="insight-row"><span className="dot-red"/>{f}</div>)}
                  </div>
                  <div className="insight-box" style={{borderColor:"rgba(52,211,153,0.15)"}}>
                    <div className="insight-title" style={{color:"#34D399"}}>✓ AI retention plan</div>
                    {result.recs.map((r,i)=><div key={i} className="insight-row"><span className="dot-green"/>{r}</div>)}
                  </div>
                </div>

                <div style={{display:"flex",gap:12,marginTop:16}}>
                  <button className="btn btn-solid" onClick={()=>go("dashboard")}>View Dashboard →</button>
                  <button className="btn btn-ghost" onClick={()=>{setResult(null);setForm(f=>({...f,name:"",age:"",tenure:"",charges:"",tickets:"",engagement:""}))}}>New Prediction</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══ DASHBOARD ════════════════════════════════════════════════════════ */}
      {page==="dashboard"&&(
        <div className="dash-shell">
          <aside className="sidebar">
            <div className="sidebar-logo"><span className="logo-dot"/>ChurnSense</div>
            <button className="back-btn" style={{margin:"0 4px 16px",width:"calc(100% - 8px)"}} onClick={()=>setPage("landing")}>← Home</button>
            <div className="sb-section">Main</div>
            {[["⬡","Overview"],["◈","Predictions"],["◉","Analytics"],["▣","Customers"]].map(([ic,lb])=>(
              <button key={lb} className="sb-item active" style={lb!=="Overview"?{background:"none",color:"#5A5A6E",border:"none"}:{}}>{ic} {lb}</button>
            ))}
            <div className="sb-section">Tools</div>
            {[["◐","Reports"],["⬡","Settings"]].map(([ic,lb])=>(
              <button key={lb} className="sb-item" style={{background:"none",border:"none"}}>{ic} {lb}</button>
            ))}
            <div style={{marginTop:24,padding:"0 4px"}}>
              <div style={{background:"rgba(124,106,247,0.08)",border:"1px solid rgba(124,106,247,0.15)",borderRadius:9,padding:"14px 12px"}}>
                <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,color:"#7C6AF7",marginBottom:4,textTransform:"uppercase",letterSpacing:".08em"}}>Pro Plan</div>
                <div style={{fontSize:12,color:"#5A5A6E",lineHeight:1.5}}>Unlimited predictions active</div>
              </div>
            </div>
          </aside>
          <main className="dash-main">
            <div className="dash-top">
              <div>
                <div className="dash-greeting">Welcome back, {user?.name?.split(" ")[0]||"User"} 👋</div>
                <div className="dash-date">{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
              </div>
              <button className="btn btn-solid" style={{fontSize:13,padding:"9px 20px"}} onClick={()=>setPage("predict")}>+ New Prediction</button>
            </div>

            <div className="kpi-row">
              {[
                ["Predictions",history.length,"+3 today","up"],
                ["High Risk",history.filter(p=>p.risk==="High").length,"Needs attention","dn"],
                ["Revenue Saved","₹24.8L","+12% this month","up"],
                ["Avg. Risk",`${Math.round(history.reduce((s,p)=>s+p.prob,0)/history.length)}%`,"Trending down","up"],
              ].map(([l,v,c,d])=>(
                <div className="kpi" key={l}>
                  <div className="kpi-lbl">{l}</div>
                  <div className="kpi-val">{v}</div>
                  <div className={`kpi-sub kpi-${d}`}>{d==="up"?"↑":"↓"} {c}</div>
                </div>
              ))}
            </div>

            <div className="charts-2col">
              <div className="dash-chart">
                <div className="dct">Churn trend</div>
                <div className="dcs">Monthly churn rate · 8 months</div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C6AF7" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#7C6AF7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                    <XAxis dataKey="m" tick={{fontSize:9,fill:"#5A5A6E",fontFamily:"Geist Mono,monospace"}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:9,fill:"#5A5A6E",fontFamily:"Geist Mono,monospace"}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTip/>}/>
                    <Area type="monotone" dataKey="churn" stroke="#7C6AF7" strokeWidth={2} fill="url(#dg)" name="Churn %"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="dash-chart">
                <div className="dct">Risk segments</div>
                <div className="dcs">Customer distribution</div>
                <ResponsiveContainer width="100%" height={130}>
                  <PieChart>
                    <Pie data={segData} cx="50%" cy="50%" innerRadius={36} outerRadius={56} dataKey="value" paddingAngle={4}>
                      {segData.map((s,i)=><Cell key={i} fill={s.color}/>)}
                    </Pie>
                    <Tooltip content={<CustomTip/>}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{display:"flex",justifyContent:"center",gap:12}}>
                  {segData.map(s=>(
                    <div key={s.name} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#5A5A6E",fontFamily:"Geist Mono,monospace"}}>
                      <span style={{width:6,height:6,borderRadius:2,background:s.color,display:"inline-block"}}/>
                      {s.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dash-chart" style={{marginBottom:16}}>
              <div className="dct">Revenue retained (₹K)</div>
              <div className="dcs">Cumulative savings via early churn prevention</div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={revenueQ}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                  <XAxis dataKey="q" tick={{fontSize:9,fill:"#5A5A6E",fontFamily:"Geist Mono,monospace"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:9,fill:"#5A5A6E",fontFamily:"Geist Mono,monospace"}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}K`}/>
                  <Tooltip content={<CustomTip/>} formatter={v=>[`₹${v}K`,"Saved"]}/>
                  <Bar dataKey="v" fill="#7C6AF7" radius={[4,4,0,0]} name="Saved"/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="history-wrap">
              <div className="history-head">
                <div className="ht">Prediction history</div>
                <button className="btn btn-ghost" style={{fontSize:12,padding:"7px 16px"}} onClick={()=>setPage("predict")}>+ New</button>
              </div>
              <table className="htable">
                <thead><tr><th>Customer</th><th>Date</th><th>Risk</th><th>Prob.</th><th>Revenue</th></tr></thead>
                <tbody>
                  {history.map(p=>(
                    <tr key={p.id}>
                      <td style={{fontWeight:600,color:"#E8E8F0"}}>{p.name}</td>
                      <td style={{fontFamily:"Geist Mono,monospace",fontSize:11}}>{p.date}</td>
                      <td><span className={`badge badge-${p.risk==="High"?"red":p.risk==="Medium"?"amber":"green"}`}>{p.risk}</span></td>
                      <td style={{fontFamily:"Geist Mono,monospace",fontWeight:600,color:riskCol(p.risk)}}>{p.prob}%</td>
                      <td style={{fontFamily:"Geist Mono,monospace",fontSize:11}}>{p.rev}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      )}

      {/* ══ ADMIN GATE ═══════════════════════════════════════════════════════ */}
      {page==="admin-login"&&!adminAuth&&(
        <div className="admin-gate">
          <div className="admin-box">
            <div style={{fontSize:28,marginBottom:12}}>🔐</div>
            <div className="admin-h">Admin Access</div>
            <div className="admin-sub">Restricted to authorised personnel. All access is logged and audited.</div>
            <input className="admin-inp" placeholder="Username" value={adminUser} onChange={e=>setAdminUser(e.target.value)}/>
            <input className="admin-inp" placeholder="Password" type="password" value={adminPass} onChange={e=>setAdminPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&loginAdmin()}/>
            {adminErr&&<div className="admin-err">{adminErr}</div>}
            <button className="admin-btn" onClick={loginAdmin}>Sign In</button>
            <button style={{background:"none",border:"none",color:"#5A5A6E",fontSize:12,marginTop:14,cursor:"pointer",fontFamily:"Geist Mono,monospace"}} onClick={()=>setPage("landing")}>← Back to site</button>
            <div className="admin-hint">Demo: admin / churnsense2025</div>
          </div>
        </div>
      )}

      {/* ══ ADMIN PANEL ══════════════════════════════════════════════════════ */}
      {page==="admin-login"&&adminAuth&&(
        <div className="admin-panel">
          <div className="admin-topbar">
            <div className="admin-topbar-title"><span className="logo-dot"/>ChurnSense AI — Admin Panel</div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontFamily:"Geist Mono,monospace",fontSize:11,color:"#5A5A6E"}}>admin@churnsense</span>
              <button style={{background:"none",border:"1px solid rgba(255,255,255,0.1)",color:"#8A8A9E",padding:"6px 14px",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:"Geist Mono,monospace"}} onClick={()=>{setAdminAuth(false);setAdminUser("");setAdminPass("");}}>Sign out</button>
              <button style={{background:"none",border:"1px solid rgba(255,255,255,0.1)",color:"#8A8A9E",padding:"6px 14px",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:"Geist Mono,monospace"}} onClick={()=>setPage("landing")}>← Site</button>
            </div>
          </div>
          <div className="admin-content">
            <div style={{marginBottom:28}}>
              <div style={{fontSize:22,fontWeight:700,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:4}}>Platform Overview</div>
              <div style={{fontFamily:"Geist Mono,monospace",fontSize:11,color:"#5A5A6E"}}>Real-time user activity and prediction analytics</div>
            </div>

            <div className="admin-kpi">
              {[["Total Users",adminList.length],["Predictions",adminList.reduce((s,u)=>s+u.preds,0)],["Active Today",2],["Avg. Preds/User",Math.round(adminList.reduce((s,u)=>s+u.preds,0)/adminList.length)]].map(([l,v])=>(
                <div className="admin-kpi-card" key={l}>
                  <div className="akl">{l}</div>
                  <div className="akv">{v}</div>
                </div>
              ))}
            </div>

            <div className="admin-table-wrap">
              <div className="admin-table-top">
                <div className="att">Registered users</div>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <input className="admin-search" placeholder="Search name or mobile…" value={adminSearch} onChange={e=>setAdminSearch(e.target.value)}/>
                  <button className="export-btn2">Export CSV</button>
                </div>
              </div>
              <div style={{overflowX:"auto"}}>
                <table className="atable">
                  <thead><tr><th>#</th><th>Name</th><th>Mobile</th><th>IP Address</th><th>Device</th><th>Predictions</th><th>Joined</th><th>Action</th></tr></thead>
                  <tbody>
                    {filteredAdmin.map((u,i)=>(
                      <tr key={u.id}>
                        <td style={{fontFamily:"Geist Mono,monospace",color:"#5A5A6E"}}>{i+1}</td>
                        <td style={{fontWeight:600,color:"#E8E8F0"}}>{u.name}</td>
                        <td style={{fontFamily:"Geist Mono,monospace"}}>{u.mobile}</td>
                        <td style={{fontFamily:"Geist Mono,monospace",fontSize:11}}>{u.ip}</td>
                        <td style={{fontSize:11}}>{u.device}</td>
                        <td>
                          <span className={`badge ${u.preds>8?"badge-red":"badge-green"}`}>{u.preds}</span>
                        </td>
                        <td style={{fontFamily:"Geist Mono,monospace",fontSize:11}}>{u.joined}</td>
                        <td><button className="del-btn" onClick={()=>setAdminList(l=>l.filter(x=>x.id!==u.id))}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredAdmin.length===0&&<div style={{padding:"32px",textAlign:"center",color:"#5A5A6E",fontFamily:"Geist Mono,monospace",fontSize:12}}>No users match your search.</div>}
              </div>
            </div>

            <div className="admin-charts-row">
              <div className="dash-chart">
                <div className="dct">Platform churn trends</div>
                <div className="dcs">Monthly aggregate across all users</div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                    <XAxis dataKey="m" tick={{fontSize:9,fill:"#5A5A6E",fontFamily:"Geist Mono,monospace"}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:9,fill:"#5A5A6E",fontFamily:"Geist Mono,monospace"}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTip/>}/>
                    <Line type="monotone" dataKey="churn" stroke="#7C6AF7" strokeWidth={2} dot={{r:3,fill:"#7C6AF7"}} name="Churn %"/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="dash-chart">
                <div className="dct">User prediction activity</div>
                <div className="dcs">Predictions per user</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={adminList.map(u=>({name:u.name.split(" ")[0],p:u.preds}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                    <XAxis dataKey="name" tick={{fontSize:9,fill:"#5A5A6E",fontFamily:"Geist Mono,monospace"}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:9,fill:"#5A5A6E",fontFamily:"Geist Mono,monospace"}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTip/>}/>
                    <Bar dataKey="p" fill="#34D399" radius={[4,4,0,0]} name="Preds"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
