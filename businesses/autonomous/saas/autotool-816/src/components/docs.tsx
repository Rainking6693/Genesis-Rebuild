// src/components/Docs.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';

interface Props {
  docUrl: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You could render a custom fallback UI
      return (
        <div>
          <h2>Something went wrong loading the documentation.</h2>
          <p>Please try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const Docs: React.FC<Props> = ({ docUrl }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const response = await fetch(docUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        setContent(text);
      } catch (e: any) {
        setError(e);
        console.error("Error fetching documentation:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [docUrl]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading documentation: {error.message}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div dangerouslySetInnerHTML={{ __html: content || '' }} />
    </ErrorBoundary>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';

interface Props {
  docUrl: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You could render a custom fallback UI
      return (
        <div>
          <h2>Something went wrong loading the documentation.</h2>
          <p>Please try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const Docs: React.FC<Props> = ({ docUrl }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const response = await fetch(docUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        setContent(text);
      } catch (e: any) {
        setError(e);
        console.error("Error fetching documentation:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [docUrl]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading documentation: {error.message}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div dangerouslySetInnerHTML={{ __html: content || '' }} />
    </ErrorBoundary>
  );
};

export default Docs;