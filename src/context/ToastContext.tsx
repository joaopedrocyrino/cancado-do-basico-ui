import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import './toast.css';

// ── Types ──────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warn' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
  dismissing: boolean;
}

export interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  warn: (message: string) => void;
  info: (message: string) => void;
}

// ── Icons ──────────────────────────────────────────────────────────────────────

const IconSuccess = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
    <path d="M7.5 12l3 3 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconError = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
    <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const IconWarn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3L2 20h20L12 3z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M12 10v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="12" cy="17" r="0.75" fill="currentColor" />
  </svg>
);

const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
    <path d="M12 11v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="12" cy="8" r="0.75" fill="currentColor" />
  </svg>
);

const IconClose = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const ICONS = {
  success: <IconSuccess />,
  error: <IconError />,
  warn: <IconWarn />,
  info: <IconInfo />,
};

// ── Container ──────────────────────────────────────────────────────────────────

function ToastContainer({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(item => (
        <div
          key={item.id}
          className={`toast-item toast-item--${item.type}${item.dismissing ? ' toast-item--out' : ''}`}
          role="alert"
        >
          <span className="toast-icon">{ICONS[item.type]}</span>
          <span className="toast-message">{item.message}</span>
          <button className="toast-close" onClick={() => onDismiss(item.id)} aria-label="Close">
            <IconClose />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Context + Provider ─────────────────────────────────────────────────────────

const ToastContext = createContext<ToastApi | null>(null);

let nextId = 0;
const DURATION = 4500;
const EXIT_MS = 200;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts(t => t.map(x => x.id === id ? { ...x, dismissing: true } : x));
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), EXIT_MS);
  }, []);

  const add = useCallback((type: ToastType, message: string) => {
    const id = ++nextId;
    setToasts(t => [...t, { id, type, message, dismissing: false }]);
    timers.current.set(id, setTimeout(() => dismiss(id), DURATION));
  }, [dismiss]);

  const toast = useMemo<ToastApi>(() => ({
    success: msg => add('success', msg),
    error: msg => add('error', msg),
    warn: msg => add('warn', msg),
    info: msg => add('info', msg),
  }), [add]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
