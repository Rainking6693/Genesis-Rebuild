// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Consider using a markdown parser
import remarkGfm from 'remark-gfm'; // For Github Flavored Markdown
import rehypeRaw from 'rehype-raw'; // Allows raw HTML in markdown (use with caution!)

interface DocsProps {
  docPath: string; // Path to the markdown document
}

const Docs: React.FC<DocsProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load documentation.');
        setLoading(false);
      }
    };

    fetchDocs();
  }, [docPath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error}
        {/* Consider logging the error to a monitoring service */}
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong displaying the documentation.</div>}>
      <Markdown
        children={markdownContent}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]} // Use with caution, sanitize if needed
        components={{
          // Optional: Customize how certain elements are rendered
          // e.g., customize links, images, etc.
        }}
      />
    </ErrorBoundary>
  );
};

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
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
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
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
import Markdown from 'react-markdown'; // Consider using a markdown parser
import remarkGfm from 'remark-gfm'; // For Github Flavored Markdown
import rehypeRaw from 'rehype-raw'; // Allows raw HTML in markdown (use with caution!)

interface DocsProps {
  docPath: string; // Path to the markdown document
}

const Docs: React.FC<DocsProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load documentation.');
        setLoading(false);
      }
    };

    fetchDocs();
  }, [docPath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error}
        {/* Consider logging the error to a monitoring service */}
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong displaying the documentation.</div>}>
      <Markdown
        children={markdownContent}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]} // Use with caution, sanitize if needed
        components={{
          // Optional: Customize how certain elements are rendered
          // e.g., customize links, images, etc.
        }}
      />
    </ErrorBoundary>
  );
};

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
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
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
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

Now, I'll output the code and build report using the available tools.