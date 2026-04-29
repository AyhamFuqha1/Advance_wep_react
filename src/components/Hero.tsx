import hero from "../assets/ro.mp4";
import "../css/rebot.css";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes";

function Hero() {
  const navigate = useNavigate(); // ✅ هذا مهم

  return (
    <section className="section3">
      <video className="video3" autoPlay muted playsInline>
        <source src={hero} type="video/mp4" />
      </video>

      <button 
        className="btn_begin" 
        onClick={() => navigate(ROUTES.DASHBOARD)}
      >
        Begin Your Learning Journey
      </button>
    </section>
  );
}

export default Hero;