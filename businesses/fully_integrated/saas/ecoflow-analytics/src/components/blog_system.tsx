import React from 'react';

interface BlogPostProps {
  title?: string;
  content?: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, content }) => {
  // Resiliency: Handle edge cases for title and content
  const safeTitle = title ?? 'Untitled';
  const safeContent = content ?? 'No content available.';

  return (
    <article aria-label={safeTitle} role="article" className="blog-post">
      <header className="blog-post-header">
        <h1 className="blog-post-title">{safeTitle}</h1>
      </header>
      <section className="blog-post-content">
        <div dangerouslySetInnerHTML={{ __html: safeContent }} />
      </section>
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
  // Resiliency: Handle edge cases for title and content
  const safeTitle = title ?? 'Untitled';
  const safeContent = content ?? 'No content available.';

  return (
    <article aria-label={safeTitle} role="article" className="blog-post">
      <header className="blog-post-header">
        <h1 className="blog-post-title">{safeTitle}</h1>
      </header>
      <section className="blog-post-content">
        <div dangerouslySetInnerHTML={{ __html: safeContent }} />
      </section>
    </article>
  );
};

export default BlogPost;