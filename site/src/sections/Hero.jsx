import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ShaderBackground } from "../components/ui/shader-background";
import NumberTicker from "../components/ui/number-ticker";
import { REPO } from "./Nav";

gsap.registerPlugin(SplitText);

const STATS = [
  { v: 1.5, d: 1, suf: "min", label: "por boleto lançado no ERP" },
  { v: 7, d: 0, suf: "", label: "regras conferindo cada cobrança" },
  { v: 8, d: 0, suf: "", label: "agentes de IA no Claude Code" },
];

export default function Hero() {
  const root = useRef(null);
  useGSAP(async () => {
    if (document.fonts) await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))]);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const split = new SplitText(".hero-name", { type: "chars,words", charsClass: "inline-block will-change-transform" });
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(split.chars, { yPercent: 115, rotate: 6, opacity: 0, duration: 1.3, stagger: 0.028 })
      .from(".hero-fade", { y: 24, opacity: 0, duration: 1, stagger: 0.09 }, "-=0.9")
      .from(".hero-stat", { y: 30, opacity: 0, duration: 1, stagger: 0.08 }, "-=0.7");
    gsap.to(".hero-content", { yPercent: -12, opacity: 0.2, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
  }, { scope: root });

  return (
    <section id="topo" ref={root} className="relative isolate flex min-h-[94svh] flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10"><ShaderBackground /></div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#07080d]/30 via-transparent to-[#07080d]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#07080d]/80 via-[#07080d]/25 to-transparent" />
      <div className="hero-content gutter mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end pb-14 pt-36">
        <p className="hero-fade mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/80 backdrop-blur">
          <i className="size-1.5 animate-pulsedot rounded-full bg-ok" /> Automação de processos · Agentes de IA
        </p>
        <h1 className="hero-name font-display text-[clamp(3rem,10.5vw,9.5rem)] font-extrabold leading-[0.88] tracking-[-0.045em]" style={{ overflow: "hidden", paddingBottom: "0.14em", marginBottom: "-0.08em" }}>
          Lorenzo<br />D'Oliveira
        </h1>
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="hero-fade text-balance text-lg leading-relaxed text-ink/85 sm:text-xl">
              Transformo processos manuais em fluxos que rodam sozinhos, com conferência humana onde a decisão importa.
            </p>
            <p className="hero-fade mt-3 text-sm text-muted">Sócio-fundador da Mentor.IA · Administração na ESPM · São Paulo</p>
            <div className="hero-fade mt-7 flex flex-wrap gap-3">
              <a href="#automacoes" className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-[#07080d] transition-colors hover:bg-violet">
                Ver automações <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
              <a href={REPO} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:border-violet/60">
                Repositório <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-3 lg:w-[520px]">
            {STATS.map((s) => (
              <div key={s.label} className="hero-stat rounded-2xl border border-white/10 bg-[#0b0c14]/55 p-4 backdrop-blur-md">
                <dt className="sr-only">{s.label}</dt>
                <dd className="whitespace-nowrap font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-bold leading-none tracking-tight tabular-nums">
                  <NumberTicker from={0} target={s.v} decimals={s.d} delay={0.9} />{s.suf && <span className="ml-1 text-[0.5em] font-semibold text-ink/70">{s.suf}</span>}
                </dd>
                <p className="mt-2 text-[12px] leading-snug text-muted">{s.label}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
