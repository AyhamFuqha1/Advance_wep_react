import { useEffect, useRef, useState, useCallback } from "react";
import logo from "../assets/logo2.png";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { MdPersonAddAlt, MdLogout } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { FiBarChart2 } from "react-icons/fi";
import "../css/Navbar.css";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes";
import api from "../config/axios.config";

type StoredUser = {
  full_name?: string | null;
  username?: string | null;
  email?: string | null;
  profile_image?: string | null;
};

const getStoredUser = (): StoredUser | null => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<StoredUser | null>(null);

  const profileRef = useRef<HTMLDivElement | null>(null);

  const syncUser = useCallback(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    syncUser();
    window.addEventListener("userUpdated", syncUser); 
    return () => window.removeEventListener("userUpdated", syncUser); 
  }, [syncUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const protectedRoutes = [
    ROUTES.DASHBOARD,
    ROUTES.PROFILE,
    ROUTES.ANALYTICS,
    ROUTES.SUBJECTS,
  ];

  const handleNav = (path: string): void => {
    const token = localStorage.getItem("token");
    const isProtected = protectedRoutes.includes(path);

    if (isProtected && !token) {
      navigate(ROUTES.LOGIN);
      setMenuOpen(false);
      setProfileOpen(false);
      return;
    }

    navigate(path);
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await api.post("/logout");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUser(null);
      setProfileOpen(false);
      navigate(ROUTES.LOGIN);
    }
  };

  const displayName =
    user?.username || user?.full_name || user?.email || "Profile";

  return (
    <>
      <nav className="navbar">
        <div className="nav-top">
          <div className="nav-right">
            {!isLoggedIn ? (
              <>
                <a onClick={() => navigate(ROUTES.LOGIN)} className="nav-login">
                  Log In
                </a>
                <a
                  id="nav-signup"
                  className="icon-link"
                  onClick={() => navigate(ROUTES.SIGNUP)}
                >
                  <span className="signup-icon">
                    <MdPersonAddAlt />
                  </span>
                </a>
              </>
            ) : (
              <div className="profile-menu-wrapper" ref={profileRef}>
                <button
                  className={`profile-trigger ${profileOpen ? "open" : ""}`}
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  {user?.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt="profile"
                      className="profile-avatar"
                    />
                  ) : (
                    <span className="profile-avatar fallback-avatar">
                      <FaUserCircle />
                    </span>
                  )}
                  <span className="profile-name">{displayName}</span>
                </button>

                <div className={`profile-dropdown ${profileOpen ? "show" : ""}`}>
                  <div className="profile-dropdown-header">
                    {user?.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt="profile"
                        className="profile-avatar large"
                      />
                    ) : (
                      <span className="profile-avatar fallback-avatar large">
                        <FaUserCircle />
                      </span>
                    )}
                    <div className="profile-texts">
                      <strong>{displayName}</strong>
                      <span>{user?.email || "SmartStudy user"}</span>
                    </div>
                  </div>

                  <button
                    className="dropdown-item"
                    onClick={() => handleNav(ROUTES.PROFILE)}
                  >
                    <IoPerson />
                    Profile
                  </button>

                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <MdLogout />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="logo">
            <img src={logo} alt="SmartStudy Logo" />
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
        </div>

        <div className="nav-links-under-logo">
          <a onClick={() => handleNav(ROUTES.HOME)} id="nav-home">
            <span className="home-icon">
              <FaHome />
            </span>
          </a>

          <a onClick={() => handleNav(ROUTES.DASHBOARD)} className="active-link">
            Dashboard
          </a>

          <a onClick={() => handleNav(ROUTES.SUBJECTS)}>
            Summaries
          </a>

          <a onClick={() => handleNav(ROUTES.ANALYTICS)}>
            <FiBarChart2 /> Analytics
          </a>

          <a onClick={() => handleNav(ROUTES.SUBJECTS)}>
            Quizzes
          </a>

          <a onClick={() => handleNav(ROUTES.StudyPlan)}>
            Study Plan
          </a>
        </div>
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
          <FiBarChart2 /> Analytics
        </a>

        {!isLoggedIn ? (
          <>
            <a onClick={() => handleNav(ROUTES.LOGIN)}>Log In</a>
            <a id="nav-signup-mobile" onClick={() => handleNav(ROUTES.SIGNUP)}>
              <MdPersonAddAlt /> Sign Up
            </a>
          </>
        ) : (
          <>
            <a onClick={() => handleNav(ROUTES.PROFILE)}>
              <IoPerson /> Profile
            </a>
            <a onClick={handleLogout}>
              <MdLogout /> Logout
            </a>
          </>
        )}
      </div>
    </>
  );
}

export default Navbar;