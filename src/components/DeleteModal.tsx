import { FiTrash2 } from "react-icons/fi";

interface DeleteModalProps {
  deleteInput: string;
  deleteError: boolean;
  onInputChange: (val: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

function DeleteModal({
  deleteInput,
  deleteError,
  onInputChange,
  onConfirm,
  onClose,
}: DeleteModalProps) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-wrap modal-icon-danger">
          <FiTrash2 className="modal-big-icon" />
        </div>
        <div className="modal-title">Delete Account?</div>
        <div className="modal-sub">
          Are you sure? This action is <strong>permanent</strong> and cannot be undone.
          All your progress, quizzes, and data will be lost forever.
        </div>
        <div className="field">
          <label>Type <strong>"delete"</strong> to confirm</label>
          <input
            className="form-input"
            placeholder='Type "delete" to confirm'
            value={deleteInput}
            onChange={(e) => onInputChange(e.target.value)}
            style={deleteError ? { borderColor: "#dc2626" } : {}}
          />
          {deleteError && <div className="pw-error">You must type "delete" to confirm.</div>}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}><FiTrash2 /> Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
