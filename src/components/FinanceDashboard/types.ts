export type TrendDir = 'up' | 'down' | 'flat';
export type AccentColor = 'blue' | 'green' | 'red' | 'orange' | 'purple';
export type TransactionStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';

export interface DataPoint {
  label: string;
  value: number;
}

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export interface Transaction {
  id: string;
  description: string;
  /** Positive = income, negative = expense */
  amount: number;
  /** ISO date string */
  date: string;
  status: TransactionStatus;
  category?: string;
}
