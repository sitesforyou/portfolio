import { forwardRef, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import {
  Mail, Globe, Bot, Sparkles, LayoutDashboard, Database, Send, ArrowUpRight,
  Clock, Cloud, GitBranch, Sheet, ShieldCheck, Brain, MailCheck, MailWarning, MailX,
  Inbox, ScanLine, ListChecks, FileCheck2, Timer, Hand, Bell, Lock,
} from "lucide-react";
import { AnimatedBeam } from "../components/ui/animated-beam";
import { BorderBeam } from "../components/ui/border-beam";
import { Terminal, TypingAnimation, AnimatedSpan } from "../components/ui/terminal";
import { TextAnimation } from "../components/ui/text-animation";
import { cn } from "../lib/utils";
import { REPO } from "./Nav";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/* ---------- Central de Contas a Pagar: beams ---------- */
const Node = forwardRef(({ icon: Icon, label, className, big }, ref) => (
  <div className="z-10 flex flex-col items-center gap-2">
    <div ref={ref} className={cn(
      "grid place-items-center rounded-2xl border border-white/10 bg-[#11131f] shadow-[0_0_30px_-12px_rgba(177,140,255,0.55)]",
      big ? "size-20 rounded-3xl" : "size-12", className)}>
      <Icon className={big ? "size-8 text-violet" : "size-5 text-ink/85"} aria-hidden="true" />
    </div>
    <span className={cn("font-mono text-[11px] text-muted", big && "text-ink")}>{label}</span>
  </div>
));
Node.displayName = "Node";

const FEED = [
  { s: "ok", t: "Loja 12 · Internet", m: "boleto e nota conferem" },
  { s: "warn", t: "Loja 21 · Telefonia", m: "nota fiscal ausente" },
  { s: "err", t: "Loja 38 · Link", m: "vence em 6 dias sem boleto" },
  { s: "ok", t: "Loja 07 · Telefonia", m: "lançado no ERP" },
  { s: "err", t: "Loja 26 · Internet", m: "linha digitável duplicada" },
  { s: "warn", t: "Loja 45 · Link", m: "valor da nota ≠ boleto" },
];
const tone = { ok: "text-ok border-ok/30 bg-ok/10", warn: "text-warn border-warn/30 bg-warn/10", err: "text-err border-err/30 bg-err/10" };
const toneLabel = { ok: "OK", warn: "Atenção", err: "Erro" };

function CentralVisual() {
  const box = useRef(null);
  const i1 = useRef(null), i2 = useRef(null), i3 = useRef(null), hub = useRef(null), o1 = useRef(null), o2 = useRef(null), o3 = useRef(null);
  const [k, setK] = useState(0);
  useEffect(() => { const t = setInterval(() => setK((x) => x + 1), 1700); return () => clearInterval(t); }, []);
  const items = [0, 1, 2].map((j) => FEED[(k + j) % FEED.length]);
  const beam = { gradientStartColor: "#6e78ff", gradientStopColor: "#b18cff", pathColor: "#ffffff", pathOpacity: 0.08, pathWidth: 2 };
  return (
    <div className="relative flex h-full w-full flex-col gap-4">
      <div ref={box} className="relative flex flex-1 items-center justify-between rounded-3xl border border-line bg-surface/80 px-6 py-8 grid-bg sm:px-10">
        <div className="flex flex-col gap-7">
          <Node ref={i1} icon={Mail} label="E-mail" />
          <Node ref={i2} icon={Globe} label="Portais" />
          <Node ref={i3} icon={Bot} label="Robôs" />
        </div>
        <Node ref={hub} icon={Sparkles} label="Central + IA" big className="relative">
        </Node>
        <div className="flex flex-col gap-7">
          <Node ref={o1} icon={LayoutDashboard} label="Painel" />
          <Node ref={o2} icon={Database} label="ERP" />
          <Node ref={o3} icon={Send} label="Financeiro" />
        </div>
        <AnimatedBeam containerRef={box} fromRef={i1} toRef={hub} curvature={-40} duration={3.2} {...beam} />
        <AnimatedBeam containerRef={box} fromRef={i2} toRef={hub} duration={3.6} delay={0.4} {...beam} />
        <AnimatedBeam containerRef={box} fromRef={i3} toRef={hub} curvature={40} duration={3.4} delay={0.8} {...beam} />
        <AnimatedBeam containerRef={box} fromRef={hub} toRef={o1} curvature={-40} duration={3.2} delay={1.2} {...beam} />
        <AnimatedBeam containerRef={box} fromRef={hub} toRef={o2} duration={3.6} delay={1.5} {...beam} />
        <AnimatedBeam containerRef={box} fromRef={hub} toRef={o3} curvature={40} duration={3.4} delay={1.8} {...beam} />
      </div>
      <div className="relative h-[132px] overflow-hidden rounded-2xl border border-line bg-surface/80 p-3" aria-hidden="true">
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false} mode="popLayout">
            {items.map((it) => (
              <motion.div key={it.t + k} layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-[#0a0b12] px-3 py-2">
                <span className="truncate font-mono text-[12px] text-ink/85">{it.t}</span>
                <span className="hidden truncate text-[12px] text-muted sm:block">{it.m}</span>
                <span className={cn("shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px]", tone[it.s])}>{toneLabel[it.s]}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ---------- Lançador: terminal ---------- */
function LancadorVisual() {
  const [run, setRun] = useState(0);
  return (
    <div className="relative h-full w-full">
      <div className="relative h-full overflow-hidden rounded-xl">
        <Terminal key={run} title="Lancar-no-ERP.ps1" onDone={() => setRun((r) => r + 1)} className="h-full min-h-[420px]">
          <TypingAnimation className="text-ink">{"> .\\Lancar-no-ERP.ps1"}</TypingAnimation>
          <AnimatedSpan className="text-muted">Lendo 5 PDFs da pasta de entrada · 8 travas por arquivo</AnimatedSpan>
          <AnimatedSpan className="text-ok">✔ Loja 12 · Internet  → controle 40218 · rascunho criado</AnimatedSpan>
          <AnimatedSpan className="text-ok">✔ Loja 07 · Telefonia → controle 40219 · rascunho criado</AnimatedSpan>
          <AnimatedSpan className="text-warn">▲ Loja 21 · já lançado · ficou na pasta</AnimatedSpan>
          <AnimatedSpan className="text-warn">▲ Loja 33 · débito automático · ficou na pasta</AnimatedSpan>
          <AnimatedSpan className="text-muted">  relendo a tela do ERP antes de gravar…</AnimatedSpan>
          <AnimatedSpan className="text-ok">✔ Loja 18 · Internet  → controle 40220 · rascunho criado</AnimatedSpan>
          <TypingAnimation className="text-violet">{"3 lançados · 2 na pasta com o motivo · 0 enviados sem conferência"}</TypingAnimation>
        </Terminal>
        <BorderBeam size={260} duration={9} colorFrom="#6e78ff" colorTo="#b18cff" borderWidth={1.5} />
      </div>
      <span className="absolute -bottom-6 right-1 font-mono text-[10px] text-muted">dados fictícios</span>
    </div>
  );
}

/* ---------- Workflow n8n: grafo animado ---------- */
const W = 760, H = 380;
const NODES = [
  { id: "t", x: 20, y: 120, icon: Clock, label: "02:00" },
  { id: "o", x: 128, y: 120, icon: Cloud, label: "OneDrive" },
  { id: "if", x: 236, y: 120, icon: GitBranch, label: "Novo?" },
  { id: "x", x: 344, y: 120, icon: Sheet, label: "Planilha" },
  { id: "c", x: 452, y: 120, icon: ShieldCheck, label: "Confere" },
  { id: "ai", x: 560, y: 120, icon: Brain, label: "Resumo IA" },
  { id: "m", x: 668, y: 120, icon: MailCheck, label: "Gestor" },
  { id: "a1", x: 236, y: 270, icon: MailWarning, label: "Sem arquivo", tone: "warn" },
  { id: "a2", x: 452, y: 270, icon: MailX, label: "Erro", tone: "err" },
];
const NW = 72;
const cx = (n) => n.x + NW / 2, cy = (n) => n.y + NW / 2;
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
const MAIN = ["t", "o", "if", "x", "c", "ai", "m"];
const mainPath = MAIN.map((id, i) => `${i ? "L" : "M"} ${cx(byId[id])} ${cy(byId[id])}`).join(" ");

function WorkflowVisual() {
  const root = useRef(null);
  const [scen, setScen] = useState("ok");
  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lit = (id, cls = "lit") => q(`[data-n="${id}"]`).forEach((el) => el.classList.add(cls));
    const clear = () => q("[data-n]").forEach((el) => el.classList.remove("lit", "lit-warn", "lit-err"));
    gsap.set(q(".wf-edge"), { strokeDasharray: 400, strokeDashoffset: 400 });
    if (reduce) { gsap.set(q(".wf-edge"), { strokeDashoffset: 0 }); MAIN.forEach((id) => lit(id)); return; }
    const order = ["ok", "ok", "warn", "ok", "err"];
    let idx = 0;
    const play = () => {
      const s = order[idx++ % order.length];
      setScen(s);
      clear();
      gsap.set(q(".wf-edge"), { strokeDashoffset: 400 });
      const stopAt = s === "warn" ? 2 : s === "err" ? 4 : MAIN.length - 1;
      const tl = gsap.timeline({ onComplete: () => gsap.delayedCall(1.4, play) });
      for (let i = 0; i <= stopAt; i++) {
        const id = MAIN[i];
        tl.call(() => lit(id));
        if (i < stopAt) tl.to(q(`[data-e="${MAIN[i]}-${MAIN[i + 1]}"]`), { strokeDashoffset: 0, duration: 0.42, ease: "power2.inOut" });
      }
      tl.to(q(".wf-dot"), { duration: 0.42 * stopAt + 0.3, ease: "none", motionPath: { path: q(".wf-main")[0], start: 0, end: stopAt / (MAIN.length - 1) } }, 0);
      if (s === "warn") tl.to(q('[data-e="if-a1"]'), { strokeDashoffset: 0, duration: 0.45 }).call(() => lit("a1", "lit-warn"));
      if (s === "err") tl.to(q('[data-e="c-a2"]'), { strokeDashoffset: 0, duration: 0.45 }).call(() => lit("a2", "lit-err"));
      if (s === "ok") tl.call(() => {});
      tl.to({}, { duration: 1.2 });
    };
    ScrollTrigger.create({ trigger: root.current, start: "top 85%", once: true, onEnter: play });
  }, { scope: root });

  const caption = { ok: "Arquivo novo · planilha atualizada · resumo enviado", warn: "Sem arquivo novo · planilha não é tocada · aviso enviado", err: "Gravação não conferiu · aviso de erro com o detalhe" }[scen];
  return (
    <div ref={root} className="flex h-full w-full flex-col gap-4">
      <div className="relative flex-1 overflow-x-auto rounded-3xl border border-line bg-surface/80 grid-bg">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-full min-h-[300px] w-full min-w-[620px]" role="img" aria-label="Fluxo do workflow: agendamento, OneDrive, verificação de arquivo novo, planilha, conferência, resumo por IA e e-mail ao gestor, com avisos de sem arquivo e de erro">
          <path className="wf-main" d={mainPath} fill="none" stroke="none" />
          {MAIN.slice(0, -1).map((id, i) => {
            const a = byId[id], b = byId[MAIN[i + 1]];
            return (<g key={id}>
              <line x1={cx(a) + NW / 2} y1={cy(a)} x2={cx(b) - NW / 2} y2={cy(b)} stroke="rgba(255,255,255,.09)" strokeWidth="2" />
              <line data-e={`${id}-${MAIN[i + 1]}`} className="wf-edge" x1={cx(a) + NW / 2} y1={cy(a)} x2={cx(b) - NW / 2} y2={cy(b)} stroke="#b18cff" strokeWidth="2" />
            </g>);
          })}
          {[["if", "a1", "#fbbf24"], ["c", "a2", "#f87171"]].map(([f, t, col]) => (
            <g key={t}>
              <path d={`M ${cx(byId[f])} ${cy(byId[f]) + NW / 2} L ${cx(byId[t])} ${cy(byId[t]) - NW / 2}`} stroke="rgba(255,255,255,.09)" strokeWidth="2" strokeDasharray="4 5" fill="none" />
              <path data-e={`${f}-${t}`} className="wf-edge" d={`M ${cx(byId[f])} ${cy(byId[f]) + NW / 2} L ${cx(byId[t])} ${cy(byId[t]) - NW / 2}`} stroke={col} strokeWidth="2" fill="none" />
            </g>
          ))}
          {NODES.map((n) => {
            const Icon = n.icon;
            return (
              <g key={n.id} data-n={n.id} className={cn("wf-node", n.tone && `t-${n.tone}`)}>
                <rect x={n.x} y={n.y} width={NW} height={NW} rx="18" className="wf-box" />
                <foreignObject x={n.x} y={n.y} width={NW} height={NW}>
                  <div className="grid size-full place-items-center"><Icon className="wf-icon size-7" aria-hidden="true" /></div>
                </foreignObject>
                <text x={cx(n)} y={n.y + NW + 20} textAnchor="middle" className="wf-label">{n.label}</text>
              </g>
            );
          })}
          <circle className="wf-dot" r="6" fill="#e9d9ff" style={{ filter: "drop-shadow(0 0 8px #b18cff)" }} cx="0" cy="0" transform={`translate(${cx(byId.t)} ${cy(byId.t)})`} />
        </svg>
      </div>
      <div className="flex min-h-[44px] items-center gap-3 rounded-2xl border border-line bg-surface/80 px-4 py-2.5" aria-live="polite">
        <span className={cn("size-2 shrink-0 rounded-full", scen === "ok" ? "bg-ok" : scen === "warn" ? "bg-warn" : "bg-err")} />
        <span className="font-mono text-[12px] text-ink/85">{caption}</span>
      </div>
    </div>
  );
}

/* ---------- Painéis ---------- */
const CASES = [
  {
    key: "central", title: "Central de Contas a Pagar", tag: "Next.js · Supabase · IA · n8n",
    what: "Recebe os boletos, lê os PDFs com IA, confere cada cobrança e mostra em um painel o que está em dia, o que precisa de atenção e o que já foi lançado.",
    points: [[Inbox, "Coleta automática por e-mail, portais e robôs"], [ScanLine, "Leitura de valor, vencimento e CNPJ por IA"], [ListChecks, "7 regras de conferência antes do pagamento"]],
    href: `${REPO}/blob/main/cases/central-contas-a-pagar.md`, Visual: CentralVisual,
  },
  {
    key: "lancador", title: "Lançador automático no ERP", tag: "PowerShell · sem IA",
    what: "Lança os boletos no ERP operando a tela do sistema, confere a tela antes de gravar e deixa o e-mail de aprovação pronto para a equipe enviar.",
    points: [[Timer, "Cerca de 1,5 min por lançamento"], [Lock, "8 travas antes de qualquer gravação"], [Hand, "Rascunho no Outlook: quem envia é a pessoa"]],
    href: `${REPO}/blob/main/cases/lancador-erp.md`, Visual: LancadorVisual,
  },
  {
    key: "workflow", title: "Atualização diária de relatório", tag: "n8n · Microsoft 365 · IA",
    what: "Toda madrugada atualiza a base de uma planilha mestre de estoque, confere a gravação e envia ao gestor um resumo escrito por IA.",
    points: [[Clock, "Roda sozinho às 02:00"], [FileCheck2, "Conferência da gravação antes da IA"], [Bell, "Aviso em sucesso, sem arquivo novo ou erro"]],
    href: `${REPO}/blob/main/cases/atualizacao-diaria-relatorio.md`, Visual: WorkflowVisual,
  },
];

function CasePanel({ c, i }) {
  const V = c.Visual;
  return (
    <article className="case-panel gutter flex w-full shrink-0 items-center lg:h-full lg:w-screen">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 py-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-0">
        <div className="min-w-0">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-violet">{c.tag}</span>
          <h3 className="mt-3 text-balance font-display text-[clamp(2rem,4.2vw,3.6rem)] font-bold leading-[0.98] tracking-[-0.03em]">{c.title}</h3>
          <p className="mt-5 max-w-lg text-pretty text-[17px] leading-relaxed text-ink/80">{c.what}</p>
          <ul className="mt-7 grid gap-2.5">
            {c.points.map(([Icon, t]) => (
              <li key={t} className="flex items-center gap-3 rounded-2xl border border-line bg-surface/70 px-4 py-3 text-[15px]">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-violet/10"><Icon className="size-4 text-violet" aria-hidden="true" /></span>{t}
              </li>
            ))}
          </ul>
          <a href={c.href} target="_blank" rel="noopener" className="mt-7 inline-flex items-center gap-1.5 text-sm text-ink/80 underline decoration-white/20 underline-offset-4 transition-colors hover:text-violet hover:decoration-violet">
            Ler o case completo <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
        <div className="min-w-0 lg:h-[min(560px,70vh)]"><V /></div>
      </div>
      <span className="sr-only">Caso {i + 1} de {CASES.length}</span>
    </article>
  );
}

export default function Cases() {
  const wrap = useRef(null), track = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const dist = () => track.current.scrollWidth - window.innerWidth;
      const tween = gsap.to(track.current, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: wrap.current, pin: true, scrub: 0.8, start: "top top", end: () => "+=" + dist(), invalidateOnRefresh: true, anticipatePin: 1 },
      });
      gsap.to(".case-progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: wrap.current, start: "top top", end: () => "+=" + dist(), scrub: true } });
      return () => tween.kill();
    });
  }, { scope: wrap });

  return (
    <section id="automacoes" className="relative scroll-mt-0">
      <div className="gutter mx-auto max-w-7xl pt-24">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-violet">Automações</span>
        <TextAnimation as="h2" className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5.6vw,4.6rem)] font-bold leading-[0.95] tracking-[-0.035em]">
          Soluções que já tiram trabalho manual da rotina.
        </TextAnimation>
      </div>
      <div ref={wrap} className="relative lg:h-screen lg:overflow-hidden">
        <div ref={track} className="flex flex-col lg:h-full lg:w-max lg:flex-row">
          {CASES.map((c, i) => <CasePanel key={c.key} c={c} i={i} />)}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-8 hidden justify-center lg:flex">
          <div className="h-[2px] w-56 overflow-hidden rounded-full bg-white/10">
            <div className="case-progress h-full origin-left scale-x-0 bg-gradient-to-r from-indigo to-violet" />
          </div>
        </div>
      </div>
    </section>
  );
}
