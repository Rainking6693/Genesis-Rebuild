// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocsProps {
  docPath: string;
}

const Docs: React.FC<DocsProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(docPath);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching documentation:", err);
        setError(`Failed to load documentation. Please check the path and try again. Error: ${err.message}`);
        setMarkdownContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [docPath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!markdownContent) {
    return <div>No documentation found.</div>;
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong loading the documentation.</div>}>
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
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocsProps {
  docPath: string;
}

const Docs: React.FC<DocsProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(docPath);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching documentation:", err);
        setError(`Failed to load documentation. Please check the path and try again. Error: ${err.message}`);
        setMarkdownContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [docPath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!markdownContent) {
    return <div>No documentation found.</div>;
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong loading the documentation.</div>}>
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
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default Docs;