// src/components/Docs.tsx
import React, { useState, useEffect, Suspense } from 'react';

interface DocsProps {
  contentSource: string; // URL or file path to the documentation content
}

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Update state so the next render will show the fallback UI.
    const errorHandler = (error: any, errorInfo: any) => {
      console.error("Caught an error: ", error, errorInfo);
      setHasError(true);
    }

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    // You can render any custom fallback UI
    return <h1>Something went wrong. Please try again later.</h1>;
  }

  return children;
}

const Loading = () => {
  return <div>Loading documentation...</div>;
}

const DocsContent = ({ contentSource }: DocsProps) => {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(contentSource);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(`Failed to load documentation: ${e.message}`);
        setContent(null);
      }
    };

    fetchContent();
  }, [contentSource]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (content === null) {
    return <Loading />;
  }

  return (
    <div className="docs-container">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

const Docs: React.FC<DocsProps> = ({ contentSource }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <DocsContent contentSource={contentSource} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect, Suspense } from 'react';

interface DocsProps {
  contentSource: string; // URL or file path to the documentation content
}

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Update state so the next render will show the fallback UI.
    const errorHandler = (error: any, errorInfo: any) => {
      console.error("Caught an error: ", error, errorInfo);
      setHasError(true);
    }

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    // You can render any custom fallback UI
    return <h1>Something went wrong. Please try again later.</h1>;
  }

  return children;
}

const Loading = () => {
  return <div>Loading documentation...</div>;
}

const DocsContent = ({ contentSource }: DocsProps) => {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(contentSource);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(`Failed to load documentation: ${e.message}`);
        setContent(null);
      }
    };

    fetchContent();
  }, [contentSource]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (content === null) {
    return <Loading />;
  }

  return (
    <div className="docs-container">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

const Docs: React.FC<DocsProps> = ({ contentSource }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <DocsContent contentSource={contentSource} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Docs;

Now, let's add some basic styling. I'll use the `Write` tool to create a CSS file.

And now, let's edit the `Docs.tsx` file to import the CSS.

Finally, here's the build report: