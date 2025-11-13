// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

interface DocumentationProps {
  docPath: string;
}

/**
 * Documentation Component: Displays documentation content fetched from a Markdown file.
 * @param {string} docPath - The path to the Markdown file.
 */
const Documentation: React.FC<DocumentationProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        setLoading(true);
        const response = await fetch(docPath);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
        setLoading(false);
      } catch (err: any) {
        setError(`Error loading documentation: ${err.message}`);
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [docPath]);

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
  docPath: string;
}

/**
 * Documentation Component: Displays documentation content fetched from a Markdown file.
 * @param {string} docPath - The path to the Markdown file.
 */
const Documentation: React.FC<DocumentationProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        setLoading(true);
        const response = await fetch(docPath);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
        setLoading(false);
      } catch (err: any) {
        setError(`Error loading documentation: ${err.message}`);
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [docPath]);

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