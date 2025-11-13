import React, { FC, useEffect } from 'react';
import { useSEO } from './useSEO';

interface BlogPostProps {
  title: string;
  content: string;
  author: string;
  publishDate: Date;
  tags?: string[];
}

const BlogPost: FC<BlogPostProps> = ({ title, content, author, publishDate, tags }) => {
  const safeTitle = getSafeValue(title);
  const safeContent = getSafeValue(content);
  const safeAuthor = getSafeValue(author);
  const safeTags = getSafeArray(tags);

  useEffect(() => {
    useBlogPostSEO(safeTitle, safeContent, safeAuthor, publishDate, safeTags);
  }, [safeTitle, safeContent, safeAuthor, publishDate, safeTags]);

  return (
    <article>
      <h1>{safeTitle}</h1>
      <h2>{safeAuthor}</h2>
      <time dateTime={publishDate.toISOString()}>{publishDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</time>
      <ul>
        {safeTags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <div dangerouslySetInnerHTML={{ __html: safeContent }} />
    </article>
  );
};

export default BlogPost;

// Add a custom hook for SEO optimization
import { useSEO } from './useSEO';

export const useBlogPostSEO = (title: string, content: string, author: string, publishDate: Date, tags: string[]) => {
  const safeTitle = getSafeValue(title);
  const safeContent = getSafeValue(content);
  const safeAuthor = getSafeValue(author);
  const safeTags = getSafeArray(tags);

  useSEO({
    title: `${safeTitle} - EcoSell Academy`,
    description: safeContent.length > 160 ? `${safeContent.slice(0, 160)}...` : safeContent,
    author: safeAuthor,
    publishDate: publishDate.toISOString(),
    tags: safeTags.join(', '),
  });
};

// Add a utility function to handle empty or undefined values
export const getSafeValue = (value: any) => {
  return value !== undefined && value !== null ? value : '';
};

// Add a utility function to handle empty or undefined arrays
export const getSafeArray = <T>(array: T[] | undefined | null) => {
  return array !== undefined && array !== null ? array : [];
};

// Add a utility function to format date for accessibility
export const formatDateForAccessibility = (date: Date) => {
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

import React, { FC, useEffect } from 'react';
import { useSEO } from './useSEO';

interface BlogPostProps {
  title: string;
  content: string;
  author: string;
  publishDate: Date;
  tags?: string[];
}

const BlogPost: FC<BlogPostProps> = ({ title, content, author, publishDate, tags }) => {
  const safeTitle = getSafeValue(title);
  const safeContent = getSafeValue(content);
  const safeAuthor = getSafeValue(author);
  const safeTags = getSafeArray(tags);

  useEffect(() => {
    useBlogPostSEO(safeTitle, safeContent, safeAuthor, publishDate, safeTags);
  }, [safeTitle, safeContent, safeAuthor, publishDate, safeTags]);

  return (
    <article>
      <h1>{safeTitle}</h1>
      <h2>{safeAuthor}</h2>
      <time dateTime={publishDate.toISOString()}>{publishDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</time>
      <ul>
        {safeTags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <div dangerouslySetInnerHTML={{ __html: safeContent }} />
    </article>
  );
};

export default BlogPost;

// Add a custom hook for SEO optimization
import { useSEO } from './useSEO';

export const useBlogPostSEO = (title: string, content: string, author: string, publishDate: Date, tags: string[]) => {
  const safeTitle = getSafeValue(title);
  const safeContent = getSafeValue(content);
  const safeAuthor = getSafeValue(author);
  const safeTags = getSafeArray(tags);

  useSEO({
    title: `${safeTitle} - EcoSell Academy`,
    description: safeContent.length > 160 ? `${safeContent.slice(0, 160)}...` : safeContent,
    author: safeAuthor,
    publishDate: publishDate.toISOString(),
    tags: safeTags.join(', '),
  });
};

// Add a utility function to handle empty or undefined values
export const getSafeValue = (value: any) => {
  return value !== undefined && value !== null ? value : '';
};

// Add a utility function to handle empty or undefined arrays
export const getSafeArray = <T>(array: T[] | undefined | null) => {
  return array !== undefined && array !== null ? array : [];
};

// Add a utility function to format date for accessibility
export const formatDateForAccessibility = (date: Date) => {
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};