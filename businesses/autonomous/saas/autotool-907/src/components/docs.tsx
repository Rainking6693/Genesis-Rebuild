// src/components/DocsComponent.tsx
import React, { useState, useEffect, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

const DocsContainer = styled.div`
  padding: 20px;
  font-family: sans-serif;
  line-height: 1.6;
`;

const ErrorMessage = styled.div`
  color: red;
  font-weight: bold;
`;

const LoadingMessage = styled.div`
  font-style: italic;
  color: grey;
`;

interface DocsComponentProps {
  docUrl: string;
}

function DocsComponent({ docUrl }: DocsComponentProps) {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(docUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        setMarkdown(text);
        setError(null);
      } catch (e: any) {
        setError(`Failed to load documentation: ${e.message}`);
        setMarkdown(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [docUrl]);

  if (loading) {
    return <LoadingMessage>Loading documentation...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <DocsContainer>
      <Suspense fallback={<LoadingMessage>Rendering documentation...</LoadingMessage>}>
        {markdown && (
          <ReactMarkdown
            children={markdown}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={atomDark}
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
        )}
      </Suspense>
    </DocsContainer>
  );
}

export default DocsComponent;

// src/components/DocsComponent.tsx
import React, { useState, useEffect, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

const DocsContainer = styled.div`
  padding: 20px;
  font-family: sans-serif;
  line-height: 1.6;
`;

const ErrorMessage = styled.div`
  color: red;
  font-weight: bold;
`;

const LoadingMessage = styled.div`
  font-style: italic;
  color: grey;
`;

interface DocsComponentProps {
  docUrl: string;
}

function DocsComponent({ docUrl }: DocsComponentProps) {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(docUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        setMarkdown(text);
        setError(null);
      } catch (e: any) {
        setError(`Failed to load documentation: ${e.message}`);
        setMarkdown(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [docUrl]);

  if (loading) {
    return <LoadingMessage>Loading documentation...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <DocsContainer>
      <Suspense fallback={<LoadingMessage>Rendering documentation...</LoadingMessage>}>
        {markdown && (
          <ReactMarkdown
            children={markdown}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={atomDark}
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
        )}
      </Suspense>
    </DocsContainer>
  );
}

export default DocsComponent;

Now, I will use the `Write` tool to save this code to `src/components/DocsComponent.tsx`.

Finally, I will generate the build report.