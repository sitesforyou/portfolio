import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Scissors, FileCode2, FileCheck2, ShoppingBag, Store } from "lucide-react";
import { SpotlightCard } from "../components/ui/spotlight-card";
import { TextAnimation } from "../components/ui/text-animation";

gsap.registerPlugin(ScrollTrigger);

function useLoop(ms, max) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [n, setN] = useState(0);
  useEffect(() => { if (!inView) return; const t = setInterval(() => setN((x) => (x + 1) % max), ms); return () => clearInterval(t); }, [inView]);
  return [ref, n];
}

const SALE = [["Corte", 45], ["Barba", 35], ["Pomada", 29]];
function Regua() {
  const [ref, n] = useLoop(1100, SALE.length + 3);
  const shown = SALE.slice(0, Math.min(n, SALE.length));
  const total = shown.reduce((a, [, v]) => a + v, 0);
  return (
    <div ref={ref} className="mt-5 rounded-2xl border border-line bg-[#0a0b12] p-4 font-mono text-[12px]" aria-hidden="true">
      <div className="mb-2 flex justify-between text-muted"><span>PDV · comanda</span><span>exemplo</span></div>
      <div className="flex h-[78px] flex-col gap-1">
        <AnimatePresence>
          {shown.map(([l, v]) => (
            <motion.div key={l} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex justify-between text-ink/85">
              <span>{l}</span><span>R$ {v},00</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-2 flex justify-between border-t border-line pt-2 text-ink"><span>Total</span><span>R$ {total},00</span></div>
      <div className="mt-3 flex flex-wrap gap-1.5">{["DRE", "Estoque", "Comissões", "NFS-e"].map((t) => <span key={t} className="rounded-full bg-violet/10 px-2 py-0.5 text-[10.5px] text-violet">{t}</span>)}</div>
    </div>
  );
}

function Quimapa() {
  const [ref, n] = useLoop(700, 8);
  const files = Math.min(n, 5);
  return (
    <div ref={ref} className="mt-5 flex items-center gap-3" aria-hidden="true">
      <div className="grid flex-1 grid-cols-3 gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div key={i} animate={{ opacity: i < files ? 0.25 : 1, y: i < files ? 6 : 0 }} className="flex items-center gap-1 rounded-lg border border-line bg-[#0a0b12] px-1.5 py-1.5">
            <FileCode2 className="size-3.5 text-indigo" /><span className="font-mono text-[9.5px] text-muted">NF-e</span>
          </motion.div>
        ))}
      </div>
      <div className="h-px w-8 bg-gradient-to-r from-indigo to-violet" />
      <motion.div animate={{ scale: n >= 5 ? 1.06 : 1 }} className="flex w-28 flex-col items-center gap-1.5 rounded-2xl border border-violet/40 bg-violet/10 p-3">
        <FileCheck2 className="size-6 text-violet" />
        <span className="text-center font-mono text-[10px] leading-tight text-ink/85">Mapa mensal<br /><span className="text-violet">{n >= 5 ? "pronto" : "gerando…"}</span></span>
      </motion.div>
    </div>
  );
}

function Marketplaces() {
  const [ref, n] = useLoop(1200, 4);
  const bars = [[40, 62, 55, 78, 70, 90], [55, 48, 72, 60, 85, 76], [35, 58, 66, 52, 80, 94], [60, 70, 58, 88, 74, 82]][n];
  return (
    <div ref={ref} className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4" aria-hidden="true">
      <div className="flex flex-col gap-2">
        {[[Store, "Mercado Livre"], [ShoppingBag, "Shopee"]].map(([I, l]) => (
          <span key={l} className="flex items-center gap-1.5 rounded-full border border-line bg-[#0a0b12] px-2.5 py-1 font-mono text-[10.5px] text-ink/80"><I className="size-3.5 text-violet" />{l}</span>
        ))}
      </div>
      <div className="flex h-[92px] items-end gap-1.5 rounded-2xl border border-line bg-[#0a0b12] p-3">
        {bars.map((h, i) => (
          <motion.div key={i} animate={{ height: `${h}%` }} transition={{ type: "spring", stiffness: 120, damping: 16 }} className="flex-1 rounded-t bg-gradient-to-t from-indigo/50 to-violet" />
        ))}
      </div>
    </div>
  );
}

const P = [
  { t: "Régua Pro", tag: "SaaS · barbearias", d: "Gestão completa para barbearias: venda no balcão, financeiro, estoque e comissões em um só sistema.", V: Regua, I: Scissors, g: "from-[#1a1636] to-[#0d0f17]" },
  { t: "Quimapa", tag: "SaaS · compliance", d: "Gera o Mapa Mensal de produtos controlados pela Polícia Federal a partir das notas fiscais do mês, pronto para enviar.", V: Quimapa, I: FileCheck2, g: "from-[#111a36] to-[#0d0f17]" },
  { t: "Gestão de marketplaces", tag: "SaaS · e-commerce", d: "Vendas, pedidos e estoque de vários marketplaces sincronizados em um só painel.", V: Marketplaces, I: ShoppingBag, g: "from-[#1e1430] to-[#0d0f17]" },
];

export default function Products() {
  const root = useRef(null);
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = gsap.utils.toArray(".stack-card", root.current);
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      gsap.to(card.querySelector(".stack-inner"), {
        scale: 0.94 - (cards.length - 2 - i) * 0.02, filter: "brightness(0.72)", ease: "none",
        scrollTrigger: { trigger: next, start: "top bottom", end: "top 18%", scrub: true },
      });
    });
  }, { scope: root });
  return (
    <section id="produtos" ref={root} className="gutter relative mx-auto max-w-6xl pb-28 pt-20">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-violet">Produtos próprios</span>
      <TextAnimation as="h2" className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5.6vw,4.6rem)] font-bold leading-[0.95] tracking-[-0.035em]">
        SaaS para nichos específicos.
      </TextAnimation>
      <div className="mt-12 flex flex-col gap-[14vh]">
        {P.map(({ t, tag, d, V, I, g }, i) => (
          <div key={t} className="stack-card sticky" style={{ top: `calc(14vh + ${i * 22}px)` }}>
            <div className={`stack-inner origin-top rounded-[2rem] bg-gradient-to-br ${g} p-px`}>
              <SpotlightCard className="grid min-h-[380px] items-center gap-8 rounded-[2rem] border-white/10 bg-[#0d0f17]/95 p-7 sm:p-10 md:grid-cols-2">
                <div className="min-w-0">
                  <span className="grid size-12 place-items-center rounded-2xl bg-violet/10"><I className="size-6 text-violet" aria-hidden="true" /></span>
                  <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{tag}</p>
                  <h3 className="mt-2 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-bold leading-none tracking-[-0.03em]">{t}</h3>
                  <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink/75">{d}</p>
                </div>
                <div className="min-w-0 [&>div]:mt-0"><V /></div>
              </SpotlightCard>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
