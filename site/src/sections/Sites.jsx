import { ArrowUpRight } from "lucide-react";
import { ThreeDMarquee } from "../components/ui/three-d-marquee";
import { TextAnimation } from "../components/ui/text-animation";
import mentorSite from "../assets/mentor-site.webp";
import mentorMulti from "../assets/mentor-multi.webp";
import horti from "../assets/hortifruti.webp";
import arq from "../assets/arquitetura.webp";
import emporio from "../assets/emporio.webp";
import clinica from "../assets/clinica.webp";

const base = [mentorSite, arq, emporio, horti, mentorMulti, clinica, arq, mentorSite];
const IMAGES = [...base, ...base.slice().reverse()];
const SEG = ["Hortifruti por assinatura", "Consultoria de marketing", "Moda praia", "Clínica de cirurgia plástica", "Empório artesanal", "Estúdio de arquitetura"];

export default function Sites() {
  return (
    <section id="sites" className="relative py-20">
      <div className="gutter mx-auto max-w-7xl">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-violet">Sites</span>
        <TextAnimation as="h2" className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5.6vw,4.6rem)] font-bold leading-[0.95] tracking-[-0.035em]">
          Sites com movimento.
        </TextAnimation>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink/75">Sites com GSAP, Three.js e React para a Mentor.IA e para clientes de diferentes segmentos.</p>
      </div>
      <div className="relative mt-6" role="img" aria-label="Galeria inclinada com telas de sites desenvolvidos">
        <ThreeDMarquee images={IMAGES} className="h-[620px] max-sm:h-[420px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#07080d_92%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#07080d] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07080d] to-transparent" />
      </div>
      <div className="gutter mx-auto mt-2 flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">{SEG.map((s) => <span key={s} className="rounded-full border border-line bg-surface px-3 py-1 text-[13px] text-ink/80">{s}</span>)}</div>
        <div className="flex shrink-0 gap-4 text-sm">
          <a href="https://sitesforyou.github.io/mentor-ia-site/" target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-ink/80 hover:text-violet">Mentor.IA <ArrowUpRight className="size-4" aria-hidden="true" /></a>
          <a href="https://mentoriaa-curso.vercel.app" target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-ink/80 hover:text-violet">Plataforma do curso <ArrowUpRight className="size-4" aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
