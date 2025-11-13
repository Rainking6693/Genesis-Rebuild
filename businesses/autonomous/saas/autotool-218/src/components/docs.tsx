// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Assuming Markdown for content
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown
import rehypeRaw from 'rehype-raw'; // To allow raw HTML in Markdown (use with caution!)

interface DocsProps {
  docPath: string; // Path to the Markdown document
}

const Docs: React.FC<DocsProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        setError(null);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(`Failed to load documentation: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [docPath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="docs-container">
      <Markdown
        children={markdownContent}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]} // Be careful with this!
        components={{
          // Customize rendering of specific elements if needed
          // e.g., to handle images, links, etc.
        }}
      />
    </div>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Assuming Markdown for content
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown
import rehypeRaw from 'rehype-raw'; // To allow raw HTML in Markdown (use with caution!)

interface DocsProps {
  docPath: string; // Path to the Markdown document
}

const Docs: React.FC<DocsProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        setError(null);
      } catch (e: any) {
        console.error("Error fetching documentation:", e);
        setError(`Failed to load documentation: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [docPath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="docs-container">
      <Markdown
        children={markdownContent}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]} // Be careful with this!
        components={{
          // Customize rendering of specific elements if needed
          // e.g., to handle images, links, etc.
        }}
      />
    </div>
  );
};

export default Docs;

Now, I'll use the `Write` tool to save this code to `src/components/Docs.tsx`.

Finally, I'll create the build report.