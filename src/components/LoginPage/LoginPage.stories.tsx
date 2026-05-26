import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LoginPage } from './LoginPage';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { LangToggle } from '../LangToggle/LangToggle';
import { ThemeProvider, BRAND_ACCENTS, type BrandAccent } from '../../context/ThemeContext';
import { LangProvider, useLang, type LanguageOption } from '../../context/LangContext';

const LANGUAGES: LanguageOption[] = [
  { code: 'pt-BR', label: 'PT', flag: '🇧🇷', ariaLabel: 'Português (Brasil)' },
  { code: 'en', label: 'EN', flag: '🇺🇸', ariaLabel: 'English' },
];

const COPY = {
  'pt-BR': {
    eyebrow: 'Acesso ao estúdio',
    title: 'Entrar no MyApp',
    subtitle: 'Use seu email e senha para acessar o painel.',
    email: 'Email',
    password: 'Senha',
    submit: 'Entrar',
    submitting: 'Entrando…',
    showPassword: 'Mostrar senha',
    hidePassword: 'Ocultar senha',
    footer: 'Tem um convite?',
    footerLink: 'Defina sua senha.',
  },
  en: {
    eyebrow: 'Studio access',
    title: 'Sign in to MyApp',
    subtitle: 'Use your email and password to access the dashboard.',
    email: 'Email',
    password: 'Password',
    submit: 'Sign in',
    submitting: 'Signing in…',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    footer: 'Got an invite?',
    footerLink: 'Set your password.',
  },
} as const;

const meta: Meta<typeof LoginPage> = {
  title: 'Components/LoginPage',
  component: LoginPage,
  parameters: { layout: 'fullscreen' },
  decorators: [
    Story => (
      <ThemeProvider>
        <LangProvider defaultLang="pt-BR">
          <Story />
        </LangProvider>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LoginPage>;

function LocalizedLogin() {
  const { lang } = useLang();
  const copy = COPY[lang as keyof typeof COPY] ?? COPY.en;
  return (
    <LoginPage
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
      defaultEmail="owner@black-needle.studio"
      labels={{
        email: copy.email,
        password: copy.password,
        submit: copy.submit,
        submitting: copy.submitting,
        showPassword: copy.showPassword,
        hidePassword: copy.hidePassword,
      }}
      onSubmit={async ({ email, password }) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (password !== 'demo') {
          throw new Error(lang === 'pt-BR' ? 'Senha incorreta.' : 'Wrong password.');
        }
        alert(`Signed in as ${email}`);
      }}
      headerSlot={
        <>
          <LangToggle languages={LANGUAGES} />
          <ThemeToggle />
        </>
      }
      footer={<>{copy.footer} <a href="#">{copy.footerLink}</a></>}
    />
  );
}

export const Default: Story = {
  render: () => <LocalizedLogin />,
};

export const Minimal: Story = {
  name: 'Minimal (no headerSlot)',
  render: () => (
    <LoginPage
      title="Sign in"
      subtitle="Welcome back."
      onSubmit={async ({ email }) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        alert(`Signed in as ${email}`);
      }}
    />
  ),
};

export const SubmitError: Story = {
  name: 'Submit error',
  render: () => (
    <LoginPage
      title="Sign in"
      subtitle="Submit to see how errors render — any password fails here."
      defaultEmail="ops@example.com"
      onSubmit={async () => {
        await new Promise(resolve => setTimeout(resolve, 400));
        throw new Error('Invalid credentials for this surface.');
      }}
    />
  ),
};

function AccentPickerStory() {
  const [accent, setAccent] = useState<BrandAccent>('blue');
  return (
    <ThemeProvider accent={accent}>
      <LangProvider defaultLang="pt-BR">
        <LoginPage
          eyebrow={`Accent: ${accent}`}
          title="Sign in to MyApp"
          subtitle="Pick an accent — focus rings, links, buttons and the submit pill all follow."
          defaultEmail="owner@black-needle.studio"
          onSubmit={async () => { await new Promise(r => setTimeout(r, 300)); alert('Signed in'); }}
          headerSlot={<ThemeToggle />}
          footer={<>Got an invite? <a href="#">Set your password.</a></>}
          extras={
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {BRAND_ACCENTS.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => { setAccent(option); }}
                  aria-pressed={accent === option}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    borderRadius: 999,
                    border: accent === option
                      ? '1px solid var(--color-accent)'
                      : '1px solid var(--separator)',
                    background: accent === option
                      ? 'color-mix(in srgb, var(--color-accent) 14%, transparent)'
                      : 'transparent',
                    color: accent === option ? 'var(--color-accent)' : 'var(--label-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          }
        />
      </LangProvider>
    </ThemeProvider>
  );
}

export const AccentSwitcher: Story = {
  name: 'Accent switcher (6 options)',
  parameters: { layout: 'fullscreen' },
  decorators: [Story => <Story />],
  render: () => <AccentPickerStory />,
};

export const WithExtras: Story = {
  name: 'With extras (sign-up CTA below the card)',
  render: () => (
    <LoginPage
      eyebrow="Studio access"
      title="Sign in to MyApp"
      subtitle="Use your email and password to access the dashboard."
      defaultEmail="owner@black-needle.studio"
      onSubmit={async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        alert('Signed in');
      }}
      footer={<>Got an invite? <a href="#">Set your password.</a></>}
      extras={
        <>
          <p style={{ margin: 0 }}>
            New here? <a href="#">Create a studio</a> in two minutes.
          </p>
          <p style={{ margin: '8px 0 0', color: 'var(--label-tertiary)', fontSize: '0.75rem' }}>
            By signing in you agree to the <a href="#">Terms</a> and <a href="#">Privacy</a>.
          </p>
        </>
      }
    />
  ),
};
