import { useEffect, useRef, useState } from 'react';
import './FormSearchInput.css';

export interface FormSearchInputProps<T> {
  value: string;
  displayValue: (item: T) => string;
  onSelect: (item: T) => void;
  onClear: () => void;
  onSearch: (search: string) => Promise<T[]>;
  fetchInitialValue?: (initialValue: string) => Promise<T>;
  title?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FormSearchInput<T>({
  value,
  displayValue,
  onSelect,
  onClear,
  onSearch,
  fetchInitialValue,
  placeholder,
  title,
  required,
  disabled,
}: FormSearchInputProps<T>) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function runSearch(q: string) {
    if (q.trim().length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }
    onSearch(q)
      .then(items => {
        setResults(items);
        setOpen(items.length > 0);
        setActiveIdx(-1);
      })
      .catch(() => {
        setResults([]);
        setOpen(false);
      });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setSearch(v);
    if (value) onClear();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(v), 380);
  }

  function handleSelect(item: T) {
    onSelect(item);
    setSearch(displayValue(item));
    setResults([]);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && results[activeIdx]) handleSelect(results[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  function handleBlur(e: React.FocusEvent) {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
      if (!value) setSearch('');
    }
  }

  useEffect(() => {
    if (fetchInitialValue && value) {
      fetchInitialValue(value)
        .then(item => handleSelect(item))
        .catch(() => { });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <label className="fsi-field">
      {title ?? ''}
      <div className="fsi" ref={containerRef} onBlur={handleBlur}>
        <div className="fsi-input-wrap">
          <input
            type="text"
            className="fsi-input"
            value={search}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (results.length > 0) setOpen(true); }}
            placeholder={placeholder}
            required={required && !value}
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={open}
            disabled={disabled}
          />
          {value && (
            <button
              type="button"
              className="fsi-clear"
              onClick={() => { onClear(); setSearch(''); setResults([]); setOpen(false); }}
              aria-label="Clear"
            >
              ×
            </button>
          )}
        </div>
        {open && (
          <ul className="fsi-dropdown" role="listbox">
            {results.map((item, i) => (
              <li
                key={(item as { id: string }).id ?? i}
                role="option"
                aria-selected={i === activeIdx}
                className={`fsi-option${i === activeIdx ? ' fsi-option--active' : ''}`}
                onMouseDown={() => handleSelect(item)}
              >
                <span className="fsi-name">{displayValue(item)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </label>
  );
}
