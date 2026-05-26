import { useState, type FormEvent, type ReactNode } from 'react';
import './LoginPage.css';

export interface LoginPageLabels {
  email?: string;
  password?: string;
  submit?: string;
  submitting?: string;
  showPassword?: string;
  hidePassword?: string;
}

export interface LoginPageProps {
  /** Main heading, e.g. "Sign in to MyApp". */
  title: string;
  /** Optional secondary text shown under the title. */
  subtitle?: string;
  /** Small uppercase label shown above the title. */
  eyebrow?: string;
  /** Optional logo or branding rendered above the title. */
  logo?: ReactNode;
  /** Optional placeholder for the email field. Defaults to "you@example.com". */
  emailPlaceholder?: string;
  /** Initial value for the email field (useful for demos / pre-filled flows). */
  defaultEmail?: string;
  /**
   * Called when the user submits credentials. Throw to surface an error message.
   * The component handles loading state automatically.
   */
  onSubmit: (credentials: { email: string; password: string }) => Promise<void> | void;
  /**
   * Override field/button labels. Useful for i18n — combine with `useLang()` to
   * pass the right strings.
   */
  labels?: LoginPageLabels;
  /**
   * Floating top-right slot — typically `<ThemeToggle />` and `<LangToggle />`.
   * Positioned over the page, not in the card. Scrolls horizontally on overflow
   * (touch swipe, hidden scrollbar) so multiple toggles stay accessible on narrow screens.
   *
   * @example
   * headerSlot={(
   *   <>
   *     <LangToggle languages={LANGUAGES} />
   *     <ThemeToggle />
   *   </>
   * )}
   */
  headerSlot?: ReactNode;
  /**
   * Content rendered under the submit button — e.g. "Forgot password?" links,
   * "I have an invite" link, signup CTA.
   */
  footer?: ReactNode;
  /**
   * Supplementary content rendered below the card (still centered, same max-width).
   * Use for marketing copy, feature highlights, sign-up CTA, trust badges, legal links —
   * anything richer than the inline `footer` slot. Keeps the glass card focused while
   * letting the page carry more information when needed.
   */
  extras?: ReactNode;
  /** Extra class names appended to the root. */
  className?: string;
}

const DEFAULTS: Required<LoginPageLabels> = {
  email: 'Email',
  password: 'Password',
  submit: 'Sign in',
  submitting: 'Signing in…',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
};

export function LoginPage({
  title,
  subtitle,
  eyebrow,
  logo,
  emailPlaceholder = 'you@example.com',
  defaultEmail = '',
  onSubmit,
  labels,
  headerSlot,
  footer,
  extras,
  className,
}: LoginPageProps) {
  const text = { ...DEFAULTS, ...(labels ?? {}) };
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
    } finally {
      setLoading(false);
    }
  }

  const rootClass = ['login-page', className].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      {headerSlot ? <div className="login-page-chrome">{headerSlot}</div> : null}

      <div className="login-page-card">
        {logo ? <div className="login-page-logo">{logo}</div> : null}
        {eyebrow ? <span className="login-page-eyebrow">{eyebrow}</span> : null}
        <h1 className="login-page-title">{title}</h1>
        {subtitle ? <p className="login-page-subtitle">{subtitle}</p> : null}

        <form className="login-page-form" onSubmit={(event) => { void handleSubmit(event); }} noValidate>
          <div className="login-page-field">
            <label htmlFor="login-page-email">{text.email}</label>
            <input
              id="login-page-email"
              type="email"
              value={email}
              onChange={(event) => { setEmail(event.target.value); }}
              placeholder={emailPlaceholder}
              autoComplete="email"
              required
            />
          </div>

          <div className="login-page-field">
            <label htmlFor="login-page-password">{text.password}</label>
            <div className="login-page-password">
              <input
                id="login-page-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => { setPassword(event.target.value); }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-page-reveal"
                onClick={() => { setShowPassword((value) => !value); }}
                aria-label={showPassword ? text.hidePassword : text.showPassword}
                title={showPassword ? text.hidePassword : text.showPassword}
              >
                {showPassword ? <EyeOff /> : <EyeOn />}
              </button>
            </div>
          </div>

          {error ? <p className="login-page-error" role="alert">{error}</p> : null}

          <button type="submit" className="login-page-submit" disabled={loading}>
            {loading ? text.submitting : text.submit}
          </button>
        </form>

        {footer ? <p className="login-page-footer">{footer}</p> : null}
      </div>

      {extras ? <div className="login-page-extras">{extras}</div> : null}
    </div>
  );
}

function EyeOn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
