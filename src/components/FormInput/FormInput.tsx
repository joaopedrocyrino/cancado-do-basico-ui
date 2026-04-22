import { useMemo } from 'react';
import './FormInput.css';

export interface FormInputProps {
  required?: boolean;
  onChange: (v: string) => void;
  value?: string;
  type?: 'text' | 'email' | 'number' | 'decimal' | 'time' | 'date';
  title?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function FormInput({ title, onChange, type, ...props }: FormInputProps) {
  const [typeToApply, inputMode, parser]: [
    'text' | 'email' | 'number' | 'decimal' | 'time' | 'date' | undefined,
    'numeric' | undefined,
    (e: React.ChangeEvent<HTMLInputElement>) => string,
  ] = useMemo(() => {
    if (type === 'number')
      return [
        'text' as const,
        'numeric' as const,
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const digits = e.target.value.replace(/\D/g, '');
          if (digits) return Number(digits).toString();
          return digits;
        },
      ];

    if (type === 'decimal')
      return [
        'text' as const,
        'numeric' as const,
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const digits = e.target.value.replace(/\D/g, '');
          if (!digits) return digits;
          const padded = digits.padStart(3, '0');
          const intPart = parseInt(padded.slice(0, -2));
          const decPart = padded.slice(-2);
          e.target.setSelectionRange(e.target.value.length, e.target.value.length);
          return `${intPart}.${decPart}`;
        },
      ];

    return [type, undefined, (e: React.ChangeEvent<HTMLInputElement>) => e.target.value];
  }, [type]);

  return (
    <label className="fi-field">
      {title ?? ''}
      <input
        {...props}
        type={typeToApply}
        inputMode={inputMode}
        onChange={e => {
          const v = parser(e);
          onChange(v);
        }}
      />
    </label>
  );
}
