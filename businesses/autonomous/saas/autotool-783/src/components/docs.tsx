// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';

interface DocsProps {
  docId?: string; // Optional document ID for specific documentation
}

const Docs: React.FC<DocsProps> = ({ docId }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        // Replace with actual API endpoint for fetching documentation
        const apiUrl = docId ? `/api/docs/${docId}` : '/api/docs/default';
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text(); // Assuming the API returns plain text documentation
        setContent(data);
      } catch (e: any) {
        setError(`Failed to load documentation: ${e.message}`);
        console.error("Error fetching documentation:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [docId]);

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
    <div className="docs-container">
      {/* Error Boundary */}
      <ErrorBoundary fallback={<p>Something went wrong displaying the documentation.</p>}>
        <div dangerouslySetInnerHTML={{ __html: content || '<h1>Default Documentation Content</h1>' }} />
      </ErrorBoundary>
    </div>
  );
};

// Error Boundary Component (Simple implementation)
class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
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

interface DocsProps {
  docId?: string; // Optional document ID for specific documentation
}

const Docs: React.FC<DocsProps> = ({ docId }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        // Replace with actual API endpoint for fetching documentation
        const apiUrl = docId ? `/api/docs/${docId}` : '/api/docs/default';
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text(); // Assuming the API returns plain text documentation
        setContent(data);
      } catch (e: any) {
        setError(`Failed to load documentation: ${e.message}`);
        console.error("Error fetching documentation:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [docId]);

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
    <div className="docs-container">
      {/* Error Boundary */}
      <ErrorBoundary fallback={<p>Something went wrong displaying the documentation.</p>}>
        <div dangerouslySetInnerHTML={{ __html: content || '<h1>Default Documentation Content</h1>' }} />
      </ErrorBoundary>
    </div>
  );
};

// Error Boundary Component (Simple implementation)
class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
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