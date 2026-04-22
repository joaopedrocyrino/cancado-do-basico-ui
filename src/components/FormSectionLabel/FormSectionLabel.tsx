import './FormSectionLabel.css';

export interface FormSectionLabelProps {
  title: string;
}

export function FormSectionLabel({ title }: FormSectionLabelProps) {
  return <div className="fsl-label">{title}</div>;
}
