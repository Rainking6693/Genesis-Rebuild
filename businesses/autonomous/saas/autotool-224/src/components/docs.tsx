// src/components/Docs.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom'; // Assuming React Router for navigation

interface Doc {
  title: string;
  content: string;
  version: string;
}

const Docs = () => {
  const { docId } = useParams<{ docId: string }>();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setLoading(true);
        // Simulate fetching documentation from an API
        const response = await fetch(`/api/docs/${docId}`); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }
        const data: Doc = await response.json();
        setDoc(data);
      } catch (e: any) {
        setError(e.message);
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
    return (
    <div>
      Error loading documentation: {error}
      <Link to="/">Back to Home</Link>
    </div>
    );
  }

  if (!doc) {
    return <div>Documentation not found. <Link to="/">Back to Home</Link></div>;
  }

  return (
    <div>
      <h1>{doc.title}</h1>
      <p>Version: {doc.version}</p>
      <div dangerouslySetInnerHTML={{ __html: doc.content }} /> {/* Assuming content is HTML */}
    </div>
  );
};

// Error Boundary Component (Simple Example)
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
    console.error("Caught an error: ", error, errorInfo);
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}

export default function DocsWrapper() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Docs />
      </Suspense>
    </ErrorBoundary>
  );
}

// src/components/Docs.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom'; // Assuming React Router for navigation

interface Doc {
  title: string;
  content: string;
  version: string;
}

const Docs = () => {
  const { docId } = useParams<{ docId: string }>();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setLoading(true);
        // Simulate fetching documentation from an API
        const response = await fetch(`/api/docs/${docId}`); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }
        const data: Doc = await response.json();
        setDoc(data);
      } catch (e: any) {
        setError(e.message);
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
    return (
    <div>
      Error loading documentation: {error}
      <Link to="/">Back to Home</Link>
    </div>
    );
  }

  if (!doc) {
    return <div>Documentation not found. <Link to="/">Back to Home</Link></div>;
  }

  return (
    <div>
      <h1>{doc.title}</h1>
      <p>Version: {doc.version}</p>
      <div dangerouslySetInnerHTML={{ __html: doc.content }} /> {/* Assuming content is HTML */}
    </div>
  );
};

// Error Boundary Component (Simple Example)
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
    console.error("Caught an error: ", error, errorInfo);
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}

export default function DocsWrapper() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Docs />
      </Suspense>
    </ErrorBoundary>
  );
}

**Build Report:**