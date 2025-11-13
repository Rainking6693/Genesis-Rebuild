// src/components/Documentation.tsx
import React, { useState, useEffect, Suspense } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentationProps {
  source: string; // URL or file path to the documentation content
}

interface DocumentationContent {
  content: string;
}

const Documentation = ({ source }: DocumentationProps) => {
  const [documentation, setDocumentation] = useState<DocumentationContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        setLoading(true);
        const response = await fetch(source);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation from ${source}: ${response.status}`);
        }

        const text = await response.text();
        setDocumentation({ content: text });
      } catch (err: any) {
        setError(err);
        console.error("Error fetching documentation:", err);
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
    return (
      <div>
        Error loading documentation: {error.message}
      </div>
    );
  }

  if (!documentation) {
    return <div>No documentation available.</div>;
  }

  return (
    <Suspense fallback={<div>Loading markdown...</div>}>
      <Markdown remarkPlugins={[remarkGfm]}>{documentation.content}</Markdown>
    </Suspense>
  );
};

export default Documentation;

// src/components/Documentation.tsx
import React, { useState, useEffect, Suspense } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentationProps {
  source: string; // URL or file path to the documentation content
}

interface DocumentationContent {
  content: string;
}

const Documentation = ({ source }: DocumentationProps) => {
  const [documentation, setDocumentation] = useState<DocumentationContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        setLoading(true);
        const response = await fetch(source);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation from ${source}: ${response.status}`);
        }

        const text = await response.text();
        setDocumentation({ content: text });
      } catch (err: any) {
        setError(err);
        console.error("Error fetching documentation:", err);
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
    return (
      <div>
        Error loading documentation: {error.message}
      </div>
    );
  }

  if (!documentation) {
    return <div>No documentation available.</div>;
  }

  return (
    <Suspense fallback={<div>Loading markdown...</div>}>
      <Markdown remarkPlugins={[remarkGfm]}>{documentation.content}</Markdown>
    </Suspense>
  );
};

export default Documentation;

Now, let's create the build report: