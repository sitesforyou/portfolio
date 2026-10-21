import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Sheet, Mail, FileText, Globe, MessageCircle, Database, Calculator, Clock, Copy, Paperclip,
  Search, ClipboardList, Phone, FolderOpen, Workflow,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Tarefas manuais espalhadas que se juntam num único fluxo. Posições em fração da tela.
const PIECES = [
  [Sheet, "Planilha", -0.38, -0.30, -12], [Mail, "E-mail", 0.34, -0.33, 9], [FileText, "PDF", -0.20, 0.30, 7],
  [Globe, "Portal", 0.40, 0.18, -8], [MessageCircle, "WhatsApp", -0.43, 0.06, 5], [Database, "ERP", 0.17, 0.36, -6],
  [Calculator, "Conferência", -0.06, -0.40, 4], [Clock, "Prazo", 0.44, -0.06, 11], [Copy, "Copiar e colar", -0.32, 0.38, -9],
  [Paperclip, "Anexo", 0.27, -0.12, 6], [Search, "Procurar boleto", -0.24, -0.08, -5], [ClipboardList, "Checklist", 0.05, 0.42, 8],
  [Phone, "Cobrar fornecedor", 0.36, 0.40, -4], [FolderOpen, "Pasta da rede", -0.45, -0.20, 10],
];

export default function Assemble() {
  const root = useRef(null);
  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const pieces = q(".as-piece");
    const place = () => {
      const w = root.current.offsetWidth, h = root.current.offsetHeight;
      const sx = Math.min(w, 1300), sy = Math.min(h, 820);
      pieces.forEach((el, i) => {
        const [, , px, py, rot] = PIECES[i];
        gsap.set(el, { x: px * sx, y: py * sy, rotation: rot });
      });
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(pieces, { x: 0, y: 0, scale: 0.2, opacity: 0 });
      gsap.set(q(".as-core"), { scale: 1, opacity: 1 });
      gsap.set(q(".as-before"), { opacity: 0 });
      gsap.set(q(".as-after"), { opacity: 1, y: 0 });
      return;
    }
    place();
    gsap.set(q(".as-core"), { scale: 0.35, opacity: 0 });
    gsap.set(q(".as-after"), { opacity: 0, y: 30 });
    gsap.set(q(".as-ring"), { scale: 0.6, opacity: 0 });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root.current, start: "top top", end: "+=170%", pin: true, scrub: 1, invalidateOnRefresh: true, onRefreshInit: place },
    });
    tl.to(q(".as-before"), { opacity: 0, y: -30, duration: 0.25 }, 0)
      .to(pieces, { x: 0, y: 0, rotation: 0, scale: 0.55, duration: 1, ease: "power3.inOut", stagger: { each: 0.025, from: "random" } }, 0.05)
      .to(pieces, { opacity: 0, scale: 0.2, duration: 0.3, stagger: { each: 0.012, from: "random" } }, 0.8)
      .to(q(".as-core"), { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, 0.95)
      .to(q(".as-ring"), { scale: 1.35, opacity: 0.0, duration: 0.6, ease: "power2.out", stagger: 0.12 }, 1.0)
      .to(q(".as-after"), { opacity: 1, y: 0, duration: 0.35 }, 1.15)
      .to({}, { duration: 0.35 });
  }, { scope: root });

  return (
    <section ref={root} aria-label="De tarefas soltas a um fluxo único" className="relative flex h-screen min-h-[620px] items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg mask-fade-b opacity-60" />
      <div className="as-before gutter pointer-events-none absolute inset-x-0 top-[12%] z-20 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Antes</p>
        <p className="mt-2 font-display text-[clamp(1.6rem,4vw,3rem)] font-bold tracking-[-0.03em]">Tarefas espalhadas.</p>
      </div>

      <div className="relative z-10 grid place-items-center">
        {PIECES.map(([Icon, label], i) => (
          <span key={label} className="as-piece absolute flex items-center gap-2 whitespace-nowrap rounded-2xl border border-white/10 bg-[#11131f] px-3 py-2 text-[13px] text-ink/85 shadow-[0_10px_40px_-15px_rgba(0,0,0,.8)]">
            <Icon className="size-4 text-violet" aria-hidden="true" />{label}
          </span>
        ))}
        <div className="as-core relative grid size-40 place-items-center rounded-[2.5rem] border border-violet/50 bg-gradient-to-br from-[#1d1a3d] to-[#0f1024] shadow-[0_0_120px_-10px_rgba(177,140,255,.75)] sm:size-48">
          <span className="as-ring absolute inset-0 rounded-[2.5rem] border border-violet/60" />
          <span className="as-ring absolute inset-0 rounded-[2.5rem] border border-indigo/60" />
          <div className="text-center">
            <Workflow className="mx-auto size-10 text-violet" aria-hidden="true" />
            <span className="mt-2 block font-display text-lg font-bold">Um fluxo</span>
          </div>
        </div>
      </div>

      <div className="as-after gutter pointer-events-none absolute inset-x-0 bottom-[11%] z-20 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-violet">Depois</p>
        <p className="mt-2 font-display text-[clamp(1.6rem,4vw,3rem)] font-bold tracking-[-0.03em]">Tudo num fluxo que roda sozinho.</p>
      </div>
    </section>
  );
}
