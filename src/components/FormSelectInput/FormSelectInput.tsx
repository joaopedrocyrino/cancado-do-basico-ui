import { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import './FormSelectInput.css';

export interface FormSelectInputProps<T> {
  title?: string;
  value?: string;
  onChange: (item: string, options?: T[]) => void;
  placeholder?: string;
  options?: T[];
  required?: boolean;
  displayValue: (item: T) => string;
  parseValue: (item: T) => string;
  getOptions?: () => Promise<T[]>;
  disabled?: boolean;
}

export function FormSelectInput<T>({
  title,
  value,
  onChange,
  placeholder,
  options,
  required,
  displayValue,
  parseValue,
  getOptions,
  disabled,
}: FormSelectInputProps<T>) {
  const [asyncOptions, setAsyncOptions] = useState<T[]>([]);
  const getOptionsRef = useRef(getOptions);
  useLayoutEffect(() => { getOptionsRef.current = getOptions; });

  useEffect(() => {
    if (getOptionsRef.current) {
      getOptionsRef.current().then(opts => setAsyncOptions(opts)).catch(() => { });
    }
  }, []);

  const finalOptions = useMemo(() => options ?? asyncOptions, [options, asyncOptions]);

  useEffect(() => {
    if (!placeholder && !value && finalOptions.length) {
      onChange(parseValue(finalOptions[0]));
    }
  }, [finalOptions, placeholder, value, onChange, parseValue]);

  return (
    <label className="fsel-field">
      {title ?? ''}
      <select required={required} value={value} onChange={e => onChange(e.target.value, asyncOptions)} disabled={disabled}>
        {placeholder && <option value="">{placeholder}</option>}
        {finalOptions.map(opt => (
          <option key={parseValue(opt)} value={parseValue(opt)}>
            {displayValue(opt)}
          </option>
        ))}
      </select>
    </label>
  );
}
