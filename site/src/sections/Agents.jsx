import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import {
  Search, Stethoscope, Workflow, PenLine, Calculator, Handshake, ShieldCheck, FileText, Terminal as TerminalIcon,
  ArrowUpRight, Crown, Telescope, ChartColumn, FolderKanban, CalendarCheck,
} from "lucide-react";
import { OrbitingCircles } from "../components/ui/orbiting-circles";
import { SpotlightCard } from "../components/ui/spotlight-card";
import { TextAnimation } from "../components/ui/text-animation";
import { cn } from "../lib/utils";
import { REPO } from "./Nav";

const INNER = [[Search, "prospector"], [Stethoscope, "diagnosticador"], [Workflow, "arquiteto"]];
const OUTER = [[PenLine, "redator"], [Calculator, "orçamentista"], [Handshake, "gestor-cliente"], [ShieldCheck, "auditor"], [FileText, "documentador"]];
const SKILLS = ["auditoria-seo-geo", "pesquisa-de-mercado", "relatorio-executivo", "landing-page-conversao", "especificacao-dashboard"];

function Chip({ icon: Icon, label }) {
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-[#11131f] p-1 sm:pr-2.5 shadow-[0_0_24px_-10px_rgba(177,140,255,.7)]">
      <span className="grid size-6 place-items-center rounded-full bg-violet/15"><Icon className="size-3.5 text-violet" aria-hidden="true" /></span>
      <span className="hidden font-mono text-[11px] text-ink/85 sm:inline">{label}</span><span className="sr-only sm:hidden">{label}</span>
    </span>
  );
}

function Orbit() {
  const [r, setR] = useState({ a: 120, b: 215 });
  useEffect(() => {
    const on = () => { const w = window.innerWidth; setR(w < 640 ? { a: 78, b: 140 } : { a: 120, b: 215 }); };
    on(); window.addEventListener("resize", on); return () => window.removeEventListener("resize", on);
  }, []);
  return (
    <div className="relative flex h-[420px] w-full items-center justify-center overflow-hidden sm:h-[520px]" role="img"
      aria-label="Oito agentes de IA em órbita ao redor do Claude Code: prospector, diagnosticador, arquiteto de automação, redator, orçamentista, gestor de cliente, auditor e documentador">
      <div className="absolute size-[260px] rounded-full bg-violet/20 blur-[90px]" />
      <div className="relative z-10 grid size-28 place-items-center rounded-full border border-violet/40 bg-[#100e1f] shadow-[0_0_60px_-10px_rgba(177,140,255,.8)]">
        <div className="text-center">
          <TerminalIcon className="mx-auto size-6 text-violet" aria-hidden="true" />
          <span className="mt-1 block font-display text-[13px] font-bold">Claude Code</span>
        </div>
      </div>
      {INNER.map(([I, l], i) => (
        <OrbitingCircles key={l} className="border-none bg-transparent" radius={r.a} duration={26} delay={(26 / INNER.length) * i} path={i === 0}>
          <Chip icon={I} label={l} />
        </OrbitingCircles>
      ))}
      {OUTER.map(([I, l], i) => (
        <OrbitingCircles key={l} className="border-none bg-transparent" radius={r.b} duration={40} delay={(40 / OUTER.length) * i} reverse path={i === 0}>
          <Chip icon={I} label={l} />
        </OrbitingCircles>
      ))}
    </div>
  );
}

/* Escritório dos Agentes: conversa entre agentes */
const TEAM = [[Crown, "Chefe"], [Telescope, "Buscador"], [ChartColumn, "Analista"], [FolderKanban, "Organizador"], [CalendarCheck, "Mensageiro"]];
const TALK = [
  [0, "Distribuí a pesquisa de mercado."], [1, "Encontrei 12 fontes relevantes."], [2, "Comparativo de concorrentes pronto."],
  [3, "Juntei tudo num relatório."], [4, "Reunião marcada para revisão."], [0, "Revisado. Entregue ao cliente."],
];
function Office() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [n, setN] = useState(1);
  useEffect(() => { if (!inView) return; const t = setInterval(() => setN((x) => (x >= TALK.length ? 1 : x + 1)), 1500); return () => clearInterval(t); }, [inView]);
  const active = TALK[n - 1][0];
  return (
    <div ref={ref} className="mt-5 grid gap-4" aria-hidden="true">
      <div className="flex justify-between gap-1">
        {TEAM.map(([I, l], i) => (
          <div key={l} className="flex flex-col items-center gap-1.5">
            <motion.span animate={{ scale: active === i ? 1.12 : 1 }} className={cn("grid size-10 place-items-center rounded-2xl border transition-colors", active === i ? "border-violet bg-violet/20" : "border-line bg-[#0a0b12]")}>
              <I className={cn("size-4", active === i ? "text-violet" : "text-muted")} />
            </motion.span>
            <span className="font-mono text-[9.5px] text-muted">{l}</span>
          </div>
        ))}
      </div>
      <div className="flex h-[132px] flex-col justify-end gap-1.5 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {TALK.slice(Math.max(0, n - 3), n).map(([who, t], i) => (
            <motion.div key={t} layout initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-xl border border-line bg-[#0a0b12] px-3 py-2 text-[12.5px]">
              <span className="font-mono text-[10.5px] text-violet">{TEAM[who][1]}</span><span className="text-ink/85">{t}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* Robôs de trade: duas estratégias em modo simulado */
function Trade() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const a = "M0 70 C 30 66, 50 52, 80 56 S 130 40, 160 44 S 210 26, 240 34 S 290 18, 320 22";
  const b = "M0 70 C 30 74, 50 62, 80 66 S 130 58, 160 50 S 210 54, 240 46 S 290 42, 320 40";
  return (
    <div ref={ref} className="mt-5" aria-hidden="true">
      <svg viewBox="0 0 320 90" className="h-[120px] w-full overflow-visible">
        {[20, 45, 70].map((y) => <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="rgba(255,255,255,.06)" />)}
        {[[a, "#b18cff"], [b, "#6e78ff"]].map(([d, c], i) => (
          <motion.path key={i} d={d} fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 2.4, delay: i * 0.25, ease: "easeInOut" }} />
        ))}
      </svg>
      <div className="mt-2 flex items-center gap-4 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1.5"><i className="h-0.5 w-4 rounded bg-violet" /> estratégia A</span>
        <span className="flex items-center gap-1.5"><i className="h-0.5 w-4 rounded bg-indigo" /> estratégia B</span>
        <span className="ml-auto rounded-full border border-line px-2 py-0.5">saldo virtual</span>
      </div>
    </div>
  );
}

export default function Agents() {
  return (
    <section id="agentes" className="gutter relative mx-auto max-w-7xl py-28">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-violet">Agentes de IA</span>
      <TextAnimation as="h2" className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5.6vw,4.6rem)] font-bold leading-[0.95] tracking-[-0.035em]">
        Um time de agentes trabalhando junto.
      </TextAnimation>
      <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink/75">Cada agente tem uma função e passa o trabalho adiante, do primeiro contato com o cliente até a entrega.</p>

      <div className="mt-10 grid items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="min-w-0 rounded-3xl border border-line bg-surface/60"><Orbit /></div>
        <div className="grid min-w-0 gap-6">
          <SpotlightCard>
            <h3 className="font-display text-xl font-bold">Escritório dos Agentes</h3>
            <p className="mt-1.5 text-[14px] text-muted">Escritório virtual em que agentes especializados conversam entre si e entregam o trabalho pronto.</p>
            <Office />
          </SpotlightCard>
          <SpotlightCard>
            <h3 className="font-display text-xl font-bold">Robôs de trade em cripto</h3>
            <p className="mt-1.5 text-[14px] text-muted">Duas estratégias automatizadas competindo em modo simulado por oito semanas.</p>
            <Trade />
          </SpotlightCard>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-line bg-surface/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Skills</span>
          {SKILLS.map((s) => <span key={s} className="rounded-full border border-line bg-[#0a0b12] px-3 py-1 font-mono text-[12px] text-ink/80">{s}</span>)}
        </div>
        <a href={`${REPO}/tree/main/agentes`} target="_blank" rel="noopener" className="inline-flex shrink-0 items-center gap-1.5 text-sm text-ink/80 hover:text-violet">
          Ver agentes e skills <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
