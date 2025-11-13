import React from 'react';

interface BlogPostProps {
  title?: string;
  content?: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, content }) => {
  // Resiliency: Handle edge cases for title and content
  const safeTitle = title || 'Untitled';
  const safeContent = content || 'No content available.';

  return (
    <article aria-label={safeTitle} role="article" data-testid="blog-post">
      <header>
        <h1 id="blog-post-title" data-testid="blog-post-title">
          {safeTitle}
        </h1>
      </header>
      <section aria-describedby="blog-post-title" data-testid="blog-post-content">
        <p>{safeContent}</p>
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
  const safeTitle = title || 'Untitled';
  const safeContent = content || 'No content available.';

  return (
    <article aria-label={safeTitle} role="article" data-testid="blog-post">
      <header>
        <h1 id="blog-post-title" data-testid="blog-post-title">
          {safeTitle}
        </h1>
      </header>
      <section aria-describedby="blog-post-title" data-testid="blog-post-content">
        <p>{safeContent}</p>
      </section>
    </article>
  );
};

export default BlogPost;