import "../css/Footer.css";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-col">
        <h3 className="footer-brand">SmartStudy AI</h3>
        <p className="footer-about">
          AI-powered learning made simple, smart, and efficient for everyone.
        </p>
      </div>



      <div className="footer-col">
        <h4 className="footer-heading">Contact Us</h4>
        <p className="footer-email">support@smartstudy.ai</p>
        <div className="footer-socials">
          <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
