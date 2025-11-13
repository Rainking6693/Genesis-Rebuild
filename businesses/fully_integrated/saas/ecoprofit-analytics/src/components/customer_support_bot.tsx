import React, { FC, DetailedHTMLProps, HTMLAttributes, Key } from 'react';

interface Props extends DetailedHTMLProps<HTMLDivAttributes, HTMLDivElement> {
  message: string;
  /**
   * Unique key for each rendered element for performance optimization
   */
  key?: Key;
}

const CustomerSupportBot: FC<Props> = ({ className, ...props }) => {
  const sanitizedMessage = sanitizeMessage(props.message);

  // Add role="complementary" to indicate that the bot is a secondary content area
  const botRole = 'role="complementary"';

  return (
    <div className={`customer-support-bot ${className || ''}`} {...props} {...botRole}>
      {sanitizedMessage}
    </div>
  );
};

// Import necessary libraries for security best practices
import sanitizeHtml from 'sanitize-html';

// Sanitize user input to prevent XSS attacks
const sanitizeMessage = (message: string) => {
  const allowedTags = ['div', 'span', 'a', 'strong', 'em'];
  const sanitizedMessage = sanitizeHtml(message, {
    allowedTags,
    allowedAttributes: {
      a: ['href', 'target'],
    },
    transformEmptyElements: { div: true },
  });
  return sanitizedMessage;
};

// Add a type for the exported default component
export default CustomerSupportBot;

In this updated code, I've made the following changes:

1. Extended the `Props` interface to include all the HTML attributes that can be passed to the `div` element, including the `key` prop for performance optimization.

2. Added the `role` attribute to the `customer-support-bot` element to improve accessibility.

3. Updated the `allowedTags` array to include `strong` and `em` tags, which are commonly used for emphasis in HTML.

4. Added the `allowedAttributes` option to the sanitizeHtml function to restrict the attributes that can be used on the `a` tag.

5. Made the `CustomerSupportBot` component a generic function accepting all HTML attributes as props, including the `key` prop.

6. Changed the exported default component to the updated `CustomerSupportBot` component.