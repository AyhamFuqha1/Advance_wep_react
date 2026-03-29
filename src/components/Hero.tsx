import hero from "../assets/ro.mp4";
import "../css/rebot.css";

function Hero() {
  return (
    <section className="section3">
      <video className="video3" autoPlay muted playsInline>
        <source src={hero} type="video/mp4" />
      </video>

      <button className="btn_begin">Begin Your Learning Journey</button>
    </section>
  );
}

export default Hero;
