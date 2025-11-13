// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Assuming markdown for documentation

interface DocsProps {
  docPath: string; // Path to the markdown documentation file
}

const Docs: React.FC<DocsProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(docPath);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
        setError(null); // Clear any previous errors
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(`Failed to load documentation: ${e.message}`);
        setMarkdownContent(''); // Clear content on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocs();
  }, [docPath]);

  if (isLoading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="docs-container">
      <Markdown>{markdownContent}</Markdown>
    </div>
  );
};

export default Docs;

// Example Usage:
// <Docs docPath="/docs/getting-started.md" />

// Error Boundary Considerations:
// This component includes internal error handling for fetching documentation.
// For broader application-level error handling, consider wrapping this component
// in an Error Boundary component.

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Assuming markdown for documentation

interface DocsProps {
  docPath: string; // Path to the markdown documentation file
}

const Docs: React.FC<DocsProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(docPath);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
        setError(null); // Clear any previous errors
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(`Failed to load documentation: ${e.message}`);
        setMarkdownContent(''); // Clear content on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocs();
  }, [docPath]);

  if (isLoading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="docs-container">
      <Markdown>{markdownContent}</Markdown>
    </div>
  );
};

export default Docs;

// Example Usage:
// <Docs docPath="/docs/getting-started.md" />

// Error Boundary Considerations:
// This component includes internal error handling for fetching documentation.
// For broader application-level error handling, consider wrapping this component
// in an Error Boundary component.