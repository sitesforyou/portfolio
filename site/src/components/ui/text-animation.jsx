// 21st.dev · Text Animation (block-wipe com GSAP SplitText), adaptado para JSX
import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "../../lib/utils";

gsap.registerPlugin(SplitText, ScrollTrigger);

export function TextAnimation({ as: Tag = "h2", children, className, blockColor = "#b18cff", stagger = 0.1, duration = 0.75, delay = 0 }) {
  const ref = useRef(null);
  useGSAP(async () => {
    const el = ref.current;
    if (!el) return;
    if (document.fonts) await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))]);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const split = new SplitText(el, { type: "lines", linesClass: "tr-line" });
    const blocks = [];
    split.lines.forEach((line) => {
      const wrap = document.createElement("div");
      wrap.style.cssText = "position:relative;overflow:hidden;width:fit-content;max-width:100%";
      line.parentNode.insertBefore(wrap, line);
      wrap.appendChild(line);
      const block = document.createElement("div");
      block.style.cssText = `position:absolute;inset:0;background:${blockColor};transform:scaleX(0);transform-origin:left center;pointer-events:none`;
      wrap.appendChild(block);
      blocks.push(block);
    });
    gsap.set(split.lines, { opacity: 0 });
    const tl = gsap.timeline({ paused: true, delay });
    split.lines.forEach((line, i) => {
      const b = blocks[i];
      tl.add(gsap.timeline()
        .to(b, { scaleX: 1, duration, ease: "power4.inOut" })
        .set(line, { opacity: 1 })
        .set(b, { transformOrigin: "right center" })
        .to(b, { scaleX: 0, duration, ease: "power4.inOut" }), i * stagger);
    });
    ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => tl.play() });
  }, { scope: ref });
  return <Tag ref={ref} className={cn(className)}>{children}</Tag>;
}
export default TextAnimation;
