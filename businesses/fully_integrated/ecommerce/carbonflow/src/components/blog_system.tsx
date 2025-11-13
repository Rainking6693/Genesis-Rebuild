import React from 'react';

interface BlogPostProps {
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedDate: string;
  updatedDate?: string;
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  author,
  publishedDate,
  updatedDate,
}) => {
  // Handle edge cases
  if (!title || !content || !author || !publishedDate) {
    return (
      <article aria-label="Error: Missing blog post data">
        <header>
          <h2>Error: Missing blog post data</h2>
        </header>
        <p>
          The blog post could not be displayed due to missing data. Please
          contact the site administrator for assistance.
        </p>
      </article>
    );
  }

  // Ensure accessibility
  const authorName = author.name || 'Unknown Author';
  const authorAvatar = author.avatar || '/default-avatar.png';

  return (
    <article aria-label={title}>
      <header>
        <h2>{title}</h2>
        <p>
          <img
            src={authorAvatar}
            alt={`${authorName}'s avatar`}
            width={32}
            height={32}
          />
          By {authorName} | Published on {publishedDate}
          {updatedDate && ` | Updated on ${updatedDate}`}
        </p>
      </header>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        aria-live="polite"
        role="region"
      />
    </article>
  );
};

export default BlogPost;

import React from 'react';

interface BlogPostProps {
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedDate: string;
  updatedDate?: string;
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  author,
  publishedDate,
  updatedDate,
}) => {
  // Handle edge cases
  if (!title || !content || !author || !publishedDate) {
    return (
      <article aria-label="Error: Missing blog post data">
        <header>
          <h2>Error: Missing blog post data</h2>
        </header>
        <p>
          The blog post could not be displayed due to missing data. Please
          contact the site administrator for assistance.
        </p>
      </article>
    );
  }

  // Ensure accessibility
  const authorName = author.name || 'Unknown Author';
  const authorAvatar = author.avatar || '/default-avatar.png';

  return (
    <article aria-label={title}>
      <header>
        <h2>{title}</h2>
        <p>
          <img
            src={authorAvatar}
            alt={`${authorName}'s avatar`}
            width={32}
            height={32}
          />
          By {authorName} | Published on {publishedDate}
          {updatedDate && ` | Updated on ${updatedDate}`}
        </p>
      </header>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        aria-live="polite"
        role="region"
      />
    </article>
  );
};

export default BlogPost;