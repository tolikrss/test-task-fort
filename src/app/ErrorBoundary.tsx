import { Component, type ErrorInfo, type ReactNode } from 'react';

import { FieldsDataError } from '@/features/fields';
import { Button } from '@/shared/ui/controls';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/** A class because getDerivedStateFromError / componentDidCatch still have no hook equivalents. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  override componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error('[app] Unhandled render error', error, info.componentStack);
  }

  override render() {
    const { error } = this.state;

    if (!error) return this.props.children;

    return (
      <div role="alert" className="flex h-full items-center justify-center p-6">
        <div className="max-w-md space-y-3 rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-red-700">Не вдалося відобразити застосунок</h1>
          <p className="text-sm text-slate-600">
            {error instanceof FieldsDataError
              ? 'Дані полів пошкоджені або мають неправильний формат.'
              : 'Сталася неочікувана помилка.'}
          </p>
          <pre className="max-h-40 overflow-auto rounded bg-slate-50 p-2 text-xs whitespace-pre-wrap text-slate-500">
            {error.message}
          </pre>
          <Button onClick={() => window.location.reload()}>Перезавантажити</Button>
        </div>
      </div>
    );
  }
}
