// 21st.dev · Animated Beam (magicui), adaptado para JSX
import { useEffect, useId, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

export const AnimatedBeam = ({
  className, containerRef, fromRef, toRef, curvature = 0, reverse = false,
  duration = Math.random() * 3 + 4, delay = 0, pathColor = "gray", pathWidth = 2,
  pathOpacity = 0.2, gradientStartColor = "#ffaa40", gradientStopColor = "#9c40ff",
  startXOffset = 0, startYOffset = 0, endXOffset = 0, endYOffset = 0,
}) => {
  const gid = "beam" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const gradientCoordinates = reverse
    ? { x1: ["90%", "-10%"], x2: ["100%", "0%"], y1: ["0%", "0%"], y2: ["0%", "0%"] }
    : { x1: ["10%", "110%"], x2: ["0%", "100%"], y1: ["0%", "0%"], y2: ["0%", "0%"] };

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const c = containerRef.current.getBoundingClientRect();
        const a = fromRef.current.getBoundingClientRect();
        const b = toRef.current.getBoundingClientRect();
        // usa offsetWidth para não sofrer com transform/scale do pai
        const sx = c.width ? containerRef.current.offsetWidth / c.width : 1;
        setSvgDimensions({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
        const startX = (a.left - c.left + a.width / 2) * sx + startXOffset;
        const startY = (a.top - c.top + a.height / 2) * sx + startYOffset;
        const endX = (b.left - c.left + b.width / 2) * sx + endXOffset;
        const endY = (b.top - c.top + b.height / 2) * sx + endYOffset;
        const controlY = startY - curvature;
        setPathD(`M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`);
      }
    };
    const ro = new ResizeObserver(() => updatePath());
    if (containerRef.current) ro.observe(containerRef.current);
    updatePath();
    const t = setTimeout(updatePath, 400);
    return () => { ro.disconnect(); clearTimeout(t); };
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset]);

  return (
    <svg fill="none" width={svgDimensions.width} height={svgDimensions.height} xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none absolute left-0 top-0 transform-gpu stroke-2", className)}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}>
      <path d={pathD} stroke={pathColor} strokeWidth={pathWidth} strokeOpacity={pathOpacity} strokeLinecap="round" />
      <path d={pathD} strokeWidth={pathWidth} stroke={`url(#${gid})`} strokeOpacity="1" strokeLinecap="round" />
      <defs>
        <motion.linearGradient className="transform-gpu" id={gid} gradientUnits="userSpaceOnUse"
          initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
          animate={{ x1: gradientCoordinates.x1, x2: gradientCoordinates.x2, y1: gradientCoordinates.y1, y2: gradientCoordinates.y2 }}
          transition={{ delay, duration, ease: [0.16, 1, 0.3, 1], repeat: Infinity, repeatDelay: 0 }}>
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} />
          <stop offset="32.5%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
};
