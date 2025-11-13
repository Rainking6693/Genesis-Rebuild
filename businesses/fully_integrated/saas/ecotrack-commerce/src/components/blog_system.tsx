import React from 'react';

interface BlogPostProps {
  title: string;
  content: string;
  author?: string;
  publishedDate?: Date;
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  author,
  publishedDate,
}) => {
  // Ensure that the title and content are not empty
  if (!title.trim() || !content.trim()) {
    return null;
  }

  // Ensure that the publishedDate is a valid Date object
  const formattedPublishedDate = publishedDate
    ? publishedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  return (
    <article aria-label={title} role="article">
      <header>
        <h1 id={title.replace(/\s/g, '-').toLowerCase()}>{title}</h1>
        {author && <p>By {author}</p>}
        <p>Published on {formattedPublishedDate}</p>
      </header>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        aria-describedby={title.replace(/\s/g, '-').toLowerCase()}
      />
    </article>
  );
};

export default BlogPost;

import React from 'react';

interface BlogPostProps {
  title: string;
  content: string;
  author?: string;
  publishedDate?: Date;
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  author,
  publishedDate,
}) => {
  // Ensure that the title and content are not empty
  if (!title.trim() || !content.trim()) {
    return null;
  }

  // Ensure that the publishedDate is a valid Date object
  const formattedPublishedDate = publishedDate
    ? publishedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  return (
    <article aria-label={title} role="article">
      <header>
        <h1 id={title.replace(/\s/g, '-').toLowerCase()}>{title}</h1>
        {author && <p>By {author}</p>}
        <p>Published on {formattedPublishedDate}</p>
      </header>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        aria-describedby={title.replace(/\s/g, '-').toLowerCase()}
      />
    </article>
  );
};

export default BlogPost;