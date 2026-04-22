import type { Transaction } from './types';
import './FinanceDashboard.css';

export interface RecentTransactionsProps {
  transactions: Transaction[];
  title?: string;
  onTransactionClick?: (t: Transaction) => void;
  formatAmount?: (v: number) => string;
}

const STATUS_LABEL: Record<Transaction['status'], string> = {
  paid: 'Paid',
  pending: 'Pending',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
};

const defaultFormat = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(v));

export function RecentTransactions({
  transactions,
  title = 'Recent Transactions',
  onTransactionClick,
  formatAmount = defaultFormat,
}: RecentTransactionsProps) {
  return (
    <div className="fd-chart-card fd-transactions">
      <div className="fd-chart-title">{title}</div>
      {transactions.length === 0 ? (
        <div className="fd-transactions-empty">No transactions yet.</div>
      ) : (
        <ul className="fd-tx-list">
          {transactions.map(t => (
            <li
              key={t.id}
              className={`fd-tx-row${onTransactionClick ? ' fd-tx-row--clickable' : ''}`}
              onClick={() => onTransactionClick?.(t)}
            >
              <div className="fd-tx-info">
                <span className="fd-tx-desc">{t.description}</span>
                {t.category && <span className="fd-tx-cat">{t.category}</span>}
              </div>
              <div className="fd-tx-right">
                <span className={`fd-tx-amount${t.amount >= 0 ? ' fd-tx-amount--pos' : ' fd-tx-amount--neg'}`}>
                  {t.amount >= 0 ? '+' : '−'}{formatAmount(t.amount)}
                </span>
                <span className={`fd-tx-badge fd-tx-badge--${t.status}`}>
                  {STATUS_LABEL[t.status]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
