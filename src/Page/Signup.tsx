import { useState } from "react";
import { MdEmail } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { IoArrowBack } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import logo from "../assets/logo3.png";
import img1 from "../assets/wo.png";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";
import { validateSignUp } from "../validation/authValidation";
import { ROUTES } from "../config/routes";
import { type SignUpErrors } from "../interfaces/auth";
import api from "../config/axios.config";

function SignUp() {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [agreed, setAgreed] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [nameFocused, setNameFocused] = useState<boolean>(false);
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [confirmFocused, setConfirmFocused] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [serverError, setServerError] = useState<string>("");

  const navigate = useNavigate();

  const handleSignUp = async (): Promise<void> => {
    setServerError("");

    const errs = validateSignUp(fullName, email, password, confirmPassword, agreed);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      setErrors({});
      setIsLoading(true);

      const response = await api.post("/register", {
        full_name: fullName,
        email,
        password,
        password_confirmation: confirmPassword,
        agreed_to_terms: agreed,
      });

      localStorage.setItem("token", response.data.token);

      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            full_name: response.data.user.full_name,
            username: response.data.user.username,
            email: response.data.user.email,
            profile_image: null,
          })
        );
      }

      navigate("/profile");
    } catch (error: any) {
      setShake(true);
      setTimeout(() => setShake(false), 500);

      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        setErrors({
          fullName: backendErrors.full_name?.[0] || "",
          email: backendErrors.email?.[0] || "",
          password: backendErrors.password?.[0] || "",
          confirmPassword: backendErrors.password_confirmation?.[0] || "",
          agreed: backendErrors.agreed_to_terms?.[0] || "",
        });
      } else if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Sign up failed");
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
          <h1 className="card1-title">Create Account</h1>
          <p className="card1-sub">Start your free trial</p>

          <div className="field">
            <label className="label">Full Name</label>
            <div className={`input-wrap ${nameFocused ? "focused" : ""}`}>
              <input
                type="text"
                className="input"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setErrors((p) => ({ ...p, fullName: "" }));
                }}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
              <FaUser className={`icon ${nameFocused || fullName ? "icon-on" : ""}`} />
            </div>
            {errors.fullName && <p className="field-error">{errors.fullName}</p>}
          </div>

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

          <div className="field">
            <label className="label">Confirm Password</label>
            <div className={`input-wrap ${confirmFocused ? "focused" : ""}`}>
              <input
                type={showConfirm ? "text" : "password"}
                className="input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((p) => ({ ...p, confirmPassword: "" }));
                }}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
              />
              <span className="icon eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? (
                  <AiFillEyeInvisible
                    className={confirmFocused || confirmPassword ? "icon-on" : ""}
                  />
                ) : (
                  <AiFillEye className={confirmFocused || confirmPassword ? "icon-on" : ""} />
                )}
              </span>
            </div>
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
          </div>

          <div className="field-checkbox">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setErrors((p) => ({ ...p, agreed: "" }));
              }}
            />
            <label htmlFor="terms">
              I agree to <span className="terms-link">Terms &amp; Conditions</span>
            </label>
            {errors.agreed && <p className="field-error">{errors.agreed}</p>}
          </div>

          {serverError && <p className="field-error">{serverError}</p>}

          <button
            className={`signin-btn ${isLoading ? "loading" : ""}`}
            onClick={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner" /> : "Sign Up"}
          </button>

          <p className="signup-text">
            Already have an account?{" "}
            <span className="signup-link" onClick={() => navigate(ROUTES.LOGIN)}>
              Login
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}

export default SignUp;