import { useState, useEffect, useRef } from "react";
import "../css/Slider.css";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { slides } from "../data/sliderData";
import type { Slide } from "../interfaces";

type Direction = "next" | "prev";

function Slider() {
  const [current, setCurrent] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("next");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible"));
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number, dir: Direction): void => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 500);
  };

  const next = (): void => goTo((current + 1) % slides.length, "next");
  const prev = (): void => goTo((current - 1 + slides.length) % slides.length, "prev");

  useEffect(() => {
    timerRef.current = setInterval(next, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current]);

  const slide: Slide = slides[current];

  return (
    <section className="slider-section" ref={sectionRef}>
      <h2 className="slider-heading">
        Why Choose<br />SmartStudy AI?
      </h2>

      <div className={`slider-card ${animating ? `exit-${direction}` : "enter"}`}>
        <div className="slider-img-wrap">
          <img src={slide.img} alt={slide.title} />
        </div>
        <div className="slider-content">
          <h2 className="slider-title">
            {slide.title.split("\n").map((line: string, i: number) => (
              <span key={i}>{line}<br /></span>
            ))}
          </h2>
          <p className="slider-desc">{slide.desc}</p>
        </div>
      </div>

      <button className="slider-arrow left" onClick={prev}><IoMdArrowDropleft /></button>
      <button className="slider-arrow right" onClick={next}><IoMdArrowDropright /></button>

      <div className="slider-dots">
        {slides.map((_: Slide, i: number) => (
          <span
            key={i}
            className={`dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i, i > current ? "next" : "prev")}
          />
        ))}
      </div>
    </section>
  );
}

export default Slider;
