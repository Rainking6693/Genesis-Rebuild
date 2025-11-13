// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface DocsProps {
  contentPath: string;
}

const Docs: React.FC<DocsProps> = ({ contentPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMarkdown = async () => {
      setLoading(true);
      try {
        const response = await fetch(contentPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        setMarkdownContent(text);
        setError(null);
      } catch (e: any) {
        console.error("Error fetching markdown:", e);
        setError(`Failed to load documentation: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [contentPath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="docs-container">
      <Markdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
      >
        {markdownContent}
      </Markdown>
    </div>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface DocsProps {
  contentPath: string;
}

const Docs: React.FC<DocsProps> = ({ contentPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMarkdown = async () => {
      setLoading(true);
      try {
        const response = await fetch(contentPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        setMarkdownContent(text);
        setError(null);
      } catch (e: any) {
        console.error("Error fetching markdown:", e);
        setError(`Failed to load documentation: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [contentPath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="docs-container">
      <Markdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
      >
        {markdownContent}
      </Markdown>
    </div>
  );
};

export default Docs;