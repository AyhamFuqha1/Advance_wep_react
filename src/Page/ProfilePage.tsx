import { useState, useRef, useEffect } from "react";
import {
  FiCamera, FiUser, FiMapPin, FiLinkedin, FiGithub,
  FiSettings,  FiLock, FiTrash2, FiEdit2, FiLogOut,
} from "react-icons/fi";
import "../css/ProfilePage.css";
import Navbar from "../components/Navbar";
import Field from "../components/Field";
import DeleteModal from "../components/DeleteModal";
import PasswordModal from "../components/PasswordModal";
import LogoutModal from "../components/LogoutModal";

import { validatePassword, validateDeleteConfirm } from "../validation/profileValidation";
import type { PasswordState } from "../interfaces/profile";

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

  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const pickAvatar = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const f = e.target.files?.[0];
    if (f) setAvatar(URL.createObjectURL(f));
  };

  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showPw, setShowPw] = useState<boolean>(false);
  const [deleteInput, setDeleteInput] = useState<string>("");
  const [deleteError, setDeleteError] = useState<boolean>(false);
  const [pw, setPw] = useState<PasswordState>({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState<string>("");

  const [showLogout, setShowLogout] = useState<boolean>(false);
  const handleLogout = (): void => { setShowLogout(false); showToast("Logged out successfully!"); };

  const [linkedinUrl, setLinkedinUrl] = useState<string>("");
  const [githubUrl, setGithubUrl] = useState<string>("");

  const [username, setUsername] = useState<string>("");
  const [editingUsername, setEditingUsername] = useState<boolean>(false);
  const [tempUsername, setTempUsername] = useState<string>("");
  const usernameRef = useRef<HTMLInputElement>(null);

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

  const [toast, setToast] = useState<string>("");
  const showToast = (msg: string): void => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleDeleteConfirm = (): void => {
    if (!validateDeleteConfirm(deleteInput)) { setDeleteError(true); return; }
    setShowDelete(false); setDeleteInput(""); setDeleteError(false);
    showToast("Account deleted.");
  };

  const handlePasswordSave = (): void => {
    const err = validatePassword(pw);
    if (err) return setPwError(err);
    setPwError(""); setShowPw(false); setPw({ current: "", next: "", confirm: "" });
    showToast("Password changed successfully!");
  };

  const closePw = (): void => { setShowPw(false); setPwError(""); setPw({ current: "", next: "", confirm: "" }); };
  const closeDel = (): void => { setShowDelete(false); setDeleteInput(""); setDeleteError(false); };

  return (
    <div>
      <Navbar />

      <div className="banner" />

      <div className="wrap">

        {/* PROFILE TOP */}
        <div className="profile-top">
          <div className="avatar-wrap" onClick={() => fileRef.current?.click()}>
            <div className="avatar-inner">
              {avatar ? <img src={avatar} alt="avatar" /> : <span className="avatar-placeholder">🤖</span>}
            </div>
            <div className="avatar-overlay">
              <FiCamera className="overlay-cam-icon" />
              <span>Change</span>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={pickAvatar} className="file-input-hidden" />
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
                  onKeyDown={(e) => { if (e.key === "Enter") saveUsername(); if (e.key === "Escape") setEditingUsername(false); }}
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
            <button className="btn btn-primary" onClick={() => showToast("Profile saved successfully!")}>
              Save Changes
            </button>
            <button className="btn btn-logout" onClick={() => setShowLogout(true)}>
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        {/* PERSONAL INFORMATION */}
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
                  <input className="form-input" />
                </Field>
                <Field label="Email Address">
                  <input className="form-input" type="email" />
                </Field>
           
                <Field label="Date of Birth">
                  <input className="form-input" type="date" />
                </Field>
                <Field label="Gender">
                  <select className="form-select">
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </Field>
                <div className="field personal-bio">
                  <label>Bio</label>
                  <textarea className="form-textarea" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOCATION & SOCIAL */}
        <div className="section reveal-card">
          <div className="card">
            <div className="card-head">
              <div className="card-icon card-icon-green">
                <FiMapPin className="card-react-icon icon-green" />
              </div>
              <h2 className="card-title"> Social</h2>
            </div>
            <div className="card-body">
             
              <div className="divider" />
              <div className="social-grid">
                <div className="social-item">
                  <button
                    className="social-icon social-linkedin social-icon-btn"
                    title="Open LinkedIn"
                    onClick={() => linkedinUrl && window.open(linkedinUrl.startsWith("http") ? linkedinUrl : "https://" + linkedinUrl, "_blank")}
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
                    onClick={() => githubUrl && window.open(githubUrl.startsWith("http") ? githubUrl : "https://" + githubUrl, "_blank")}
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

        {/* ACCOUNT SETTINGS */}
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

      {/* MODALS */}
      {showDelete && (
        <DeleteModal
          deleteInput={deleteInput}
          deleteError={deleteError}
          onInputChange={(val) => { setDeleteInput(val); setDeleteError(false); }}
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