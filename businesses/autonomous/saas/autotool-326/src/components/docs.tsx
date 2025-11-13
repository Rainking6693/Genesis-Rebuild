// src/components/Docs.tsx
import React, { useState, useEffect, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams, Link } from 'react-router-dom'; // Assuming React Router for navigation

interface DocsProps {
  contentPath: string; // Path to the Markdown file
}

interface MarkdownData {
  content: string;
  error: string | null;
  loading: boolean;
}

const useMarkdown = (contentPath: string): MarkdownData => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(contentPath);

        if (!response.ok) {
          throw new Error(`Failed to fetch ${contentPath}: ${response.status}`);
        }

        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching documentation:", err);
        setError(`Failed to load documentation: ${err.message}`);
        setContent('');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contentPath]);

  return { content, error, loading };
};

const Docs: React.FC<DocsProps> = ({ contentPath }) => {
  const { content, error, loading } = useMarkdown(contentPath);

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
    <ErrorBoundary>
      <ReactMarkdown remarkPlugins={[remarkGfm]} children={content} />
    </ErrorBoundary>
  );
};

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    console.error("Caught an error in ErrorBoundary:", error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error("Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.  Please check the console for details.</h1>;
    }

    return this.props.children;
  }
}

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams, Link } from 'react-router-dom'; // Assuming React Router for navigation

interface DocsProps {
  contentPath: string; // Path to the Markdown file
}

interface MarkdownData {
  content: string;
  error: string | null;
  loading: boolean;
}

const useMarkdown = (contentPath: string): MarkdownData => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(contentPath);

        if (!response.ok) {
          throw new Error(`Failed to fetch ${contentPath}: ${response.status}`);
        }

        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching documentation:", err);
        setError(`Failed to load documentation: ${err.message}`);
        setContent('');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contentPath]);

  return { content, error, loading };
};

const Docs: React.FC<DocsProps> = ({ contentPath }) => {
  const { content, error, loading } = useMarkdown(contentPath);

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
    <ErrorBoundary>
      <ReactMarkdown remarkPlugins={[remarkGfm]} children={content} />
    </ErrorBoundary>
  );
};

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    console.error("Caught an error in ErrorBoundary:", error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error("Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.  Please check the console for details.</h1>;
    }

    return this.props.children;
  }
}

export default Docs;