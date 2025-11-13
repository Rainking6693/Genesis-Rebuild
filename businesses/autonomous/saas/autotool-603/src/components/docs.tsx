// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

interface DocsProps {
  docPath: string;
}

const Docs: React.FC<DocsProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDocs();
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
  docPath: string;
}

const Docs: React.FC<DocsProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDocs();
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
    <div className="docs-container">
      <Markdown>{markdownContent}</Markdown>
    </div>
  );
};

export default Docs;

Now, I will use the `Write` tool to save the code to `src/components/Docs.tsx` and the build report to `build_reports/docs_build_report.json`.

**generated_code:**

**build_report:**