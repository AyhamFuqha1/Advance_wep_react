import { useEffect, useRef } from "react";
import "../css/Features.css";
import { cards } from "../data/featuresData";
import type { FeatureCard } from "../interfaces";

function Features() {
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    cardsRef.current.forEach((card) => card && observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="features-section">
      <div className="features-header" ref={titleRef}>
        <h2 className="features-title">
          Our<br />Features
        </h2>
      </div>

      <div className="features-grid">
        {cards.map((card: FeatureCard, i: number) => (
          <div
            className="feature-card4"
            key={i}
           ref={(el) => {
          cardsRef.current[i] = el;
}}
            style={{ transitionDelay: `${i * 0.12}s` }}
          >
            <span className="feature-num">{card.num}</span>
            <span className="feature-icon">{card.icon}</span>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <span className="feature-line" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
