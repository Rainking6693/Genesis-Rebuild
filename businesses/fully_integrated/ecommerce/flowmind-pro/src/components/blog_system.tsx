import React from 'react';

interface BlogPostProps {
  title?: string;
  content?: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, content }) => {
  // Resiliency: Handle empty or null/undefined values
  const safeTitle = title ?? 'Untitled';
  const safeContent = content ?? 'No content available.';

  return (
    <article aria-label={safeTitle} role="article">
      <header>
        <h1 id="blog-post-title">{safeTitle}</h1>
      </header>
      <div aria-describedby="blog-post-title">
        <p>{safeContent}</p>
      </div>
    </article>
  );
};

export default BlogPost;

import React from 'react';

interface BlogPostProps {
  title?: string;
  content?: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, content }) => {
  // Resiliency: Handle empty or null/undefined values
  const safeTitle = title ?? 'Untitled';
  const safeContent = content ?? 'No content available.';

  return (
    <article aria-label={safeTitle} role="article">
      <header>
        <h1 id="blog-post-title">{safeTitle}</h1>
      </header>
      <div aria-describedby="blog-post-title">
        <p>{safeContent}</p>
      </div>
    </article>
  );
};

export default BlogPost;