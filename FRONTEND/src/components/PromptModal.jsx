export default function PromptModal({
  isOpen,
  type = "confirm",
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Okay",
  cancelText = "Cancel",
}) {
  if (!isOpen) return null;

  const isConfirm = type === "confirm";

  const iconMap = {
    success: "fa-circle-check",
    error: "fa-circle-exclamation",
    confirm: "fa-trash-can",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`prompt-modal prompt-${type}`}
        onClick={(event) => event.stopPropagation()}
      >
        {!isConfirm && (
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}

        <div className="prompt-icon">
          <i className={`fa-solid ${iconMap[type]}`}></i>
        </div>

        <h2>{title}</h2>
        <p>{message}</p>

        <div className="prompt-actions">
          {isConfirm && (
            <button
              type="button"
              className="prompt-cancel-btn"
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            className={`prompt-confirm-btn ${isConfirm ? "danger-btn" : ""}`}
            onClick={isConfirm ? onConfirm : onClose}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
