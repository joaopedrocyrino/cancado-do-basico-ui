import type { ReactNode } from 'react';
import './FormRow.css';

export interface FormRowProps {
  children: ReactNode;
}

export function FormRow({ children }: FormRowProps) {
  return <div className="fr-row">{children}</div>;
}
