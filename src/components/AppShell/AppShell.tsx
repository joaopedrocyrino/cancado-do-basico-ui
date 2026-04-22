import { useState, type ReactNode } from 'react';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import './AppShell.css';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export interface AppShellProps {
  /** Items shown in the desktop sidebar nav and/or mobile tab bar */
  tabItems: NavItem[];
  /** Items shown only in desktop sidebar (not in mobile tab bar) */
  sidebarItems?: NavItem[];
  /** Items shown in the mobile "More" overflow popup */
  moreItems?: NavItem[];
  /** App name shown in the sidebar when not collapsed */
  logoText?: string;
  /** Custom logo element (takes precedence over logoText) */
  logo?: ReactNode;
  /** Content rendered in the sidebar footer alongside ThemeToggle */
  footer?: ReactNode;
  /** Label for the "More" tab button */
  moreLabel?: string;
  /** The current active path — used to apply .active class */
  currentPath?: string;
  /**
   * Renders a navigation link. Use this to integrate your router.
   * Defaults to a plain <a> tag.
   *
   * @example (React Router)
   * renderLink={(href, className, children) => (
   *   <NavLink to={href} className={({ isActive }) => isActive ? `${className} active` : className}>
   *     {children}
   *   </NavLink>
   * )}
   */
  renderLink?: (href: string, className: string, children: ReactNode) => ReactNode;
  children?: ReactNode;
}

// ── Icons ──────────────────────────────────────────────────────────────────────

const IconChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconMore = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.75" />
    <circle cx="12" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.75" />
    <circle cx="12" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.75" />
  </svg>
);

// ── Default link renderer ──────────────────────────────────────────────────────

function defaultRenderLink(href: string, className: string, children: ReactNode): ReactNode {
  return <a href={href} className={className}>{children}</a>;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function AppShell({
  tabItems,
  sidebarItems,
  moreItems,
  logoText,
  logo,
  footer,
  moreLabel = 'More',
  currentPath,
  renderLink,
  children,
}: AppShellProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const linkFn = renderLink ?? defaultRenderLink;

  const isActive = (href: string) => currentPath === href || currentPath?.startsWith(href + '/');

  const allSidebarItems = [...tabItems, ...(sidebarItems ?? [])];

  return (
    <div className="app-shell">

      {/* ── Sidebar — desktop only ──────────────────────────────────────────── */}
      <aside className="app-sidebar" data-collapsed={collapsed ? '' : undefined}>
        <div className="app-sidebar-top">
          {logo ?? (
            <span className="app-sidebar-wordmark">{logoText}</span>
          )}
          <button
            className="app-sidebar-collapse-btn"
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <IconChevronLeft />
          </button>
        </div>

        <nav className="app-sidebar-nav">
          {allSidebarItems.map(item =>
            linkFn(
              item.href,
              `app-sidebar-link${isActive(item.href) ? ' active' : ''}`,
              <>
                <span className="app-sidebar-icon">{item.icon}</span>
                <span className="app-sidebar-label">{item.label}</span>
              </>,
            )
          )}
        </nav>

        <div className="app-sidebar-footer">
          {footer}
          <div className="app-sidebar-toggles">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <main className="app-main">
        {children}
      </main>

      {/* ── Bottom tab bar — mobile only ────────────────────────────────────── */}
      <nav className="app-tab-bar" aria-label="Main navigation">
        {tabItems.map(item =>
          linkFn(
            item.href,
            `app-tab-item${isActive(item.href) ? ' active' : ''}`,
            <>
              <span className="app-tab-icon">{item.icon}</span>
              <span className="app-tab-label">{item.label}</span>
            </>,
          )
        )}

        {moreItems && moreItems.length > 0 && (
          <div className="app-tab-more-wrap">
            <button
              className={`app-tab-item app-tab-more-btn${moreOpen ? ' active' : ''}`}
              onClick={() => setMoreOpen(o => !o)}
              aria-expanded={moreOpen}
            >
              <span className="app-tab-icon"><IconMore /></span>
              <span className="app-tab-label">{moreLabel}</span>
            </button>

            {moreOpen && (
              <>
                <div className="app-more-backdrop" onClick={() => setMoreOpen(false)} />
                <div className="app-more-menu">
                  {moreItems.map(item =>
                    linkFn(
                      item.href,
                      `app-more-item${isActive(item.href) ? ' active' : ''}`,
                      item.label,
                    )
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}
