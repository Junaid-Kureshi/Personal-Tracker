// components/ErrorBoundary.tsx

'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleReset = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('placement_tracker_v1');
      } catch {
        // ignore
      }
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <h1 className="text-lg font-semibold text-zinc-100 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-zinc-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <p className="text-xs text-zinc-600 mb-4">
              If this keeps happening, your local data may be corrupted.
              You can reset it below.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm bg-zinc-800 text-zinc-100 hover:bg-zinc-700 transition-colors rounded"
              >
                Reload
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 text-sm bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors rounded border border-rose-500/20"
              >
                Reset Data & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
