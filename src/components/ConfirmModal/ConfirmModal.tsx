import './ConfirmModal.css';

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <div className="confirm-body">
          <h3 className="confirm-title">{title}</h3>
          <p className="confirm-message">{message}</p>
        </div>
        <div className="confirm-actions">
          <button type="button" className="confirm-btn-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`confirm-btn-ok${destructive ? ' confirm-btn-ok--destructive' : ''}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
