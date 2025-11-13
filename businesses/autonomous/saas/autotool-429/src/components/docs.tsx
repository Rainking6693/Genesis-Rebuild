// src/components/Docs.tsx
import React, { useState, useEffect, Suspense } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocsProps {
  docPath: string;
}

function Docs({ docPath }: DocsProps) {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(docPath);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }

        const text = await response.text();
        setMarkdown(text);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(e);
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
    return (
      <div>
        Error loading documentation: {error.message}
      </div>
    );
  }

  if (!markdown) {
    return <div>No documentation found.</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </Suspense>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div>
        <h1>Something went wrong.</h1>
        <button onClick={() => setHasError(false)}>Try again</button>
      </div>
    );
  }

  return <>{children}</>;
}

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect, Suspense } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocsProps {
  docPath: string;
}

function Docs({ docPath }: DocsProps) {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(docPath);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }

        const text = await response.text();
        setMarkdown(text);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(e);
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
    return (
      <div>
        Error loading documentation: {error.message}
      </div>
    );
  }

  if (!markdown) {
    return <div>No documentation found.</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </Suspense>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div>
        <h1>Something went wrong.</h1>
        <button onClick={() => setHasError(false)}>Try again</button>
      </div>
    );
  }

  return <>{children}</>;
}

export default Docs;

**Write**

**Output:**