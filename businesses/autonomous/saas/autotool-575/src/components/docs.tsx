// src/components/Documentation.tsx
import React, { useState, useEffect, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentationProps {
  source: string; // URL or file path to the documentation content
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
      <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
        <h2>Something went wrong while loading the documentation.</h2>
        <p>Please check the console for more details.</p>
      </div>
    );
  }

  return children;
}

const Documentation: React.FC<DocumentationProps> = ({ source }) => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        setLoading(true);
        const response = await fetch(source);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation from ${source}. Status: ${response.status}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
        setError(null); // Clear any previous errors
      } catch (err: any) {
        console.error("Error fetching documentation:", err);
        setError(err.message || "Failed to load documentation.");
        setMarkdownContent(null); // Clear content on error
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [source]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <ErrorBoundary>
      <ReactMarkdown remarkPlugins={[remarkGfm]} children={markdownContent || ''} />
    </ErrorBoundary>
  );
};

export default Documentation;

// src/components/Documentation.tsx
import React, { useState, useEffect, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentationProps {
  source: string; // URL or file path to the documentation content
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
      <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
        <h2>Something went wrong while loading the documentation.</h2>
        <p>Please check the console for more details.</p>
      </div>
    );
  }

  return children;
}

const Documentation: React.FC<DocumentationProps> = ({ source }) => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        setLoading(true);
        const response = await fetch(source);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation from ${source}. Status: ${response.status}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
        setError(null); // Clear any previous errors
      } catch (err: any) {
        console.error("Error fetching documentation:", err);
        setError(err.message || "Failed to load documentation.");
        setMarkdownContent(null); // Clear content on error
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [source]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <ErrorBoundary>
      <ReactMarkdown remarkPlugins={[remarkGfm]} children={markdownContent || ''} />
    </ErrorBoundary>
  );
};

export default Documentation;

Now, I will write the code to a file and create the build report.