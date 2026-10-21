import { useEffect, useRef, useState } from "react";
import { Github } from "lucide-react";
import { cn } from "../lib/utils";

const LINKS = [["Automações", "#automacoes"], ["Agentes", "#agentes"], ["Produtos", "#produtos"], ["Sites", "#sites"]];
export const REPO = "https://github.com/sitesforyou/portfolio";

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const last = useRef(0);
  useEffect(() => {
    const on = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > 400 && y > last.current + 4);
      if (y < last.current - 4) setHidden(false);
      last.current = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={cn("fixed inset-x-0 z-50 flex justify-center gutter transition-transform duration-500", hidden ? "-translate-y-28" : "translate-y-0")}
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 14px)" }}>
      <nav aria-label="Seções" className={cn(
        "flex w-full max-w-3xl items-center justify-between gap-2 rounded-full border px-2 py-1.5 backdrop-blur-xl transition-colors duration-500",
        solid ? "border-white/10 bg-[#0b0c14]/75" : "border-white/[0.06] bg-white/[0.03]")}>
        <a href="#topo" className="flex items-center gap-2 rounded-full px-2 py-1">
          <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-indigo to-violet font-display text-[13px] font-bold text-[#07080d]">LD</span>
          <span className="hidden font-display text-sm font-semibold sm:inline">Lorenzo D'Oliveira</span>
        </a>
        <div className="flex items-center gap-0.5">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h} className="group relative hidden overflow-hidden rounded-full px-3 py-1.5 text-[13px] text-muted transition-colors hover:text-ink md:block">
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">{l}</span>
              <span className="absolute inset-x-3 top-full block transition-transform duration-300 group-hover:-translate-y-full" aria-hidden="true">{l}</span>
            </a>
          ))}
          <a href={REPO} target="_blank" rel="noopener" className="ml-1 flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-medium text-[#07080d] transition-colors hover:bg-violet">
            <Github className="size-3.5" aria-hidden="true" /> GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}
