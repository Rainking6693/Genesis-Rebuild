// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Assuming Markdown for content

interface DocsProps {
  contentUrl: string;
}

const Docs: React.FC<DocsProps> = ({ contentUrl }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(contentUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
        setLoading(false);
      } catch (e: any) {
        setError(e.message || 'Failed to load documentation.');
        setLoading(false);
      }
    };

    fetchDocs();
  }, [contentUrl]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error loading documentation: {error}</div>;
  }

  return (
    <ErrorBoundary>
      <Markdown>{markdownContent}</Markdown>
    </ErrorBoundary>
  );
};

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
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
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default Docs;