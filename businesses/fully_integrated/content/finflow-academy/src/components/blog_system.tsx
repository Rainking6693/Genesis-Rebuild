import React, { PropsWithChildren, ReactNode } from 'react';

interface SEOProps {
  title: string; // Add a title for SEO and better structure
  description?: string; // Add a description for SEO and better understanding of the blog post (optional)
  keywords?: string[]; // Add relevant keywords for SEO (optional)
}

interface BlogPostProps extends PropsWithChildren<SEOProps> {
  // Rename 'content' to 'children' for better semantics
  children?: ReactNode;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, description, keywords, children }) => {
  // Add a default description if not provided
  const defaultDescription = 'Read the latest insights and articles on our blog.';
  const providedDescription = description || defaultDescription;

  // Validate the provided keywords and ensure they are an array
  const validKeywords = keywords ? (Array.isArray(keywords) ? keywords : [keywords]) : [];

  // Join keywords with commas for SEO
  const keywordString = validKeywords.join(', ');

  return (
    <article>
      <header>
        <title>{title}</title> {/* Use <title> for SEO */}
        <meta name="description" content={providedDescription} /> {/* Use meta description for SEO */}
        <meta name="keywords" content={keywordString} /> {/* Join keywords with commas for SEO */}
      </header>
      <main>{children}</main> {/* Wrap content in <main> for better semantics */}
    </article>
  );
};

export default BlogPost;

import React, { PropsWithChildren, ReactNode } from 'react';

interface SEOProps {
  title: string; // Add a title for SEO and better structure
  description?: string; // Add a description for SEO and better understanding of the blog post (optional)
  keywords?: string[]; // Add relevant keywords for SEO (optional)
}

interface BlogPostProps extends PropsWithChildren<SEOProps> {
  // Rename 'content' to 'children' for better semantics
  children?: ReactNode;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, description, keywords, children }) => {
  // Add a default description if not provided
  const defaultDescription = 'Read the latest insights and articles on our blog.';
  const providedDescription = description || defaultDescription;

  // Validate the provided keywords and ensure they are an array
  const validKeywords = keywords ? (Array.isArray(keywords) ? keywords : [keywords]) : [];

  // Join keywords with commas for SEO
  const keywordString = validKeywords.join(', ');

  return (
    <article>
      <header>
        <title>{title}</title> {/* Use <title> for SEO */}
        <meta name="description" content={providedDescription} /> {/* Use meta description for SEO */}
        <meta name="keywords" content={keywordString} /> {/* Join keywords with commas for SEO */}
      </header>
      <main>{children}</main> {/* Wrap content in <main> for better semantics */}
    </article>
  );
};

export default BlogPost;