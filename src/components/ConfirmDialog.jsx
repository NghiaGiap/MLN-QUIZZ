import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function ConfirmDialog({ dialog, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (dialog) ref.current.showModal();
    else ref.current.close();
  }, [dialog]);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      aria-labelledby="confirm-title"
      className="confirm-dialog"
    >
      {dialog && (
        <>
          <button className="close-dialog" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
          <span className="eyebrow">TRƯỚC KHI TIẾP TỤC</span>
          <h2 id="confirm-title">{dialog.title}</h2>
          <p>{dialog.description}</p>
          <div className="dialog-actions">
            <button className="button secondary" autoFocus onClick={onClose}>
              Quay lại
            </button>
            <button
              className="button primary"
              onClick={() => {
                dialog.action();
                onClose();
              }}
            >
              {dialog.confirm}
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
