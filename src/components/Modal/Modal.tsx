import type { ReactNode } from 'react';
import './Modal.css';

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  maxWidth?: number;
  children: ReactNode;
}

export function Modal({ open, title, onClose, maxWidth = 560, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="m-overlay" onClick={onClose}>
      <div className="m-modal" style={{ maxWidth }} onClick={e => e.stopPropagation()}>
        <div className="m-header">
          <h2 className="m-title">{title}</h2>
          <button type="button" className="m-close" onClick={onClose} aria-label="Close">
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
