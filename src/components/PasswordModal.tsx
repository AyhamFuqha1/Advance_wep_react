import { FiLock } from "react-icons/fi";
import {type PasswordState } from "../interfaces/profile";

interface PasswordModalProps {
  pw: PasswordState;
  pwError: string;
  onPwChange: (pw: PasswordState) => void;
  onSave: () => void;
  onClose: () => void;
}

function PasswordModal({
  pw,
  pwError,
  onPwChange,
  onSave,
  onClose,
}: PasswordModalProps){
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-wrap modal-icon-lock">
          <FiLock className="modal-big-icon modal-lock-color" />
        </div>
        <div className="modal-title">Change Password</div>
        <div className="modal-sub">Enter your current password then choose a new one.</div>
        <div className="field">
          <label>Current Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={pw.current}
            onChange={(e) => onPwChange({ ...pw, current: e.target.value })}
          />
        </div>
        <div className="field">
          <label>New Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Min. 6 characters"
            value={pw.next}
            onChange={(e) => onPwChange({ ...pw, next: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Confirm New Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Repeat new password"
            value={pw.confirm}
            onChange={(e) => onPwChange({ ...pw, confirm: e.target.value })}
          />
        </div>
        {pwError && <div className="pw-error">{pwError}</div>}
   

<div className="modal-actions">
  <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
  <button 
    className="btn btn-primary" 
    onClick={(e) => {          
      e.stopPropagation();    
      onSave();
    }}
  >
    <FiLock /> Save Password
  </button>
</div>
      </div>
    </div>
  );
}

export default PasswordModal;
