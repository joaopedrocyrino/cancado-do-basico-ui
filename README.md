# cancado-do-basico-ui

A React component library built for dashboard applications. Zero runtime dependencies beyond React. Designed around Apple's iOS 26 Liquid Glass aesthetic — translucent surfaces, spring animations, and a consistent dark/light token system.

[![npm version](https://img.shields.io/npm/v/cancado-do-basico-ui)](https://www.npmjs.com/package/cancado-do-basico-ui)
[![npm downloads](https://img.shields.io/npm/dm/cancado-do-basico-ui)](https://www.npmjs.com/package/cancado-do-basico-ui)
[![license](https://img.shields.io/npm/l/cancado-do-basico-ui)](./LICENSE)

---

## Installation

```bash
npm install cancado-do-basico-ui
# or
pnpm add cancado-do-basico-ui
```

Import the stylesheet once at the root of your app:

```ts
import 'cancado-do-basico-ui/styles'
```

## Quick start

Wrap your app with the context providers:

```tsx
import { ThemeProvider, ToastProvider } from 'cancado-do-basico-ui'
import 'cancado-do-basico-ui/styles'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <YourApp />
      </ToastProvider>
    </ThemeProvider>
  )
}
```

Both providers are optional — only include them if you use `ThemeToggle`/`useTheme` or `useToast`.

---

## Design tokens

All styles use CSS custom properties from `dist/style.css`. They switch automatically between light and dark when `data-theme` is set on `<html>` (handled by `ThemeProvider`).

```css
.my-card {
  background: var(--bg-elevated);
  color: var(--label-primary);
  border: 1px solid var(--separator);
}
```

| Token | Purpose |
|-------|---------|
| `--bg-primary` · `--bg-secondary` · `--bg-tertiary` · `--bg-elevated` | Surface backgrounds |
| `--label-primary` · `--label-secondary` · `--label-tertiary` | Text colors |
| `--separator` · `--separator-opaque` | Dividers |
| `--color-blue` · `--color-red` · `--color-green` · `--color-orange` | System colors |
| `--color-error` · `--color-success` · `--color-link` | Semantic aliases |

---

## Development

```bash
pnpm install

pnpm dev            # watch build — rebuilds dist/ on every change
pnpm storybook      # component playground at localhost:6006
pnpm typecheck      # tsc --noEmit
```

To develop against a local app, link the package:

```bash
# in your consuming app
pnpm link /path/to/cancado-do-basico-ui
```

---

## Contributing

Pull requests are welcome. For significant changes, open an issue first to discuss what you'd like to change.

---

## License

[MIT](./LICENSE)
