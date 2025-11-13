// src/components/DocsComponent.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

interface DocsProps {
  apiEndpoint: string;
}

const DocsComponent: React.FC<DocsProps> = ({ apiEndpoint }) => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiEndpoint);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
      } catch (e: any) {
        setError(`Failed to load documentation: ${e.message}`);
        console.error("Error fetching documentation:", e); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [apiEndpoint]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="docs-container">
      <Markdown>{markdownContent || '# Documentation not available'}</Markdown>
    </div>
  );
};

export default DocsComponent;

// src/components/DocsComponent.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

interface DocsProps {
  apiEndpoint: string;
}

const DocsComponent: React.FC<DocsProps> = ({ apiEndpoint }) => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiEndpoint);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
      } catch (e: any) {
        setError(`Failed to load documentation: ${e.message}`);
        console.error("Error fetching documentation:", e); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [apiEndpoint]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="docs-container">
      <Markdown>{markdownContent || '# Documentation not available'}</Markdown>
    </div>
  );
};

export default DocsComponent;

Now, I will use the `Write` tool to save this code to `src/components/DocsComponent.tsx`.

Finally, I will create the build report.