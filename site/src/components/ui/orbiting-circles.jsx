// 21st.dev · Orbiting Circles (magicui), adaptado para JSX
import { cn } from "../../lib/utils";

export function OrbitingCircles({ className, children, reverse, duration = 20, delay = 10, radius = 50, path = true }) {
  return (
    <>
      {path && (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="pointer-events-none absolute inset-0 size-full">
          <circle className="stroke-white/10 stroke-1" cx="50%" cy="50%" r={radius} fill="none" />
        </svg>
      )}
      <div
        style={{ "--duration": duration, "--radius": radius, "--delay": -delay }}
        className={cn(
          "absolute flex transform-gpu animate-orbit items-center justify-center rounded-full border bg-white/10 [animation-delay:calc(var(--delay)*1000ms)]",
          { "[animation-direction:reverse]": reverse },
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
