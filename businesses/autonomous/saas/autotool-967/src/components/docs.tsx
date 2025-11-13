// src/components/DocsComponent.tsx
import React, { useState, useEffect, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface DocsComponentProps {
  docUrl: string;
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
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
      <div className="error-boundary">
        <h2>Something went wrong loading the documentation.</h2>
        <p>Please try again later or contact support.</p>
      </div>
    );
  }

  return children;
}

function DocsComponent({ docUrl }: DocsComponentProps) {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(docUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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
  }, [docUrl]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default DocsComponent;

// src/components/DocsComponent.tsx
import React, { useState, useEffect, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface DocsComponentProps {
  docUrl: string;
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
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
      <div className="error-boundary">
        <h2>Something went wrong loading the documentation.</h2>
        <p>Please try again later or contact support.</p>
      </div>
    );
  }

  return children;
}

function DocsComponent({ docUrl }: DocsComponentProps) {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(docUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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
  }, [docUrl]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default DocsComponent;

Now, I will use the `Write` tool to save the code to `src/components/DocsComponent.tsx`.

**Final Answer:**