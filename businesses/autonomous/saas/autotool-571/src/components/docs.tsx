// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';

interface DocumentationProps {
  articleId: string;
}

const Documentation: React.FC<DocumentationProps> = ({ articleId }) => {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocumentation = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/docs/${articleId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }
        const data = await response.text();
        setContent(data);
        setError(null);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(`Failed to load documentation. Please try again later. Error: ${e.message}`);
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [articleId]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!content) {
    return <div>No documentation found.</div>;
  }

  return (
    <div className="documentation">
      <ErrorBoundary>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </ErrorBoundary>
    </div>
  );
};

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error("Caught an error in ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default Documentation;