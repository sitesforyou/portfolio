// 21st.dev · Terminal (magicui), adaptado para JSX
import { Children, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "../../lib/utils";

const SequenceContext = createContext(null);
const useSequence = () => useContext(SequenceContext);
const ItemIndexContext = createContext(null);
const useItemIndex = () => useContext(ItemIndexContext);

export const AnimatedSpan = ({ children, className, ...props }) => {
  const sequence = useSequence();
  const itemIndex = useItemIndex();
  const [hasStarted, setHasStarted] = useState(false);
  useEffect(() => {
    if (!sequence || itemIndex === null || !sequence.sequenceStarted || hasStarted) return;
    if (sequence.activeIndex === itemIndex) setHasStarted(true);
  }, [sequence, hasStarted, itemIndex]);
  return (
    <motion.div initial={{ opacity: 0, y: -5 }} animate={hasStarted ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
      transition={{ duration: 0.3, delay: 0.25 }} className={cn("grid text-[13px] font-normal tracking-tight", className)}
      onAnimationComplete={() => { if (sequence && itemIndex !== null && hasStarted) sequence.completeItem(itemIndex); }} {...props}>
      {children}
    </motion.div>
  );
};

export const TypingAnimation = ({ children, className, duration = 38 }) => {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const sequence = useSequence();
  const itemIndex = useItemIndex();
  const completeRef = useRef(null);
  useEffect(() => { completeRef.current = sequence?.completeItem ?? null; }, [sequence?.completeItem]);
  useEffect(() => {
    if (sequence && itemIndex !== null && sequence.sequenceStarted && !started && sequence.activeIndex === itemIndex) setStarted(true);
  }, [sequence, itemIndex, started]);
  useEffect(() => {
    if (!started) return;
    let i = 0;
    const t = setInterval(() => {
      if (i < children.length) { setDisplayed(children.substring(0, i + 1)); i++; }
      else { clearInterval(t); completeRef.current?.(itemIndex); }
    }, duration);
    return () => clearInterval(t);
  }, [children, duration, started]);
  return <span className={cn("text-[13px] font-normal tracking-tight", className)}>{displayed}</span>;
};

export const Terminal = ({ children, className, title = "", onDone }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.3, once: true });
  const [activeIndex, setActiveIndex] = useState(0);
  const total = Children.count(children);
  useEffect(() => { if (activeIndex >= total && onDone) { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); } }, [activeIndex, total]);
  const ctx = useMemo(() => ({
    completeItem: (index) => setActiveIndex((cur) => (index === cur ? cur + 1 : cur)),
    activeIndex, sequenceStarted: isInView,
  }), [activeIndex, isInView]);
  const wrapped = useMemo(() => Children.toArray(children).map((child, index) => (
    <ItemIndexContext.Provider key={index} value={index}>{child}</ItemIndexContext.Provider>
  )), [children]);
  return (
    <SequenceContext.Provider value={ctx}>
      <div ref={containerRef} className={cn("z-0 w-full rounded-xl border border-line bg-[#0a0b12]/90 backdrop-blur", className)}>
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <div className="h-2.5 w-2.5 rounded-full bg-err/80" /><div className="h-2.5 w-2.5 rounded-full bg-warn/80" /><div className="h-2.5 w-2.5 rounded-full bg-ok/80" />
          <span className="ml-3 font-mono text-[11px] text-muted">{title}</span>
        </div>
        <pre className="p-4 font-mono"><code className="grid gap-y-1.5 overflow-auto">{wrapped}</code></pre>
      </div>
    </SequenceContext.Provider>
  );
};
export default Terminal;
