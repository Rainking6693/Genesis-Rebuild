import React, { FC, Key, ReactNode } from 'react';

interface BlogPostProps {
  id: string; // Unique identifier for each blog post
  title: string;
  content: string;
  author: string;
  publishDate: Date;
  tags: string[];
}

interface BlogListProps {
  posts: BlogPostProps[];
}

const BlogPost: FC<BlogPostProps> = ({ id, title, content, author, publishDate, tags }) => {
  const formattedPublishDate = publishDate.toLocaleDateString(navigator.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long', // Adding the day of the week for better accessibility
  });

  return (
    <article key={id}>
      <h2>{title}</h2>
      <p>By {author}, {formattedPublishDate}</p>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
};

const BlogList: FC<BlogListProps> = ({ posts }) => {
  return (
    <section>
      {posts.map((post) => (
        <BlogPost key={post.id} {...post} />
      ))}
    </section>
  );
};

// Adding a default key prop for BlogPost to avoid warnings
const defaultKey = 'default-key';

const BlogPostWithDefaultKey: FC<Omit<BlogPostProps, 'id'>> = ({ id, ...props }) => {
  return <BlogPost id={id || defaultKey} {...props} />;
};

// Using BlogPostWithDefaultKey in BlogList to ensure a unique key for each BlogPost
const BlogListWithDefaultKey: FC<BlogListProps> = ({ posts }) => {
  return (
    <section>
      {posts.map((post) => (
        <BlogPostWithDefaultKey key={post.id || post.title || post.author || post.publishDate.toString()} {...post} />
      ))}
    </section>
  );
};

export default BlogListWithDefaultKey;

import React, { FC, Key, ReactNode } from 'react';

interface BlogPostProps {
  id: string; // Unique identifier for each blog post
  title: string;
  content: string;
  author: string;
  publishDate: Date;
  tags: string[];
}

interface BlogListProps {
  posts: BlogPostProps[];
}

const BlogPost: FC<BlogPostProps> = ({ id, title, content, author, publishDate, tags }) => {
  const formattedPublishDate = publishDate.toLocaleDateString(navigator.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long', // Adding the day of the week for better accessibility
  });

  return (
    <article key={id}>
      <h2>{title}</h2>
      <p>By {author}, {formattedPublishDate}</p>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
};

const BlogList: FC<BlogListProps> = ({ posts }) => {
  return (
    <section>
      {posts.map((post) => (
        <BlogPost key={post.id} {...post} />
      ))}
    </section>
  );
};

// Adding a default key prop for BlogPost to avoid warnings
const defaultKey = 'default-key';

const BlogPostWithDefaultKey: FC<Omit<BlogPostProps, 'id'>> = ({ id, ...props }) => {
  return <BlogPost id={id || defaultKey} {...props} />;
};

// Using BlogPostWithDefaultKey in BlogList to ensure a unique key for each BlogPost
const BlogListWithDefaultKey: FC<BlogListProps> = ({ posts }) => {
  return (
    <section>
      {posts.map((post) => (
        <BlogPostWithDefaultKey key={post.id || post.title || post.author || post.publishDate.toString()} {...post} />
      ))}
    </section>
  );
};

export default BlogListWithDefaultKey;