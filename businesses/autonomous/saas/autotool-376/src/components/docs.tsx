// src/components/DocsComponent.tsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DocsComponentProps {
  docPath: string;
}

const DocsComponent: React.FC<DocsComponentProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMarkdown = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(docPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }
        const text = await response.text();
        setMarkdownContent(text);
        setError(null);
      } catch (e: any) {
        setError(`Error loading documentation: ${e.message}`);
        setMarkdownContent(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkdown();
  }, [docPath]);

  if (isLoading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!markdownContent) {
    return <div>No documentation found.</div>;
  }

  return (
    <div className="docs-container">
      <ReactMarkdown
        children={markdownContent}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={dracula}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
};

export default DocsComponent;

// src/components/DocsComponent.tsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DocsComponentProps {
  docPath: string;
}

const DocsComponent: React.FC<DocsComponentProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMarkdown = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(docPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }
        const text = await response.text();
        setMarkdownContent(text);
        setError(null);
      } catch (e: any) {
        setError(`Error loading documentation: ${e.message}`);
        setMarkdownContent(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkdown();
  }, [docPath]);

  if (isLoading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!markdownContent) {
    return <div>No documentation found.</div>;
  }

  return (
    <div className="docs-container">
      <ReactMarkdown
        children={markdownContent}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={dracula}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
};

export default DocsComponent;

Now, I will generate the build report: