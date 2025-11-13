// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocsProps {
  docPath: string;
}

const Docs: React.FC<DocsProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
        setMarkdownContent(text);
        setError(null); // Clear any previous errors
      } catch (e: any) {
        console.error("Error fetching or processing documentation:", e);
        setError(`Failed to load documentation: ${e.message}`);
        setMarkdownContent(null);
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

  if (!markdownContent) {
    return <div>No documentation found.</div>;
  }

  return (
    <div className="docs-container">
      <Markdown remarkPlugins={[remarkGfm]}>{markdownContent}</Markdown>
    </div>
  );
};

export default Docs;

// Example usage:
// <Docs docPath="/docs/getting-started.md" />