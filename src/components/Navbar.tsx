import { useState } from "react";
import logo from "../assets/logo2.png";
import { FaHome } from "react-icons/fa";
import { MdPersonAddAlt } from "react-icons/md";
import "../css/Navbar.css";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes";

function Navbar(){
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleNav = (path: string): void => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">

        <div className="nav-left">
          <a onClick={() => navigate(ROUTES.HOME)} id="nav-home">
            <span className="home-icon"><FaHome /></span>
          </a>

          <a onClick={() => navigate(ROUTES.DASHBOARD)} className="active-link">
            Dashboard
          </a>

          <a onClick={() => navigate(ROUTES.PROFILE)}>
            Subjects
          </a>

          <a onClick={() => navigate(ROUTES.ANALYTICS)} id="nav-analytics">
            <span className="analytics-icon">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </span>
            Analytics
          </a>
        </div>

        <div className="logo">
          <img src={logo} alt="SmartStudy Logo" />
        </div>

        <div className="nav-right">
          <a onClick={() => navigate(ROUTES.LOGIN)} className="nav-login">
            Log In
          </a>

          <a id="nav-signup" className="icon-link" onClick={() => navigate(ROUTES.SIGNUP)}>
            <span className="signup-icon"><MdPersonAddAlt /></span>
          </a>
        </div>

        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <a onClick={() => handleNav(ROUTES.HOME)}>
          <FaHome /> Home
        </a>

        <a onClick={() => handleNav(ROUTES.DASHBOARD)} className="active-link">
          Dashboard
        </a>

        <a onClick={() => handleNav(ROUTES.SUBJECTS)}>
          Subjects
        </a>

        <a onClick={() => handleNav(ROUTES.ANALYTICS)}>
          Analytics
        </a>

        <a onClick={() => handleNav(ROUTES.LOGIN)}>
          Log In
        </a>

        <a id="nav-signup-mobile" onClick={() => handleNav(ROUTES.SIGNUP)}>
          <MdPersonAddAlt /> Sign Up
        </a>
      </div>
    </>
  );
}

export default Navbar;
