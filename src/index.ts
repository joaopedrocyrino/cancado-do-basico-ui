// ── Styles (bundled via Vite — consumers must also import 'cancado-do-basico-ui/styles') ──
import './styles/tokens.css';

// ── Contexts ──────────────────────────────────────────────────────────────────
export { ThemeProvider, useTheme } from './context/ThemeContext';
export type { ThemeOverride } from './context/ThemeContext';

export { ToastProvider, useToast } from './context/ToastContext';
export type { ToastApi, ToastType } from './context/ToastContext';

// ── Components ────────────────────────────────────────────────────────────────

export { AppShell } from './components/AppShell/AppShell';
export type { AppShellProps, NavItem } from './components/AppShell/AppShell';

export { ConfirmModal } from './components/ConfirmModal/ConfirmModal';
export type { ConfirmModalProps } from './components/ConfirmModal/ConfirmModal';

export { Form } from './components/Form/Form';
export type { FormProps } from './components/Form/Form';

export { FormInput } from './components/FormInput/FormInput';
export type { FormInputProps } from './components/FormInput/FormInput';

export { FormRow } from './components/FormRow/FormRow';
export type { FormRowProps } from './components/FormRow/FormRow';

export { FormSearchInput } from './components/FormSearchInput/FormSearchInput';
export type { FormSearchInputProps } from './components/FormSearchInput/FormSearchInput';

export { FormSectionLabel } from './components/FormSectionLabel/FormSectionLabel';
export type { FormSectionLabelProps } from './components/FormSectionLabel/FormSectionLabel';

export { FormSelectInput } from './components/FormSelectInput/FormSelectInput';
export type { FormSelectInputProps } from './components/FormSelectInput/FormSelectInput';

export { FormTextArea } from './components/FormTextArea/FormTextArea';
export type { FormTextAreaProps } from './components/FormTextArea/FormTextArea';

export { ListPage } from './components/ListPage/ListPage';
export type { ListPageProps, ListPageFetchParams, ListPageResult, SortOption, FilterChip } from './components/ListPage/ListPage';

export { Modal } from './components/Modal/Modal';
export type { ModalProps } from './components/Modal/Modal';

export { ModalPhoneInput } from './components/ModalPhoneInput/ModalPhoneInput';
export type { ModalPhoneInputProps, PhoneEntry } from './components/ModalPhoneInput/ModalPhoneInput';

export { ThemeToggle } from './components/ThemeToggle/ThemeToggle';

export { Agenda } from './components/Agenda/Agenda';
export type { AgendaProps, AgendaEvent, AgendaLabels, CalView } from './components/Agenda/index';

export { StatCard, LineChart, BarChart, DonutChart, FinanceSummaryBar, RecentTransactions } from './components/FinanceDashboard/index';
export type { StatCardProps, LineChartProps, BarChartProps, DonutChartProps, FinanceSummaryBarProps, RecentTransactionsProps, DataPoint, DonutSegment, Transaction, TrendDir, AccentColor, TransactionStatus } from './components/FinanceDashboard/index';
