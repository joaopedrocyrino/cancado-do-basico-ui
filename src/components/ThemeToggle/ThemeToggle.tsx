import { useTheme, type ThemeOverride } from '../../context/ThemeContext';
import './ThemeToggle.css'

const OPTIONS: { value: ThemeOverride; icon: string; label: string }[] = [
  { value: 'light', icon: '☀', label: 'Light' },
  { value: 'dark', icon: '☾', label: 'Dark' },
  { value: 'system', icon: '⊙', label: 'System' },
];

export function ThemeToggle() {
  const { override, setOverride } = useTheme();

  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      {OPTIONS.map(({ value, icon, label }) => (
        <button
          key={value}
          className="theme-toggle-btn"
          onClick={() => setOverride(value)}
          aria-label={label}
          aria-pressed={override === value}
          title={label}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
