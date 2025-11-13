// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Assuming react-markdown is used for rendering Markdown
import remarkGfm from 'remark-gfm'; // Add GitHub Flavored Markdown support
import rehypeRaw from 'rehype-raw'; // Allow raw HTML in Markdown (use with caution!)

interface DocsProps {
  docPath: string; // Path to the Markdown document
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
          throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching documentation.');
        setLoading(false);
      }
    };

    fetchDocs();
  }, [docPath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="docs-container">
      <Markdown
        children={markdownContent}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]} // Be careful with raw HTML!
        components={{
          // Optionally customize rendering of specific elements
          // e.g.,
          // a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
        }}
      />
    </div>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Assuming react-markdown is used for rendering Markdown
import remarkGfm from 'remark-gfm'; // Add GitHub Flavored Markdown support
import rehypeRaw from 'rehype-raw'; // Allow raw HTML in Markdown (use with caution!)

interface DocsProps {
  docPath: string; // Path to the Markdown document
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
          throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching documentation.');
        setLoading(false);
      }
    };

    fetchDocs();
  }, [docPath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="docs-container">
      <Markdown
        children={markdownContent}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]} // Be careful with raw HTML!
        components={{
          // Optionally customize rendering of specific elements
          // e.g.,
          // a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
        }}
      />
    </div>
  );
};

export default Docs;