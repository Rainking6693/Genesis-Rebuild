// src/components/Documentation.tsx
import React, { useState, useEffect, Suspense } from 'react';

interface DocumentationProps {
  contentUrl: string;
}

function Documentation({ contentUrl }: DocumentationProps) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(contentUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (e: any) {
        setError(e);
        console.error("Error fetching documentation:", e); // Log the error for debugging
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [contentUrl]);

  if (isLoading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading documentation: {error.message}
        {/* Consider adding a retry button here */}
      </div>
    );
  }

  return (
    <div className="documentation">
      {/*  Consider using a markdown renderer here for better formatting */}
      <pre>{content}</pre>
    </div>
  );
}

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
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default function DocumentationWrapper({ contentUrl }: DocumentationProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Documentation contentUrl={contentUrl} />
      </Suspense>
    </ErrorBoundary>
  );
}

// src/components/Documentation.tsx
import React, { useState, useEffect, Suspense } from 'react';

interface DocumentationProps {
  contentUrl: string;
}

function Documentation({ contentUrl }: DocumentationProps) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(contentUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (e: any) {
        setError(e);
        console.error("Error fetching documentation:", e); // Log the error for debugging
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [contentUrl]);

  if (isLoading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading documentation: {error.message}
        {/* Consider adding a retry button here */}
      </div>
    );
  }

  return (
    <div className="documentation">
      {/*  Consider using a markdown renderer here for better formatting */}
      <pre>{content}</pre>
    </div>
  );
}

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
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default function DocumentationWrapper({ contentUrl }: DocumentationProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Documentation contentUrl={contentUrl} />
      </Suspense>
    </ErrorBoundary>
  );
}

**Execution:**