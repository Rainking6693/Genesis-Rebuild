import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';
import { Props as BlogComponentProps } from './BlogComponent';
import DOMPurify from 'dompurify';

// Import DOMPurify for sanitizing HTML
import 'dompurify/dist/dompurify.min.js';

// BlogPost component
const BlogPost: FC<Omit<BlogComponentProps, 'children'>> = ({ message }) => {
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Handle invalid HTML
  if (!sanitizedMessage) {
    return <div>Invalid HTML detected. Please provide a valid message.</div>;
  }

  return (
    <div>
      {/* Add ARIA attributes for accessibility */}
      <article aria-label="Blog post" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

// BlogComponent component
const BlogComponent: FC<BlogComponentProps> = ({ message, ...rest }) => {
  // Handle empty or null message
  if (!message) {
    return <div>No blog post available.</div>;
  }

  // Add ARIA attributes for accessibility
  const blogComponentProps: HTMLAttributes<HTMLDivElement> = {
    ...rest,
    role: 'region',
    aria-labelledby: 'blog-post-title', // Assuming there's a title for the blog post
  };

  return <div {...blogComponentProps}>
    <BlogPost message={message} />
  </div>;
};

// Separate styles for better maintainability
import styles from './BlogComponent.module.css';

export default BlogComponent;

In this updated code, I've replaced the `DOMParser` with `DOMPurify` for sanitizing HTML, which is more secure and recommended for production use. I've also added ARIA attributes for the `BlogComponent` to improve accessibility. Additionally, I've created a `blogComponentProps` object to pass the remaining props to the `div` element, which makes it easier to manage and maintain the props for the `BlogComponent`.