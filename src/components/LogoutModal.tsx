import { FiLogOut } from "react-icons/fi";

interface LogoutModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

function LogoutModal({ onConfirm, onClose }: LogoutModalProps){
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-wrap modal-icon-logout">
          <FiLogOut className="modal-big-icon modal-logout-color" />
        </div>
        <div className="modal-title">Log Out?</div>
        <div className="modal-sub">
          Are you sure you want to log out of your account?
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-logout-confirm" onClick={onConfirm}><FiLogOut /> Yes, Log Out</button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
