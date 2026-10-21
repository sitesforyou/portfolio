import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import Nav from "./sections/Nav";
import Hero from "./sections/Hero";
import ToolsMarquee from "./sections/ToolsMarquee";
import Assemble from "./sections/Assemble";
import Cases from "./sections/Cases";
import Agents from "./sections/Agents";
import Products from "./sections/Products";
import Sites from "./sections/Sites";
import Footer from "./sections/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 800);
    if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ToolsMarquee />
        <Assemble />
        <Cases />
        <Agents />
        <Products />
        <Sites />
      </main>
      <Footer />
    </>
  );
}
