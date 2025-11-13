// src/components/BlogPost.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism'

interface BlogPostProps {
  markdownContent: string;
  title: string;
}

function BlogPost({ markdownContent, title }: BlogPostProps) {
  try {
    return (
      <article className="blog-post">
        <h1>{title}</h1>
        <ReactMarkdown
          children={markdownContent}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = (className || '').match(/language-(\w+)/);
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
              )
            }
          }}
        />
      </article>
    );
  } catch (error: any) {
    console.error("Error rendering blog post:", error);
    return (
      <div className="error-boundary">
        <h2>Error Rendering Blog Post</h2>
        <p>An error occurred while rendering this blog post. Please try again later.</p>
        <details>
          <summary>Error Details</summary>
          <pre>{error.message}</pre>
        </details>
      </div>
    );
  }
}

export default BlogPost;

// src/components/BlogPost.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism'

interface BlogPostProps {
  markdownContent: string;
  title: string;
}

function BlogPost({ markdownContent, title }: BlogPostProps) {
  try {
    return (
      <article className="blog-post">
        <h1>{title}</h1>
        <ReactMarkdown
          children={markdownContent}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = (className || '').match(/language-(\w+)/);
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
              )
            }
          }}
        />
      </article>
    );
  } catch (error: any) {
    console.error("Error rendering blog post:", error);
    return (
      <div className="error-boundary">
        <h2>Error Rendering Blog Post</h2>
        <p>An error occurred while rendering this blog post. Please try again later.</p>
        <details>
          <summary>Error Details</summary>
          <pre>{error.message}</pre>
        </details>
      </div>
    );
  }
}

export default BlogPost;