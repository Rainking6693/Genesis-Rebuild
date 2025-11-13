import React from 'react';
import { Link as GatsbyLink, useSiteMetadata } from 'gatsby';

interface Props {
  to: string;
  label: string;
}

const LinkComponent: React.FC<Props> = ({ to, label }) => {
  return <GatsbyLink to={to}>{label}</GatsbyLink>;
};

interface BlogData {
  title?: string;
  subtitle?: string;
  content: string;
  seo?: {
    title?: string;
    description?: string;
  };
  cta?: {
    label?: string;
    to?: string;
  };
}

const BlogPostDefaultProps = {
  title: '',
  subtitle: '',
  content: '',
  seo: {},
  cta: {},
};

const BlogPost: React.FC<{ blogData: BlogData }> = ({ blogData }) => {
  const { title: seoTitle, description: seoDescription, ...rest } = blogData;
  const { siteMetadata } = useSiteMetadata();

  const defaultSEO = {
    title: siteMetadata.title,
    description: siteMetadata.description,
  };

  const defaultCTA: BlogData['cta'] = {};

  return (
    <div>
      {seoTitle || defaultSEO.title && <h1>{seoTitle || defaultSEO.title}</h1>}
      {seoDescription || defaultSEO.description && (
        <h2>{seoDescription || defaultSEO.description}</h2>
      )}
      <div dangerouslySetInnerHTML={{ __html: rest.content }} />
      {rest.cta || defaultCTA && <LinkComponent to={rest.cta?.to || defaultCTA.to} label={rest.cta?.label || defaultCTA.label} />}
    </div>
  );
};

BlogPost.defaultProps = BlogPostDefaultProps;

interface BlogDataSource {
  allMarkdownRemark: {
    edges: {
      node: {
        frontmatter: BlogData;
      };
    }[];
  };
}

const Blog: React.FC<{ data: BlogDataSource }> = ({ data }) => {
  return (
    <div>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <BlogPost key={node.frontmatter.title} blogData={node.frontmatter} />
      ))}
    </div>
  );
};

export default Blog;

import React from 'react';
import { Link as GatsbyLink, useSiteMetadata } from 'gatsby';

interface Props {
  to: string;
  label: string;
}

const LinkComponent: React.FC<Props> = ({ to, label }) => {
  return <GatsbyLink to={to}>{label}</GatsbyLink>;
};

interface BlogData {
  title?: string;
  subtitle?: string;
  content: string;
  seo?: {
    title?: string;
    description?: string;
  };
  cta?: {
    label?: string;
    to?: string;
  };
}

const BlogPostDefaultProps = {
  title: '',
  subtitle: '',
  content: '',
  seo: {},
  cta: {},
};

const BlogPost: React.FC<{ blogData: BlogData }> = ({ blogData }) => {
  const { title: seoTitle, description: seoDescription, ...rest } = blogData;
  const { siteMetadata } = useSiteMetadata();

  const defaultSEO = {
    title: siteMetadata.title,
    description: siteMetadata.description,
  };

  const defaultCTA: BlogData['cta'] = {};

  return (
    <div>
      {seoTitle || defaultSEO.title && <h1>{seoTitle || defaultSEO.title}</h1>}
      {seoDescription || defaultSEO.description && (
        <h2>{seoDescription || defaultSEO.description}</h2>
      )}
      <div dangerouslySetInnerHTML={{ __html: rest.content }} />
      {rest.cta || defaultCTA && <LinkComponent to={rest.cta?.to || defaultCTA.to} label={rest.cta?.label || defaultCTA.label} />}
    </div>
  );
};

BlogPost.defaultProps = BlogPostDefaultProps;

interface BlogDataSource {
  allMarkdownRemark: {
    edges: {
      node: {
        frontmatter: BlogData;
      };
    }[];
  };
}

const Blog: React.FC<{ data: BlogDataSource }> = ({ data }) => {
  return (
    <div>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <BlogPost key={node.frontmatter.title} blogData={node.frontmatter} />
      ))}
    </div>
  );
};

export default Blog;