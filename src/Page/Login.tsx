import { useState } from "react";
import { MdEmail } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { IoArrowBack } from "react-icons/io5";
import logo from "../assets/logo3.png";
import img1 from "../assets/man.jpeg";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";
import { validateLogin } from "../validation/authValidation";
import { ROUTES } from "../config/routes";
import api from "../config/axios.config";
import { type LoginErrors } from "../interfaces/auth"; 

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [serverError, setServerError] = useState<string>("");

  const navigate = useNavigate();

  const handleSignIn = async (): Promise<void> => {
    setServerError("");

    const errs = validateLogin(email, password); 
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      setErrors({});
      setIsLoading(true);

      const response = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            full_name: response.data.user.full_name,
            username: response.data.user.username,
            email: response.data.user.email,
            profile_image: response.data.user.profile_image
              ? `${import.meta.env.VITE_STORAGE_URL}/${response.data.user.profile_image}` // ✅
              : null,
          })
        );
      }

      navigate("/dashboard");
    } catch (error: any) {
      setShake(true);
      setTimeout(() => setShake(false), 500);

      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <nav className="navbar1">
        <button className="back-btn" onClick={() => navigate(ROUTES.HOME)}>
          <IoArrowBack />
          <span>Back</span>
        </button>

        <div className="logo1">
          <img src={logo} alt="logo" className="logo-img1" />
        </div>

        <div className="navbar1-spacer" />
      </nav>

      <main className="main">
        <div className="hero-wrapper">
          <div className="hero-blob" />
          <img src={img1} alt="illustration" className="hero-img" />
        </div>

        <div className={`card1 ${shake ? "shake" : ""}`}>
          <h1 className="card1-title">Welcome Back</h1>
          <p className="card1-sub">Sign in to continue your learning journey</p>

          <div className="field">
            <label className="label">Email</label>
            <div className={`input-wrap ${emailFocused ? "focused" : ""}`}>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((p) => ({ ...p, email: "" })); 
                }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
              <MdEmail className={`icon ${emailFocused || email ? "icon-on" : ""}`} />
            </div>
            {errors.email && <p className="field-error">{errors.email}</p>} 
          </div>

          <div className="field">
            <label className="label">Password</label>
            <div className={`input-wrap ${passwordFocused ? "focused" : ""}`}>
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((p) => ({ ...p, password: "" })); 
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <span className="icon eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <AiFillEyeInvisible className={passwordFocused || password ? "icon-on" : ""} />
                ) : (
                  <AiFillEye className={passwordFocused || password ? "icon-on" : ""} />
                )}
              </span>
            </div>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          {serverError && <p className="field-error">{serverError}</p>}

          <button
            className={`signin-btn ${isLoading ? "loading" : ""}`}
            onClick={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner" /> : "Sign In"}
          </button>

          <p className="signup-text">
            Don't have an account?{" "}
            <span className="signup-link" onClick={() => navigate(ROUTES.SIGNUP)}>
              Sign up
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;