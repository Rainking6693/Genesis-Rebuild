// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useParams } from 'react-router-dom'; // Assuming React Router for navigation

interface DocData {
  title: string;
  content: string;
}

const Docs = () => {
  const { docId } = useParams<{ docId: string }>();
  const [docData, setDocData] = useState<DocData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      try {
        // Simulate fetching documentation from an API or local files
        const response = await fetch(`/docs/${docId}.md`); // Assuming Markdown files
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.status}`);
        }
        const content = await response.text();

        // Extract title from the first line (assuming it's a Markdown heading)
        const titleMatch = content.match(/^#\s*(.*)$/m);
        const title = titleMatch ? titleMatch[1] : 'Untitled Document';

        setDocData({ title, content });
        setError(null);
      } catch (err: any) {
        console.error("Error fetching document:", err);
        setError(`Error loading document: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [docId]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!docData) {
    return <div>Document not found.</div>;
  }

  return (
    <div>
      <h1>{docData.title}</h1>
      <Markdown>{docData.content}</Markdown>
    </div>
  );
};

export default Docs;

// Example Error Boundary (ErrorBoundary.tsx - separate component)
// This would wrap the Docs component to catch rendering errors
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error in ErrorBoundary:", error, errorInfo);
    this.setState({errorInfo: errorInfo});
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

export default ErrorBoundary;

// Usage:
// <ErrorBoundary>
//   <Docs />
// </ErrorBoundary>