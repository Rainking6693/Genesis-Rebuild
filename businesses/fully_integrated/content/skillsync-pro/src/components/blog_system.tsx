import React, { PropsWithChildren, DefaultHTMLProps } from 'react';

interface SEOProps extends DefaultHTMLProps<HTMLMetaElement> {
  title: string; // Add a title for SEO and better structure
  description: string; // Add a description for SEO and better understanding of the blog post
  keywords: string[]; // Add relevant keywords for SEO
}

interface BlogPostProps extends PropsWithChildren<SEOProps> {
  // Rename 'content' to 'children' for better semantics
  children: React.ReactNode;
}

const BlogPostSEO: React.FC<SEOProps> = ({ title, description, keywords, ...metaProps }) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      {/* Add role="SEO" to the meta tags for better accessibility */}
      <meta name="description" {...metaProps} />
      <meta name="keywords" {...metaProps} />
    </>
  );
};

const BlogPost: React.FC<BlogPostProps> = ({ children, ...seoProps }) => {
  return (
    <article>
      <header>
        <BlogPostSEO {...seoProps} />
      </header>
      <main>{children}</main>
    </article>
  );
};

export default BlogPost;

import React, { PropsWithChildren, DefaultHTMLProps } from 'react';

interface SEOProps extends DefaultHTMLProps<HTMLMetaElement> {
  title: string; // Add a title for SEO and better structure
  description: string; // Add a description for SEO and better understanding of the blog post
  keywords: string[]; // Add relevant keywords for SEO
}

interface BlogPostProps extends PropsWithChildren<SEOProps> {
  // Rename 'content' to 'children' for better semantics
  children: React.ReactNode;
}

const BlogPostSEO: React.FC<SEOProps> = ({ title, description, keywords, ...metaProps }) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      {/* Add role="SEO" to the meta tags for better accessibility */}
      <meta name="description" {...metaProps} />
      <meta name="keywords" {...metaProps} />
    </>
  );
};

const BlogPost: React.FC<BlogPostProps> = ({ children, ...seoProps }) => {
  return (
    <article>
      <header>
        <BlogPostSEO {...seoProps} />
      </header>
      <main>{children}</main>
    </article>
  );
};

export default BlogPost;