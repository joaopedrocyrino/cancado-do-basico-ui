import './FinanceDashboard.css';

export interface FinanceSummaryBarProps {
  revenue: string;
  expenses: string;
  balance: string;
  period?: string;
}

export function FinanceSummaryBar({ revenue, expenses, balance, period }: FinanceSummaryBarProps) {
  return (
    <div className="fd-summary-bar">
      {period && <div className="fd-summary-period">{period}</div>}
      <div className="fd-summary-items">
        <div className="fd-summary-item">
          <span className="fd-summary-label">Revenue</span>
          <span className="fd-summary-value fd-summary-value--green">{revenue}</span>
        </div>
        <div className="fd-summary-divider" />
        <div className="fd-summary-item">
          <span className="fd-summary-label">Expenses</span>
          <span className="fd-summary-value fd-summary-value--red">{expenses}</span>
        </div>
        <div className="fd-summary-divider" />
        <div className="fd-summary-item">
          <span className="fd-summary-label">Balance</span>
          <span className="fd-summary-value fd-summary-value--blue">{balance}</span>
        </div>
      </div>
    </div>
  );
}
