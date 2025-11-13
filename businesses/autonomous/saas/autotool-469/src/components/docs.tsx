// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentationProps {
  docUrl: string;
}

const Documentation: React.FC<DocumentationProps> = ({ docUrl }) => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        setLoading(true);
        const response = await fetch(docUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
        setError(null);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(`Failed to load documentation: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [docUrl]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong displaying the documentation.</div>}>
      <Markdown remarkPlugins={[remarkGfm]}>{markdownContent}</Markdown>
    </ErrorBoundary>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error("Caught an error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You could render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default Documentation;