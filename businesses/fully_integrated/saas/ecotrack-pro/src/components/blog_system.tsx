import React, { PropsWithChildren, ReactNode } from 'react';
import { EcoTrackPro } from '../../../constants';

interface BlogPostProps {
  title: string;
  subtitle: string;
  content: string;
  children?: ReactNode; // Allows for additional elements within the BlogPost component
  className?: string; // Adding a class name prop for styling
}

const BlogPost: React.FC<BlogPostProps> = ({ title, subtitle, content, children, className }) => {
  // Adding a default value for children to prevent errors when no additional elements are provided
  const renderedChildren = children || null;

  // Adding a check for non-empty content to prevent rendering an empty div
  if (!content.trim()) return null;

  // Adding a check for non-empty subtitle to prevent rendering an h2 tag without content
  if (!subtitle.trim()) subtitle = '';

  // Adding a role="article" for accessibility
  return (
    <article className={className}>
      <h1>{title}</h1>
      <h2 role="presentation" dangerouslySetInnerHTML={{ __html: subtitle.trim() }} /> {/* Setting role="presentation" to prevent screen readers from reading the subtitle as a heading */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {renderedChildren}
      <footer>
        <small>
          Powered by {EcoTrackPro} - Your AI-powered carbon footprint tracking and compliance platform.
        </small>
      </footer>
    </article>
  );
};

export default BlogPost;

import React, { PropsWithChildren, ReactNode } from 'react';
import { EcoTrackPro } from '../../../constants';

interface BlogPostProps {
  title: string;
  subtitle: string;
  content: string;
  children?: ReactNode; // Allows for additional elements within the BlogPost component
  className?: string; // Adding a class name prop for styling
}

const BlogPost: React.FC<BlogPostProps> = ({ title, subtitle, content, children, className }) => {
  // Adding a default value for children to prevent errors when no additional elements are provided
  const renderedChildren = children || null;

  // Adding a check for non-empty content to prevent rendering an empty div
  if (!content.trim()) return null;

  // Adding a check for non-empty subtitle to prevent rendering an h2 tag without content
  if (!subtitle.trim()) subtitle = '';

  // Adding a role="article" for accessibility
  return (
    <article className={className}>
      <h1>{title}</h1>
      <h2 role="presentation" dangerouslySetInnerHTML={{ __html: subtitle.trim() }} /> {/* Setting role="presentation" to prevent screen readers from reading the subtitle as a heading */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {renderedChildren}
      <footer>
        <small>
          Powered by {EcoTrackPro} - Your AI-powered carbon footprint tracking and compliance platform.
        </small>
      </footer>
    </article>
  );
};

export default BlogPost;