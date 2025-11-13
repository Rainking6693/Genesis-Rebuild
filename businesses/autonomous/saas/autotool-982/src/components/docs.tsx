// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentationProps {
  docPath: string;
}

const Documentation: React.FC<DocumentationProps> = ({ docPath }) => {
  const [markdown, setMarkdown] = useState<string>('');
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
        setMarkdown(text);
        setLoading(false);
      } catch (err: any) { // Explicitly type 'err' as 'any' to access 'message'
        setError(err.message || 'An unexpected error occurred.');
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [docPath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error loading documentation: {error}
      </div>
    );
  }

  return (
    <div className="documentation">
      <Markdown remarkPlugins={[remarkGfm]} children={markdown} />
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
  const [markdown, setMarkdown] = useState<string>('');
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
        setMarkdown(text);
        setLoading(false);
      } catch (err: any) { // Explicitly type 'err' as 'any' to access 'message'
        setError(err.message || 'An unexpected error occurred.');
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [docPath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error loading documentation: {error}
      </div>
    );
  }

  return (
    <div className="documentation">
      <Markdown remarkPlugins={[remarkGfm]} children={markdown} />
    </div>
  );
};

export default Documentation;