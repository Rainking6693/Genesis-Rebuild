import React, { PropsWithChildren, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  title: string;
  subtitle: string;
  content: string;
  className?: string;
  children?: ReactNode; // Allows for additional elements within the BlogPost component
}

const BlogPost: React.FC<Props> = ({ title, subtitle, content, className, children }) => {
  // Adding a className prop for styling flexibility
  // Allowing for additional elements within the BlogPost component using children prop

  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div className={className}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>

      {children}

      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </div>
  );
};

// Adding a defaultProps object to provide default values for optional props
BlogPost.defaultProps = {
  className: '',
};

export default BlogPost;

import React, { PropsWithChildren, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  title: string;
  subtitle: string;
  content: string;
  className?: string;
  children?: ReactNode; // Allows for additional elements within the BlogPost component
}

const BlogPost: React.FC<Props> = ({ title, subtitle, content, className, children }) => {
  // Adding a className prop for styling flexibility
  // Allowing for additional elements within the BlogPost component using children prop

  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div className={className}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>

      {children}

      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </div>
  );
};

// Adding a defaultProps object to provide default values for optional props
BlogPost.defaultProps = {
  className: '',
};

export default BlogPost;