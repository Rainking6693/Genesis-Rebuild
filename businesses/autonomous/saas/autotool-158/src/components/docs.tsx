// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

interface DocumentationProps {
  filePath: string;
}

const Documentation: React.FC<DocumentationProps> = ({ filePath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        setLoading(true);
        const response = await fetch(filePath);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
        setError(null);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(`Error loading documentation: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [filePath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="documentation">
      <Markdown>{markdownContent}</Markdown>
    </div>
  );
};

export default Documentation;

// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

interface DocumentationProps {
  filePath: string;
}

const Documentation: React.FC<DocumentationProps> = ({ filePath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        setLoading(true);
        const response = await fetch(filePath);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
        setError(null);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(`Error loading documentation: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [filePath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="documentation">
      <Markdown>{markdownContent}</Markdown>
    </div>
  );
};

export default Documentation;