import React from 'react';

interface BlogPostProps {
  title: string;
  content: string;
  author?: string;
  datePublished?: string;
  imageUrl?: string; // Optional image for the blog post
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  author,
  datePublished,
  imageUrl,
}) => {
  // Ensure that the title and content are not empty
  if (!title.trim() || !content.trim()) {
    return null;
  }

  // Ensure that the image URL is valid
  const validImageUrl = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '';

  return (
    <article aria-label={title} className="blog-post">
      {validImageUrl && (
        <img
          src={imageUrl}
          alt={`Image for ${title}`}
          style={{ maxWidth: '100%', height: 'auto' }}
          loading="lazy"
          decoding="async"
        />
      )}
      <h2 className="blog-post__title">{title}</h2>
      {author && <p className="blog-post__author">By: {author}</p>}
      {datePublished && (
        <time
          className="blog-post__date"
          dateTime={datePublished}
          aria-label={new Date(datePublished).toLocaleDateString()}
        >
          {new Date(datePublished).toLocaleDateString()}
        </time>
      )}
      <div className="blog-post__content">{content}</div>
    </article>
  );
};

export default BlogPost;

import React from 'react';

interface BlogPostProps {
  title: string;
  content: string;
  author?: string;
  datePublished?: string;
  imageUrl?: string; // Optional image for the blog post
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  author,
  datePublished,
  imageUrl,
}) => {
  // Ensure that the title and content are not empty
  if (!title.trim() || !content.trim()) {
    return null;
  }

  // Ensure that the image URL is valid
  const validImageUrl = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '';

  return (
    <article aria-label={title} className="blog-post">
      {validImageUrl && (
        <img
          src={imageUrl}
          alt={`Image for ${title}`}
          style={{ maxWidth: '100%', height: 'auto' }}
          loading="lazy"
          decoding="async"
        />
      )}
      <h2 className="blog-post__title">{title}</h2>
      {author && <p className="blog-post__author">By: {author}</p>}
      {datePublished && (
        <time
          className="blog-post__date"
          dateTime={datePublished}
          aria-label={new Date(datePublished).toLocaleDateString()}
        >
          {new Date(datePublished).toLocaleDateString()}
        </time>
      )}
      <div className="blog-post__content">{content}</div>
    </article>
  );
};

export default BlogPost;