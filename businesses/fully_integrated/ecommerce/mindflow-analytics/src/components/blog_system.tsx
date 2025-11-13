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
  author: { name, avatar },
  publishedDate,
  updatedDate,
}) => {
  // Ensure that the title and author name are not empty
  if (!title || !name) {
    return null;
  }

  // Ensure that the published date is a valid date string
  const publishedDateObj = new Date(publishedDate);
  if (isNaN(publishedDateObj.getTime())) {
    return null;
  }

  // Ensure that the updated date is a valid date string, if provided
  let updatedDateObj: Date | null = null;
  if (updatedDate) {
    updatedDateObj = new Date(updatedDate);
    if (isNaN(updatedDateObj.getTime())) {
      updatedDateObj = null;
    }
  }

  return (
    <article aria-label={title}>
      <header>
        <h1>{title}</h1>
        <div className="author-info">
          {avatar && <img src={avatar} alt={`${name}'s avatar`} />}
          <p>
            By <span className="author-name">{name}</span> |{' '}
            <time dateTime={publishedDateObj.toISOString()}>
              Published on {publishedDateObj.toLocaleDateString()}
            </time>
            {updatedDateObj && (
              <>
                {' '}
                | <time dateTime={updatedDateObj.toISOString()}>
                  Updated on {updatedDateObj.toLocaleDateString()}
                </time>
              </>
            )}
          </p>
        </div>
      </header>
      <div className="blog-content">{content}</div>
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
  author: { name, avatar },
  publishedDate,
  updatedDate,
}) => {
  // Ensure that the title and author name are not empty
  if (!title || !name) {
    return null;
  }

  // Ensure that the published date is a valid date string
  const publishedDateObj = new Date(publishedDate);
  if (isNaN(publishedDateObj.getTime())) {
    return null;
  }

  // Ensure that the updated date is a valid date string, if provided
  let updatedDateObj: Date | null = null;
  if (updatedDate) {
    updatedDateObj = new Date(updatedDate);
    if (isNaN(updatedDateObj.getTime())) {
      updatedDateObj = null;
    }
  }

  return (
    <article aria-label={title}>
      <header>
        <h1>{title}</h1>
        <div className="author-info">
          {avatar && <img src={avatar} alt={`${name}'s avatar`} />}
          <p>
            By <span className="author-name">{name}</span> |{' '}
            <time dateTime={publishedDateObj.toISOString()}>
              Published on {publishedDateObj.toLocaleDateString()}
            </time>
            {updatedDateObj && (
              <>
                {' '}
                | <time dateTime={updatedDateObj.toISOString()}>
                  Updated on {updatedDateObj.toLocaleDateString()}
                </time>
              </>
            )}
          </p>
        </div>
      </header>
      <div className="blog-content">{content}</div>
    </article>
  );
};

export default BlogPost;