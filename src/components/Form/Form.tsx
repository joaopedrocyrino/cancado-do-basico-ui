import { useCallback, useState, type ReactNode } from 'react';
import { Modal } from '../Modal/Modal';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import './Form.css';

export interface FormProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  error?: string;
  saveLabel?: string;
  cancelLabel?: string;
  onDelete?: () => void;
  deleteLabel?: string;
  /** Labels for the delete confirm dialog */
  deleteConfirmTitle?: string;
  deleteConfirmMessage?: string;
  maxWidth?: number;
  children: ReactNode;
}

export function Form({
  open,
  title,
  onClose,
  onSubmit,
  error,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  onDelete,
  deleteLabel = 'Delete',
  deleteConfirmTitle = 'Delete?',
  deleteConfirmMessage = 'This action cannot be undone.',
  maxWidth = 560,
  children,
}: FormProps) {
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const onSave = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    if (!onSubmit) return;
    setSaving(true);
    onSubmit(e).finally(() => setSaving(false));
  }, [onSubmit]);

  if (!open) return null;

  return (
    <>
      {onDelete && (
        <ConfirmModal
          open={confirmDelete}
          title={deleteConfirmTitle}
          message={deleteConfirmMessage}
          confirmLabel={deleteLabel}
          cancelLabel={cancelLabel}
          onConfirm={() => { setConfirmDelete(false); void onDelete(); }}
          onCancel={() => setConfirmDelete(false)}
          destructive
        />
      )}
      <Modal title={title} maxWidth={maxWidth} onClose={onClose} open={open}>
        <form className="f-body" onSubmit={e => { void onSave(e); }}>
          {children}

          {error && <p className="f-error">{error}</p>}

          {onSubmit && (
            <div className="f-footer">
              {onDelete && (
                <button type="button" className="f-btn-delete" onClick={() => setConfirmDelete(true)}>
                  {deleteLabel}
                </button>
              )}
              <div className="f-footer-spacer" />
              <button type="button" className="f-btn-cancel" onClick={onClose}>
                {cancelLabel}
              </button>
              <button type="submit" className="f-btn-save" disabled={saving}>
                {saveLabel}
              </button>
            </div>
          )}
        </form>
      </Modal>
    </>
  );
}
