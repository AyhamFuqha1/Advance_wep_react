import { useEffect } from "react";

export function useScrollReveal(): void {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal-card").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
