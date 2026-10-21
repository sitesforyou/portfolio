// 21st.dev · Spotlight Card, adaptado para JSX
import { useRef, useState } from "react";
import { cn } from "../../lib/utils";

export const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(177,140,255,0.18)" }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const onMove = (e) => {
    if (!divRef.current) return;
    const r = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  return (
    <div ref={divRef} onMouseMove={onMove} onMouseEnter={() => setOpacity(1)} onMouseLeave={() => setOpacity(0)}
      className={cn("relative overflow-hidden rounded-3xl border border-line bg-surface p-6", className)}>
      <div className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-in-out"
        style={{ opacity, background: `radial-gradient(420px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)` }} />
      {children}
    </div>
  );
};
