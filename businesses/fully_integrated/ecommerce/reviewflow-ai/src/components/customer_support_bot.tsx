import React, { FC, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';
import { useMemo } from 'react';

interface Props {
  message: string;
}

const CustomerSupportBot: FC<Props> = memo(({ message }) => {
  const sanitize = useCallback(
    (html: string) => {
      // Sanitize user-generated content before rendering
      return sanitizeHtml(html, {
        allowedTags: ['div', 'span', 'a', 'strong', 'em', 'img'],
        allowedAttributes: {
          'div': ['class'],
          'span': ['class'],
          'a': ['href', 'target', 'rel', 'aria-label'], // Add aria-label for accessibility
          'img': ['src', 'alt', 'title', 'class', 'aria-describedby'], // Add aria-describedby for accessibility
          'strong': [],
          'em': [],
        },
      });
    },
    [] // Empty dependency array to prevent re-rendering the sanitize function unnecessarily
  );

  const sanitizedMessage = useMemo(() => sanitize(message), [message, sanitize]);

  return (
    <div className="customer-support-bot" data-testid="customer-support-bot">
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
});

CustomerSupportBot.propTypes = {
  message: PropTypes.string.isRequired,
};

export default CustomerSupportBot;

1. Extracted the sanitize function into a separate callback to avoid unnecessary re-renders.
2. Added `aria-label` and `aria-describedby` attributes to the `a` and `img` tags for better accessibility.
3. Added a `data-testid` attribute to the component for easier testing.
4. Used TypeScript interfaces to define the props types.
5. Made the component more maintainable by separating concerns and using functional components with hooks.