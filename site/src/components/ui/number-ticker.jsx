// 21st.dev · Number Ticker (fancycomponents), adaptado para JSX e disparo por visibilidade
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";

export default function NumberTicker({ from = 0, target = 100, decimals = 0, duration = 2.2, delay = 0, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const count = useMotionValue(from);
  const text = useTransform(count, (v) => v.toFixed(decimals).replace(".", ","));
  useEffect(() => {
    if (!inView) return;
    const c = animate(count, target, { duration, delay, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [inView]);
  return <motion.span ref={ref} className={className}>{text}</motion.span>;
}
