// src/components/Documentation.tsx
import React, { useState, useEffect, ErrorInfo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentationProps {
  source: string; // URL or path to the documentation content
}

interface DocumentationState {
  content: string | null;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Caught an error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}

const Documentation: React.FC<DocumentationProps> = ({ source }) => {
  const [state, setState] = useState<DocumentationState>({ content: null, error: null });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(source);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        setState({ content: text, error: null });
      } catch (error: any) {
        console.error("Error fetching documentation:", error);
        setState({ content: null, error: error });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [source]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (state.error) {
    return <div>Error loading documentation: {state.error.message}</div>;
  }

  return (
    <ErrorBoundary>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{state.content}</ReactMarkdown>
    </ErrorBoundary>
  );
};

export default Documentation;

// src/components/Documentation.tsx
import React, { useState, useEffect, ErrorInfo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentationProps {
  source: string; // URL or path to the documentation content
}

interface DocumentationState {
  content: string | null;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Caught an error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}

const Documentation: React.FC<DocumentationProps> = ({ source }) => {
  const [state, setState] = useState<DocumentationState>({ content: null, error: null });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(source);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        setState({ content: text, error: null });
      } catch (error: any) {
        console.error("Error fetching documentation:", error);
        setState({ content: null, error: error });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [source]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (state.error) {
    return <div>Error loading documentation: {state.error.message}</div>;
  }

  return (
    <ErrorBoundary>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{state.content}</ReactMarkdown>
    </ErrorBoundary>
  );
};

export default Documentation;