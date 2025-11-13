import React, { PropsWithChildren, ReactNode } from 'react';

interface BlogPostProps {
  title: string;
  subtitle: string;
  content: string;
  className?: string;
  children?: ReactNode;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, subtitle, content, className, children }) => {
  const handleOnError = (e: React.SyntheticEvent<HTMLDivElement, Event>) => {
    e.currentTarget.innerHTML = 'An error occurred while rendering the content.';
  };

  return (
    <div className={className} onError={handleOnError}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {children}
    </div>
  );
};

export { BlogPost };

// Add a new BlogPostWithChildren component with improved accessibility
interface BlogPostWithChildrenProps extends BlogPostProps {
  children?: ReactNode;
}

const BlogPostWithChildren: React.FC<BlogPostWithChildrenProps> = ({ title, subtitle, content, children, className }) => {
  const handleOnError = (e: React.SyntheticEvent<HTMLDivElement, Event>) => {
    e.currentTarget.innerHTML = 'An error occurred while rendering the content.';
  };

  return (
    <div className={className} onError={handleOnError}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div>
        {children && (
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            aria-hidden={true}
          />
        )}
        {children}
      </div>
    </div>
  );
};

export { BlogPostWithChildren };

import React, { PropsWithChildren, ReactNode } from 'react';

interface BlogPostProps {
  title: string;
  subtitle: string;
  content: string;
  className?: string;
  children?: ReactNode;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, subtitle, content, className, children }) => {
  const handleOnError = (e: React.SyntheticEvent<HTMLDivElement, Event>) => {
    e.currentTarget.innerHTML = 'An error occurred while rendering the content.';
  };

  return (
    <div className={className} onError={handleOnError}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {children}
    </div>
  );
};

export { BlogPost };

// Add a new BlogPostWithChildren component with improved accessibility
interface BlogPostWithChildrenProps extends BlogPostProps {
  children?: ReactNode;
}

const BlogPostWithChildren: React.FC<BlogPostWithChildrenProps> = ({ title, subtitle, content, children, className }) => {
  const handleOnError = (e: React.SyntheticEvent<HTMLDivElement, Event>) => {
    e.currentTarget.innerHTML = 'An error occurred while rendering the content.';
  };

  return (
    <div className={className} onError={handleOnError}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div>
        {children && (
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            aria-hidden={true}
          />
        )}
        {children}
      </div>
    </div>
  );
};

export { BlogPostWithChildren };