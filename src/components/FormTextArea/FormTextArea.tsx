import './FormTextArea.css';

export interface FormTextAreaProps {
  required?: boolean;
  onChange: (v: string) => void;
  value?: string;
  title?: string;
  rows?: number;
  disabled?: boolean;
  placeholder?: string;
}

export function FormTextArea({ title, onChange, rows, ...props }: FormTextAreaProps) {
  return (
    <label className="fta-field">
      {title ?? ''}
      <textarea rows={rows ?? 2} onChange={e => onChange(e.target.value)} {...props} />
    </label>
  );
}
