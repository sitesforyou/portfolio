const A = ["n8n", "Power Automate", "PowerShell", "Claude API", "Claude Code", "Python", "Next.js", "React", "TypeScript"];
const B = ["Supabase", "PostgreSQL", "GSAP", "Three.js", "Microsoft 365", "Outlook", "Excel", "Office Scripts", "Playwright"];

function Row({ items, reverse }) {
  const all = [...items, ...items];
  return (
    <div className="mask-fade-x flex overflow-hidden">
      <div className="flex w-max animate-marquee gap-3 pr-3" style={reverse ? { animationDirection: "reverse" } : undefined}>
        {all.map((t, i) => (
          <span key={i} className="whitespace-nowrap rounded-full border border-line bg-surface px-4 py-2 font-mono text-[13px] text-ink/80">{t}</span>
        ))}
      </div>
    </div>
  );
}
export default function ToolsMarquee() {
  return (
    <section aria-label="Ferramentas" className="flex flex-col gap-3 py-10">
      <Row items={A} />
      <Row items={B} reverse />
    </section>
  );
}
