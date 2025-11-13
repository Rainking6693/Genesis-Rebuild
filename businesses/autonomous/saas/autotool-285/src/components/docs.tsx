// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocsProps {
  docPath: string;
}

const Docs: React.FC<DocsProps> = ({ docPath }) => {
  const [markdown, setMarkdown] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(docPath);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        setMarkdown(text);
        setError(null);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(`Failed to load documentation: ${e.message}`);
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

  return (
    <div className="docs-container">
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </div>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocsProps {
  docPath: string;
}

const Docs: React.FC<DocsProps> = ({ docPath }) => {
  const [markdown, setMarkdown] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(docPath);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        setMarkdown(text);
        setError(null);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(`Failed to load documentation: ${e.message}`);
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

  return (
    <div className="docs-container">
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </div>
  );
};

export default Docs;

Now, I will provide the build report.