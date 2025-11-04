import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chess game error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white p-4">
          <div className="max-w-md w-full bg-zinc-900/50 backdrop-blur-sm rounded-xl p-8 border border-zinc-800 text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            
            <p className="text-zinc-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred in the chess game'}
            </p>
            
            <button
              onClick={this.handleReload}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg 
                         font-semibold transition-colors duration-200"
            >
              Reload Game
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-400">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs text-red-400 overflow-auto max-h-40 bg-zinc-950 p-2 rounded">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
