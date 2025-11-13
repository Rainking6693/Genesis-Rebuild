// src/components/Docs.tsx
import React, { useState, useEffect, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface DocsProps {
  docPath: string;
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Update the state so the next render will show the fallback UI.
    const errorHandler = (error: any, info: any) => {
      console.error("Caught an error: ", error, info);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div style={{ color: 'red' }}>
        <h2>Something went wrong loading the documentation.</h2>
        <p>Please try again later.</p>
      </div>
    );
  }

  return children;
}

function Docs({ docPath }: DocsProps) {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(docPath);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text();
        setMarkdown(text);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(e.message || "Failed to load documentation.");
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

  if (!markdown) {
    return <div>No documentation found.</div>;
  }

  return (
    <ReactMarkdown
      children={markdown}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
      }}
    />
  );
}

export default function DocsWrapper({ docPath }: DocsProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading documentation...</div>}>
        <Docs docPath={docPath} />
      </Suspense>
    </ErrorBoundary>
  );
}

// src/components/Docs.tsx
import React, { useState, useEffect, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface DocsProps {
  docPath: string;
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Update the state so the next render will show the fallback UI.
    const errorHandler = (error: any, info: any) => {
      console.error("Caught an error: ", error, info);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div style={{ color: 'red' }}>
        <h2>Something went wrong loading the documentation.</h2>
        <p>Please try again later.</p>
      </div>
    );
  }

  return children;
}

function Docs({ docPath }: DocsProps) {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(docPath);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text();
        setMarkdown(text);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(e.message || "Failed to load documentation.");
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

  if (!markdown) {
    return <div>No documentation found.</div>;
  }

  return (
    <ReactMarkdown
      children={markdown}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
      }}
    />
  );
}

export default function DocsWrapper({ docPath }: DocsProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading documentation...</div>}>
        <Docs docPath={docPath} />
      </Suspense>
    </ErrorBoundary>
  );
}