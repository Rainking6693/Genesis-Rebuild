import React, { FC, ReactNode, useRef, useState } from 'react';

interface BlogPostProps {
  title: string;
  children?: ReactNode; // Allows for additional content within the BlogPost component
  id?: string; // Added optional id prop for better accessibility and SEO
}

const BlogPost: FC<BlogPostProps> = ({ title, children, id }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <article>
      <h1 id={id || title.toLowerCase().replace(/\W+/g, '-')}>{title}</h1>
      <div ref={contentRef}>
        {children}
      </div>
      <button type="button" onClick={handleClick}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
      {isExpanded && contentRef.current && (
        <div id={`${title.toLowerCase().replace(/\W+/g, '-')}-content`}>
          {contentRef.current.innerHTML}
        </div>
      )}
    </article>
  );
};

// Add a default export for better code organization
export default BlogPost;

import React, { FC, ReactNode, useRef, useState } from 'react';

interface BlogPostProps {
  title: string;
  children?: ReactNode; // Allows for additional content within the BlogPost component
  id?: string; // Added optional id prop for better accessibility and SEO
}

const BlogPost: FC<BlogPostProps> = ({ title, children, id }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <article>
      <h1 id={id || title.toLowerCase().replace(/\W+/g, '-')}>{title}</h1>
      <div ref={contentRef}>
        {children}
      </div>
      <button type="button" onClick={handleClick}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
      {isExpanded && contentRef.current && (
        <div id={`${title.toLowerCase().replace(/\W+/g, '-')}-content`}>
          {contentRef.current.innerHTML}
        </div>
      )}
    </article>
  );
};

// Add a default export for better code organization
export default BlogPost;