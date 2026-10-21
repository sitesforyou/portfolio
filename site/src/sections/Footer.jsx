import { ArrowUpRight, GraduationCap, Award } from "lucide-react";
import { TextAnimation } from "../components/ui/text-animation";
import { REPO } from "./Nav";

const EDU = [["Administração · ESPM São Paulo", "em curso · Marketing de Conteúdo e SEO/GEO"], ["Salt Lake Community College", "Estados Unidos · inglês avançado"]];
const CERT = [["Claude Code in Action", "Anthropic · 2026"], ["AI Fluency for Small Businesses", "Anthropic · 2026"], ["Marketing Digital", "USP · Coursera · 2026"], ["Excel Standard", "2026"], ["Google Analytics", "Google · 2024"]];

export default function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-line">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-indigo/20 blur-[120px]" />
      <div className="gutter relative mx-auto max-w-7xl pb-14 pt-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted"><GraduationCap className="size-4" aria-hidden="true" />Formação</p>
            <ul className="grid gap-3">{EDU.map(([a, b]) => <li key={a}><span className="block text-[15px]">{a}</span><span className="text-[13px] text-muted">{b}</span></li>)}</ul>
          </div>
          <div>
            <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted"><Award className="size-4" aria-hidden="true" />Certificações</p>
            <ul className="flex flex-wrap gap-2">{CERT.map(([a, b]) => <li key={a} className="rounded-2xl border border-line bg-surface px-3 py-2"><span className="block text-[13.5px]">{a}</span><span className="text-[11.5px] text-muted">{b}</span></li>)}</ul>
          </div>
        </div>
        <div className="mt-24">
          <TextAnimation as="p" className="font-display text-[clamp(2.6rem,9vw,8rem)] font-extrabold leading-[0.88] tracking-[-0.045em]">
            Lorenzo D'Oliveira
          </TextAnimation>
          <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-5">
              <a href={REPO} target="_blank" rel="noopener" className="inline-flex items-center gap-1 hover:text-violet">Repositório do portfólio <ArrowUpRight className="size-4" aria-hidden="true" /></a>
              <a href="https://sitesforyou.github.io/mentor-ia-site/" target="_blank" rel="noopener" className="inline-flex items-center gap-1 hover:text-violet">Mentor.IA <ArrowUpRight className="size-4" aria-hidden="true" /></a>
            </div>
            <p className="text-[12px] text-muted">Simulações com dados fictícios. Sistemas internos descritos sem dados das empresas.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
