// 21st.dev · 3D Marquee (aceternity), adaptado: grade inclinada em perspectiva com colunas em movimento alternado
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

export const ThreeDMarquee = ({ images, className }) => {
  const chunkSize = Math.ceil(images.length / 4);
  const chunks = Array.from({ length: 4 }, (_, i) => images.slice(i * chunkSize, i * chunkSize + chunkSize));
  return (
    <div className={cn("relative h-[600px] overflow-hidden", className)} style={{ perspective: "1800px" }}>
      <div
        className="absolute left-1/2 top-1/2 grid w-[920px] grid-cols-4 gap-4 sm:w-[1500px] sm:gap-7"
        style={{ transform: "translate(-50%, -50%) rotateX(52deg) rotateZ(-38deg)", transformStyle: "preserve-3d" }}
      >
        {chunks.map((sub, colIndex) => (
          <motion.div key={colIndex} initial={{ y: colIndex % 2 === 0 ? -80 : 80 }} animate={{ y: colIndex % 2 === 0 ? 80 : -80 }}
            transition={{ duration: colIndex % 2 === 0 ? 10 : 14, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="flex flex-col gap-4 sm:gap-7">
            {sub.map((image, i) => (
              <motion.img whileHover={{ y: -12 }} transition={{ duration: 0.3, ease: "easeInOut" }}
                key={i} src={image} alt="" loading="eager" decoding="async"
                className="aspect-[970/700] w-full rounded-xl object-cover object-top ring-1 ring-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,.9)]"
                width={970} height={700} />
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
