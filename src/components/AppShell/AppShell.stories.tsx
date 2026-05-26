import type { Meta, StoryObj } from '@storybook/react';
import { AppShell } from './AppShell';
import { ThemeProvider } from '../../context/ThemeContext';
import { ToastProvider } from '../../context/ToastContext';
import { LangProvider, useLang, type LanguageOption } from '../../context/LangContext';

const LANGUAGES: LanguageOption[] = [
  { code: 'pt-BR', label: 'PT', flag: '🇧🇷', ariaLabel: 'Português (Brasil)' },
  { code: 'en', label: 'EN', flag: '🇺🇸', ariaLabel: 'English' },
];

const meta: Meta<typeof AppShell> = {
  title: 'Components/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
  decorators: [
    Story => (
      <ThemeProvider>
        <ToastProvider>
          <LangProvider defaultLang="pt-BR">
            <Story />
          </LangProvider>
        </ToastProvider>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AppShell>;

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.75" />
    <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.75" />
    <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const COPY: Record<string, { heading: string; body: string; hint: string }> = {
  'pt-BR': {
    heading: 'Conteúdo da página',
    body: 'Aqui é onde o conteúdo da sua página é renderizado (via children ou Outlet do router).',
    hint: 'Use o seletor de idioma no rodapé da sidebar para alternar entre PT-BR e EN.',
  },
  en: {
    heading: 'Page content',
    body: 'This is where your page content renders (via children or router Outlet).',
    hint: 'Use the language toggle in the sidebar footer to switch between PT-BR and EN.',
  },
};

function StoryContent() {
  const { lang } = useLang();
  const copy = COPY[lang] ?? COPY.en;
  return (
    <div style={{ padding: 24, color: 'var(--label-primary)' }}>
      <h2>{copy.heading}</h2>
      <p>{copy.body}</p>
      <p style={{ color: 'var(--label-secondary)', fontSize: '0.875rem' }}>{copy.hint}</p>
      <p style={{ color: 'var(--label-secondary)', fontSize: '0.75rem' }}>
        <code>useLang().lang</code> → <strong>{lang}</strong>
      </p>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <AppShell
      logoText="MyApp"
      currentPath="/dashboard"
      tabItems={[
        { href: '/dashboard', label: 'Dashboard', icon: <CalendarIcon /> },
        { href: '/users', label: 'Users', icon: <UsersIcon /> },
      ]}
      sidebarItems={[
        { href: '/settings', label: 'Settings', icon: <SettingsIcon /> },
      ]}
      moreItems={[
        { href: '/settings', label: 'Settings', icon: <SettingsIcon /> },
      ]}
      languages={LANGUAGES}
      renderLink={(href, className, children) => (
        <a href={href} className={className}>{children}</a>
      )}
    >
      <StoryContent />
    </AppShell>
  ),
};

export const WithoutLanguageToggle: Story = {
  name: 'Without language toggle',
  render: () => (
    <AppShell
      logoText="MyApp"
      currentPath="/dashboard"
      tabItems={[
        { href: '/dashboard', label: 'Dashboard', icon: <CalendarIcon /> },
        { href: '/users', label: 'Users', icon: <UsersIcon /> },
      ]}
      sidebarItems={[
        { href: '/settings', label: 'Settings', icon: <SettingsIcon /> },
      ]}
      renderLink={(href, className, children) => (
        <a href={href} className={className}>{children}</a>
      )}
    >
      <StoryContent />
    </AppShell>
  ),
};
