import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * ErrorBoundary component to catch errors in the component tree
 * and display a fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // In production, you might want to log to an error tracking service
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Something went wrong</h1>
            <p className="text-gray-600 text-center mb-6">
              We're sorry, but we encountered an error while loading this page.
            </p>
            <div className="text-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
              >
                <RefreshCw size={16} className="mr-2" />
                Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;