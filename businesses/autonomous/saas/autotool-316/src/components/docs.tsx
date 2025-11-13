// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentationProps {
  docPath: string;
}

const Documentation: React.FC<DocumentationProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        setError(null);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(`Failed to load documentation. Please check the path and try again. Error: ${e.message}`);
      } finally {
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
      <Markdown remarkPlugins={[remarkGfm]}>{markdownContent}</Markdown>
    </div>
  );
};

export default Documentation;

// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentationProps {
  docPath: string;
}

const Documentation: React.FC<DocumentationProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        setError(null);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(`Failed to load documentation. Please check the path and try again. Error: ${e.message}`);
      } finally {
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
      <Markdown remarkPlugins={[remarkGfm]}>{markdownContent}</Markdown>
    </div>
  );
};

export default Documentation;

Now, I'll use the `Write` tool to save this code to `src/components/Documentation.tsx`.

Finally, I will generate the build report.