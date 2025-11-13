import React, { useMemo, useState } from 'react';
import { EcoTraceAIComponentProps, BlogPostMessage } from '../../../common/types';
import { sanitizeHtml } from 'sanitize-html';

/**
 * MyComponent - A React component that displays a sanitized HTML string representing a blog post.
 * This component is optimized for performance, resiliency, accessibility, and maintainability.
 */
const MyComponent: React.FC<EcoTraceAIComponentProps<BlogPostMessage>> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<string | null>(null);

  useMemo(() => {
    const allowedTags = ['p', 'a', 'strong', 'em', 'img'];
    const allowedAttributes = {
      a: ['href', 'target'],
      img: ['src', 'alt'],
    };

    if (message) {
      setSanitizedMessage(sanitizeHtml(message, { allowedTags, allowedAttributes }));
    } else {
      setSanitizedMessage(null);
    }
  }, [message]);

  if (!sanitizedMessage) {
    return <div>No blog post available</div>;
  }

  // Add ARIA attributes for accessibility
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} aria-label="Blog post content">
        {/* Screen reader only announcement for the blog post */}
        <div className="sr-only">Blog post content</div>
      </div>
    </div>
  );
};

export default React.memo(MyComponent);

In this version, I made the following improvements:

1. Storing the sanitized message in a state variable to handle cases where the message is null or undefined.
2. Using the `useMemo` hook to optimize performance by memoizing the sanitized message, but only when the message prop changes.
3. Adding TypeScript type annotations for the component and the message prop.
4. Using the `useState` hook to manage the state of the sanitized message.
5. Improving the code structure for better readability and maintainability.
6. Adding comments to explain the purpose of the code.