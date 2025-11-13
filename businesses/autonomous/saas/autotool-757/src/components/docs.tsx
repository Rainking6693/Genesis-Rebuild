// src/components/Docs.tsx
import React, { useState, useEffect, Suspense } from 'react';

interface DocContent {
  title: string;
  content: string;
}

const Loading = () => <p>Loading documentation...</p>;
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: Error, errorInfo: React.ErrorInfo) => {
      console.error("Error in Docs component:", error, errorInfo);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return <p>An error occurred while loading the documentation. Please try again later.</p>;
  }

  return children;
};

const fetchDocContent = async (docId: string): Promise<DocContent> => {
  try {
    // Simulate fetching documentation from an API
    const response = await fetch(`/api/docs/${docId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch documentation: ${response.status}`);
    }
    const data = await response.json();
    return {
      title: data.title,
      content: data.content,
    };
  } catch (error: any) {
    console.error("Error fetching documentation:", error);
    throw new Error(`Failed to load documentation: ${error.message}`);
  }
};

const DocContentComponent = ({ docId }: { docId: string }) => {
  const [docContent, setDocContent] = useState<DocContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const content = await fetchDocContent(docId);
        setDocContent(content);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocContent();
  }, [docId]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!docContent) {
    return <p>No documentation found.</p>;
  }

  return (
    <div>
      <h2>{docContent.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: docContent.content }} />
    </div>
  );
};

export default function Docs({ docId }: { docId: string }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <DocContentComponent docId={docId} />
      </Suspense>
    </ErrorBoundary>
  );
}

// src/components/Docs.tsx
import React, { useState, useEffect, Suspense } from 'react';

interface DocContent {
  title: string;
  content: string;
}

const Loading = () => <p>Loading documentation...</p>;
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: Error, errorInfo: React.ErrorInfo) => {
      console.error("Error in Docs component:", error, errorInfo);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return <p>An error occurred while loading the documentation. Please try again later.</p>;
  }

  return children;
};

const fetchDocContent = async (docId: string): Promise<DocContent> => {
  try {
    // Simulate fetching documentation from an API
    const response = await fetch(`/api/docs/${docId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch documentation: ${response.status}`);
    }
    const data = await response.json();
    return {
      title: data.title,
      content: data.content,
    };
  } catch (error: any) {
    console.error("Error fetching documentation:", error);
    throw new Error(`Failed to load documentation: ${error.message}`);
  }
};

const DocContentComponent = ({ docId }: { docId: string }) => {
  const [docContent, setDocContent] = useState<DocContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const content = await fetchDocContent(docId);
        setDocContent(content);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocContent();
  }, [docId]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!docContent) {
    return <p>No documentation found.</p>;
  }

  return (
    <div>
      <h2>{docContent.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: docContent.content }} />
    </div>
  );
};

export default function Docs({ docId }: { docId: string }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <DocContentComponent docId={docId} />
      </Suspense>
    </ErrorBoundary>
  );
}