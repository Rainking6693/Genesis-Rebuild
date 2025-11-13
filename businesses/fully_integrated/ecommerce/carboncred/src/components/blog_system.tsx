import React, { FC, useRef, useState } from 'react';

type BlogPostProps = {
  title: string;
  subtitle?: string;
  content: string;
};

const BlogPost: React.FC<BlogPostProps> = ({ title, subtitle = '', content }) => {
  const sanitize = (html: string) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText;
  };

  const [sanitizedContent, setSanitizedContent] = useState(sanitize(content));
  const contentRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (contentRef.current) {
      setSanitizedContent(sanitize(contentRef.current.innerHTML));
    }
  }, [content]);

  return (
    <div key="blog-post" role="article" aria-label="Blog post">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div ref={contentRef} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      <noscript dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

BlogPost.defaultProps = {
  subtitle: '',
};

export default BlogPost;

import React, { FC, useRef, useState } from 'react';

type BlogPostProps = {
  title: string;
  subtitle?: string;
  content: string;
};

const BlogPost: React.FC<BlogPostProps> = ({ title, subtitle = '', content }) => {
  const sanitize = (html: string) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText;
  };

  const [sanitizedContent, setSanitizedContent] = useState(sanitize(content));
  const contentRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (contentRef.current) {
      setSanitizedContent(sanitize(contentRef.current.innerHTML));
    }
  }, [content]);

  return (
    <div key="blog-post" role="article" aria-label="Blog post">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div ref={contentRef} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      <noscript dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

BlogPost.defaultProps = {
  subtitle: '',
};

export default BlogPost;