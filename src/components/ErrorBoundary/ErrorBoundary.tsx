'use client';
import React, { ReactNode } from 'react';
import styles from './ErrorBoundary.module.scss';

interface ErrorBoundaryState {
  hasError?: boolean | null;
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ error: error, errorInfo: errorInfo });
    console.error('Uncaught error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className={styles.error}>
          <h2 className={styles['error-text']}>Oops! Something went wrong.</h2>
          <div className={styles['error-details']}>
            {this.state.error?.toString()}
            <br />
            <p className={styles['error-info']}>
              {this.state.errorInfo?.componentStack}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
