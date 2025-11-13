// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

interface DocsProps {
  contentUrl: string;
}

const Docs: React.FC<DocsProps> = ({ contentUrl }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(contentUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
      } catch (e: any) {
        setError(e.message || 'Failed to load documentation.');
        console.error("Error fetching documentation:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [contentUrl]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="docs-container">
      <Markdown>{markdownContent}</Markdown>
    </div>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

interface DocsProps {
  contentUrl: string;
}

const Docs: React.FC<DocsProps> = ({ contentUrl }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(contentUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
      } catch (e: any) {
        setError(e.message || 'Failed to load documentation.');
        console.error("Error fetching documentation:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [contentUrl]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="docs-container">
      <Markdown>{markdownContent}</Markdown>
    </div>
  );
};

export default Docs;

Now, the build report:

**Output:**