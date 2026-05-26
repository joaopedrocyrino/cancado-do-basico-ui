import { useLang, type LanguageOption } from '../../context/LangContext';
import './LangToggle.css'

export interface LangToggleProps {
  /** Available languages. The currently selected one (matched by `code`) gets the active treatment. */
  languages: LanguageOption[];
  /** Accessible label for the toggle group. Defaults to "Language". */
  ariaLabel?: string;
}

export function LangToggle({ languages, ariaLabel = 'Language' }: LangToggleProps) {
  const { lang, setLang } = useLang();

  if (!languages || languages.length === 0) return null;

  return (
    <div className="lang-toggle" role="group" aria-label={ariaLabel}>
      {languages.map((option) => {
        const description = option.ariaLabel ?? option.label;
        return (
          <button
            key={option.code}
            className="lang-toggle-btn"
            onClick={() => { setLang(option.code); }}
            aria-pressed={lang === option.code}
            aria-label={description}
            title={description}
            type="button"
          >
            {option.flag ? <span className="lang-toggle-flag" aria-hidden="true">{option.flag}</span> : null}
            <span className="lang-toggle-label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
