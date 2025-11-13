import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';
import { EcoProfitAnalytics } from '../../../constants';

interface BlogPostProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  subtitle: string;
  content: string;
  children?: React.ReactNode; // Allows for additional elements within the BlogPost component
}

const BlogPost: React.FC<BlogPostProps> = ({ title, subtitle, content, children, ...rest }) => {
  // Adding a default value for children to prevent errors when no additional elements are provided
  const renderedChildren = children || null;

  // Adding role="main" for accessibility
  const mainAttributes = { ...rest, role: 'main' };

  return (
    <div {...mainAttributes}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {renderedChildren}
      <footer>
        <small>
          Powered by {EcoProfitAnalytics} - Your partner in sustainable business growth.
        </small>
      </footer>
    </div>
  );
};

export default BlogPost;

import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';
import { EcoProfitAnalytics } from '../../../constants';

interface BlogPostProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  subtitle: string;
  content: string;
  children?: React.ReactNode; // Allows for additional elements within the BlogPost component
}

const BlogPost: React.FC<BlogPostProps> = ({ title, subtitle, content, children, ...rest }) => {
  // Adding a default value for children to prevent errors when no additional elements are provided
  const renderedChildren = children || null;

  // Adding role="main" for accessibility
  const mainAttributes = { ...rest, role: 'main' };

  return (
    <div {...mainAttributes}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {renderedChildren}
      <footer>
        <small>
          Powered by {EcoProfitAnalytics} - Your partner in sustainable business growth.
        </small>
      </footer>
    </div>
  );
};

export default BlogPost;