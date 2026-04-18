export type Severity = 'success' | 'error' | 'info' | 'warning';

export interface ToastContextType {
    showToast: (message: string, severity?: Severity) => void;
}
