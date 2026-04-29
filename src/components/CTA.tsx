import { useEffect, useRef } from "react";
import "../css/cta.css";
import portal from "../assets/portal.png";
import { useNavigate } from "react-router-dom";

function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();


  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedIn = !!localStorage.getItem("token");
  const displayName = user?.username || user?.full_name || user?.email || "";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible"));
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="cta-section" ref={sectionRef}>

      <div className="cta-portal">
        <img src={portal} alt="portal" className="cta-portal-img" />
      </div>

      <div className="cta-content">

        {isLoggedIn && displayName && (
          <p className="cta-hello">👋 Hello, {displayName}!</p>
        )}

        <h2 className="cta-title">
          Step Into Your<br />
          Smart Learning Future<br />
        </h2>
        <p className="cta-desc">
          Transform your learning with an all-in-one AI platform. Master complex topics through automated summaries, adaptive quizzes, and smart study plans—all tracked with real-time analytics in one seamless experience.
        </p>
        <div className="cta-btns">
      
          {!isLoggedIn && (
            <>
              <button className="cta-btn fill" onClick={() => navigate('/signup')}>
                Create Account
              </button>
              <button className="cta-btn ghost" onClick={() => navigate('/login')}>
                Login
              </button>
            </>
          )}
        </div>
      </div>

    </section>
  );
}

export default CTA;