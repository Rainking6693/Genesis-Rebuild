import React, { PropsWithChildren, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  content: string;
  className?: string;
  children?: ReactNode;
}

const BlogPost: React.FC<Props> = ({ title, subtitle, content, className, children }) => {
  // Adding a className prop for styling
  // Adding ARIA attributes for accessibility
  return (
    <div className={className} aria-labelledby="title-id" role="article">
      <h1 id="title-id">{title}</h1>
      <h2>{subtitle}</h2>
      <article dangerouslySetInnerHTML={{ __html: content }} />
      {/* Adding an article tag for semantic purposes */}
      {children && <div>{children}</div>}
      {/* Rendering children if provided */}
    </div>
  );
};

// Adding a defaultProps object to handle missing props
BlogPost.defaultProps = {
  className: '',
  children: null,
};

export default BlogPost;

In this version, I've added an `id` attribute to the title for better accessibility, and I've also added a `role` attribute to the main `div` to indicate that it's an article. The children prop is now of type `ReactNode`, which allows for more flexibility in the types of elements that can be rendered within the BlogPost component.