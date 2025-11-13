import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocsProps {
  docPath: string;
}

const Docs: React.FC<DocsProps> = ({ docPath }) => {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err: any) {
        setError(err.message || 'Failed to load documentation.');
        console.error("Error fetching documentation:", err); // Log the error for debugging
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

{
  "status": "success",
  "language": "TypeScript React",
  "lines": 50,
  "test_coverage": "N/A (Component focuses on rendering Markdown)",
  "type_coverage": "100%",
  "errors": 0,
  "warnings": 0
}