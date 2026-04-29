import { useState, useRef, useEffect } from "react";
import {
  FiCamera, FiUser, FiMapPin, FiLinkedin, FiGithub,
  FiSettings, FiLock, FiTrash2, FiEdit2,
} from "react-icons/fi";
import "../css/ProfilePage.css";
import Field from "../components/Field";
import DeleteModal from "../components/DeleteModal";
import PasswordModal from "../components/PasswordModal";
import LogoutModal from "../components/LogoutModal";
import { validatePassword, validateDeleteConfirm } from "../validation/profileValidation";
import type { PasswordState } from "../interfaces/profile";
import api from "../config/axios.config";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes";
import { emitUserUpdated } from "../utils/userEvents"; 

const STORAGE_URL = "http://127.0.0.1:8000/storage";

function useScrollReveal(): void {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal-card").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function ProfilePage() {
  useScrollReveal();
  const navigate = useNavigate();

  const fileRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [linkedinUrl, setLinkedinUrl] = useState<string>("");
  const [githubUrl, setGithubUrl] = useState<string>("");

  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showPw, setShowPw] = useState<boolean>(false);
  const [showLogout, setShowLogout] = useState<boolean>(false);

  const [deleteInput, setDeleteInput] = useState<string>("");
  const [deleteError, setDeleteError] = useState<boolean>(false);

  const [pw, setPw] = useState<PasswordState>({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState<string>("");

  const [username, setUsername] = useState<string>("");
  const [editingUsername, setEditingUsername] = useState<boolean>(false);
  const [tempUsername, setTempUsername] = useState<string>("");
  const usernameRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const showToast = (msg: string): void => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const pickAvatar = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const f = e.target.files?.[0];
    if (f) {
      setAvatarFile(f);
      setAvatar(URL.createObjectURL(f));
    }
  };

  const startEditUsername = (): void => {
    setTempUsername(username);
    setEditingUsername(true);
    setTimeout(() => usernameRef.current?.focus(), 50);
  };

  const saveUsername = (): void => {
    const v = tempUsername.trim();
    if (v) setUsername(v);
    setEditingUsername(false);
  };

  const closePw = (): void => {
    setShowPw(false);
    setPwError("");
    setPw({ current: "", next: "", confirm: "" });
  };

  const closeDel = (): void => {
    setShowDelete(false);
    setDeleteInput("");
    setDeleteError(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        const user = res.data.user;

        setFullName(user.full_name || "");
        setEmail(user.email || "");
        setUsername(user.username || "");
        setDateOfBirth(user.profile?.date_of_birth || "");
        setGender(user.profile?.gender || "");
        setBio(user.profile?.bio || "");
        setLinkedinUrl(user.profile?.linkedin_url || "");
        setGithubUrl(user.profile?.github_url || "");

        if (user.profile?.avatar) {
          const avatarUrl = `${STORAGE_URL}/${user.profile.avatar}`;
          setAvatar(avatarUrl);

          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...storedUser,
              full_name: user.full_name || "",
              username: user.username || "",
              email: user.email || "",
              profile_image: avatarUrl,
            })
          );
          emitUserUpdated(); 
        } else {
          setAvatar(null);
        }
      } catch {
        showToast("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (): Promise<void> => {
  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("date_of_birth", dateOfBirth);
    formData.append("gender", gender);
    formData.append("bio", bio);
    formData.append("linkedin_url", linkedinUrl);
    formData.append("github_url", githubUrl);
    if (avatarFile) formData.append("avatar", avatarFile);

    
    const profileResponse = await api.post("/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const userResponse = await api.put("/user", {
      full_name: fullName,
      email,
      username,
    });

    let savedAvatarUrl = avatar;
    if (profileResponse.data?.profile?.avatar) {
      savedAvatarUrl = `${STORAGE_URL}/${profileResponse.data.profile.avatar}`;
      setAvatar(savedAvatarUrl);
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        full_name: userResponse.data?.user?.full_name || fullName,
        username: userResponse.data?.user?.username || username,
        email: userResponse.data?.user?.email || email,
        profile_image: savedAvatarUrl,
      })
    );
    emitUserUpdated();

    setAvatarFile(null);
    showToast("Profile saved successfully!");
  } catch (error: any) {
    if (error.response?.data?.message) {
      showToast(error.response.data.message);
    } else {
      showToast("Error saving profile");
    }
  } finally {
    setLoading(false);
  }
};

  const handlePasswordSave = async (): Promise<void> => {
    const err = validatePassword(pw);
    if (err) {
      setPwError(err);
      return;
    }

    try {
      await api.put("/user/password", {
        current_password: pw.current,
        password: pw.next,
        password_confirmation: pw.confirm,
      });

      closePw();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      emitUserUpdated();

      showToast("Password changed successfully! Please login again.");
      setTimeout(() => navigate(ROUTES.LOGIN), 1200);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        setPwError(
          errors.current_password?.[0] ||
          errors.password?.[0] ||
          "Validation failed"
        );
      } else if (error.response?.data?.message) {
        setPwError(error.response.data.message);
      } else {
        setPwError("Error changing password");
      }
    }
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!validateDeleteConfirm(deleteInput)) {
      setDeleteError(true);
      return;
    }

    try {
      await api.delete("/user");

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      emitUserUpdated();

      closeDel();
      showToast("Account deleted.");
      setTimeout(() => navigate(ROUTES.HOME), 1200);
    } catch {
      showToast("Error deleting account");
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await api.post("/logout");
    } finally {
      setShowLogout(false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      emitUserUpdated();
      showToast("Logged out successfully!");
      setTimeout(() => navigate(ROUTES.LOGIN), 1000);
    }
  };

  return (
    <div>
      <div className="banner" />

      <div className="wrap">
        <div className="profile-top">
          <div className="avatar-wrap" onClick={() => fileRef.current?.click()}>
            <div className="avatar-inner">
              {avatar ? (
                <img src={avatar} alt="avatar" />
              ) : (
                <span className="avatar-placeholder">🤖</span>
              )}
            </div>
            <div className="avatar-overlay">
              <FiCamera className="overlay-cam-icon" />
              <span>Change</span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={pickAvatar}
              className="file-input-hidden"
            />
          </div>

          <div className="username-block">
            {editingUsername ? (
              <div className="username-edit-row">
                <span className="username-at">@</span>
                <input
                  ref={usernameRef}
                  className="username-input"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveUsername();
                    if (e.key === "Escape") setEditingUsername(false);
                  }}
                  placeholder="username"
                  maxLength={30}
                />
                <button className="username-save-btn" onClick={saveUsername}>✓</button>
                <button className="username-cancel-btn" onClick={() => setEditingUsername(false)}>✕</button>
              </div>
            ) : (
              <div className="username-display-row" onClick={startEditUsername} title="Edit username">
                <span className="username-at">@</span>
                <span className="username-text">{username || "set username"}</span>
                <FiEdit2 className="username-edit-icon" />
              </div>
            )}
            <div className="username-hint">Click to edit your username</div>
          </div>

          <div className="top-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="section reveal-card">
          <div className="card">
            <div className="card-head">
              <div className="card-icon card-icon-blue">
                <FiUser className="card-react-icon icon-blue" />
              </div>
              <h2 className="card-title">Personal Information</h2>
            </div>
            <div className="card-body">
              <div className="personal-grid">
                <Field label="Full Name">
                  <input
                    className="form-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Field>

                <Field label="Email Address">
                  <input
                    className="form-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>

                <Field label="Date of Birth">
                  <input
                    className="form-input"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </Field>

                <Field label="Gender">
                  <select
                    className="form-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    
                  </select>
                </Field>

                <div className="field personal-bio">
                  <label>Bio</label>
                  <textarea
                    className="form-textarea"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section reveal-card">
          <div className="card">
            <div className="card-head">
              <div className="card-icon card-icon-green">
                <FiMapPin className="card-react-icon icon-green" />
              </div>
              <h2 className="card-title">Social</h2>
            </div>
            <div className="card-body">
              <div className="divider" />
              <div className="social-grid">
                <div className="social-item">
                  <button
                    className="social-icon social-linkedin social-icon-btn"
                    title="Open LinkedIn"
                    onClick={() =>
                      linkedinUrl &&
                      window.open(
                        linkedinUrl.startsWith("http") ? linkedinUrl : "https://" + linkedinUrl,
                        "_blank"
                      )
                    }
                  >
                    <FiLinkedin className="social-react-icon" />
                  </button>
                  <div className="social-input-wrap">
                    <div className="social-name">LinkedIn</div>
                    <input
                      className="form-input social-url-input"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div className="social-item">
                  <button
                    className="social-icon social-github social-icon-btn"
                    title="Open GitHub"
                    onClick={() =>
                      githubUrl &&
                      window.open(
                        githubUrl.startsWith("http") ? githubUrl : "https://" + githubUrl,
                        "_blank"
                      )
                    }
                  >
                    <FiGithub className="social-react-icon" />
                  </button>
                  <div className="social-input-wrap">
                    <div className="social-name">GitHub</div>
                    <input
                      className="form-input social-url-input"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section reveal-card">
          <div className="card">
            <div className="card-head">
              <div className="card-icon card-icon-yellow">
                <FiSettings className="card-react-icon icon-yellow settings-gear" />
              </div>
              <h2 className="card-title">Account Settings</h2>
            </div>
            <div className="card-body">
              <div className="account-row">
                <div>
                  <div className="account-row-label">Change Password</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowPw(true)}>
                  <FiLock /> Change
                </button>
              </div>

              <div className="account-row">
                <div>
                  <div className="account-row-label">Delete Account</div>
                  <div className="account-row-sub">All your data will be permanently deleted</div>
                </div>
                <button className="btn-delete" onClick={() => setShowDelete(true)}>
                  <FiTrash2 /> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDelete && (
        <DeleteModal
          deleteInput={deleteInput}
          deleteError={deleteError}
          onInputChange={(val) => {
            setDeleteInput(val);
            setDeleteError(false);
          }}
          onConfirm={handleDeleteConfirm}
          onClose={closeDel}
        />
      )}

      {showPw && (
        <PasswordModal
          pw={pw}
          pwError={pwError}
          onPwChange={setPw}
          onSave={handlePasswordSave}
          onClose={closePw}
        />
      )}

      {showLogout && (
        <LogoutModal
          onConfirm={handleLogout}
          onClose={() => setShowLogout(false)}
        />
      )}

      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}